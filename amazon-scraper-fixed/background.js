let stopRequested = false;
let scrapeTab = null;
let globalSeenAsins = new Set(); // Track across keywords for deduplication

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'START_SCRAPE') {
    stopRequested = false;
    startScrape(msg.keywords, msg.numPages);
  }
  if (msg.type === 'STOP_SCRAPE') {
    stopRequested = true;
  }
  if (msg.type === 'EXPORT_SESSION') {
    exportSessionAsExcel(msg.sessionId);
  }
});

function sendProgress(pct, text, log = null, logType = 'info', stats = null) {
  chrome.runtime.sendMessage({
    type: 'PROGRESS',
    pct,
    text,
    log,
    logType,
    stats
  }).catch(() => {});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function navigateTab(tabId, url) {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, { url }, () => {
      chrome.tabs.onUpdated.addListener(function listener(tid, info) {
        if (tid === tabId && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(resolve, 800);
        }
      });
    });
  });
}

async function execScript(tabId, func, args = []) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func,
      args
    });
    return results?.[0]?.result ?? null;
  } catch (e) {
    return null;
  }
}

// ── NEW: Extract search results with rank and type information ──
function extractSearchResults() {
  const results = [];
  const cards = document.querySelectorAll('[data-component-type="s-search-result"]');
  let rank = 1;

  cards.forEach(card => {
    const asin = card.getAttribute('data-asin');
    if (!asin) return;

    // Detect sponsored
    const isSponsored = !!card.querySelector('.puis-sponsored-label-text') ||
                       !!card.querySelector('[aria-label="Sponsored"]');
    const type = isSponsored ? 'Sponsored' : 'Organic';

    results.push({ asin, rank, type });
    rank++;
  });

  return results;
}

// ── UPDATED: Extract product detail with availability check ──
function extractProductDetail() {
  const d = {};
  d.title = document.getElementById('productTitle')?.innerText?.trim() || 'N/A';

  // Check if page not found
  if (document.title.includes('Page Not Found') || document.title.includes('404')) {
    d.notFound = true;
    return d;
  }

  // ── NEW: Availability check ──
  const availText = document.querySelector('#availability span')?.innerText?.trim()?.toLowerCase() || '';
  const unavailablePatterns = [
    'currently unavailable',
    'temporarily out of stock',
    'this item is currently unavailable'
  ];
  const isUnavailable = unavailablePatterns.some(p => availText.includes(p));

  if (isUnavailable) {
    d.notAvailable = true;
    d.availabilityText = availText;
    return d;
  }

  // Extract price
  const pw = document.querySelector('.a-price .a-price-whole');
  const pf = document.querySelector('.a-price .a-price-fraction');
  d.price = pw ? '$' + pw.innerText.replace(/[\n\s.]/g, '') + '.' + (pf?.innerText || '00') : 'N/A';

  // Extract image
  const img = document.getElementById('landingImage') || document.getElementById('imgBlkFront');
  d.image = img ? img.src.replace(/\._[A-Z0-9_,]+_\./g, '.') : 'No Image Available';

  // Extract sold count
  const sold = [...document.querySelectorAll('span')].find(el => el.innerText?.includes('bought in past month'));
  d.sold = sold ? sold.innerText.trim() : 'N/A';

  // Extract listing date
  let listingDate = 'N/A';
  document.querySelectorAll('#detailBullets_feature_div li, #productDetails_detailBullets_sections1 tr').forEach(row => {
    if (row.innerText.includes('Date First Available')) {
      listingDate = row.innerText.split(':').slice(1).join(':').trim();
    }
  });
  d.listingDate = listingDate;

  // Extract store
  const byline = document.getElementById('bylineInfo');
  if (byline) {
    const a = byline.querySelector('a');
    d.store = (a ? a.innerText : byline.innerText).trim()
      .replace(/^Visit the\s+/i, '').replace(/\s+Store$/i, '').trim();
  } else d.store = 'N/A';

  // Extract seller
  const st = document.getElementById('sellerProfileTriggerId');
  const mi = document.getElementById('merchantInfoFeature_feature_div');
  if (st) d.seller = st.innerText.trim();
  else if (mi) d.seller = mi.innerText.trim().replace(/^Sold by\s+/i, '');
  else d.seller = d.store;

  // Extract stars
  const star = document.querySelector('#acrPopover .a-icon-alt');
  d.stars = star ? star.innerText.trim().replace(' out of 5 stars', '') + ' sao' : 'N/A';

  // Extract review count
  const rc = document.getElementById('acrCustomerReviewText');
  d.reviewCount = rc ? rc.innerText.trim().replace(' ratings', '').replace(' rating', '') : 'N/A';

  // Extract seller ID
  const m = document.documentElement.innerHTML.match(/seller=([A-Z0-9]{10,20})/);
  d.sellerId = m ? m[1] : 'N/A';

  return d;
}

function extractSellerInfo() {
  const section = document.querySelector('#page-section-detail-seller-info');
  if (!section) return 'N/A';
  const text = section.innerText.trim();
  const nameMatch = text.match(/Business Name:\s*(.+)/);
  const addrLines = text.split('\n').filter(l =>
    l.trim() &&
    !l.includes('Detailed Seller') &&
    !l.includes('Business Name') &&
    !l.includes('Business Address')
  );
  const name = nameMatch ? nameMatch[1].trim() : 'N/A';
  const addr = addrLines.join(', ').trim();
  return name !== 'N/A' ? `${name} | ${addr}` : 'N/A';
}

// ── NEW: Save session to storage ──
async function saveSession(sessionData) {
  return new Promise((resolve) => {
    chrome.storage.local.get('sessions', (result) => {
      let sessions = result.sessions || [];
      sessions.unshift(sessionData); // Add to beginning
      sessions = sessions.slice(0, 50); // Cap at 50 sessions
      chrome.storage.local.set({ sessions }, resolve);
    });
  });
}

// ── NEW: Get Supabase config from storage ──
async function getSupabaseConfig() {
  return new Promise(resolve => {
    chrome.storage.local.get('supabaseConfig', r => resolve(r.supabaseConfig || null));
  });
}

// ── NEW: Push session + products to Supabase ──
async function pushToSupabase(sessionData) {
  const config = await getSupabaseConfig();
  if (!config?.url || !config?.key) {
    console.log('[Supabase] Config not set, skipping push');
    return;
  }

  const headers = {
    'apikey': config.key,
    'Authorization': `Bearer ${config.key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  };

  try {
    // 1. Insert session record
    const sessionRes = await fetch(`${config.url}/rest/v1/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: sessionData.id,
        keywords: sessionData.keywords,
        num_pages: sessionData.numPages,
        total_products: sessionData.stats.total,
        valid_products: sessionData.stats.valid,
        invalid_products: sessionData.stats.invalid
      })
    });

    if (!sessionRes.ok) {
      console.error('[Supabase] Session insert failed:', sessionRes.status);
      return;
    }

    // 2. Insert products in batches of 100
    const rows = sessionData.products.map(p => ({
      session_id: sessionData.id,
      keyword: p.keyword,
      asin: p.asin,
      rank: p.rank || null,
      title: p.title,
      image: p.image,
      price: p.price,
      price_numeric: parseFloat(p.price?.replace(/[^0-9.]/g, '')) || null,
      sold: p.sold,
      listing_date: p.listingDate,
      store: p.store,
      seller: p.seller,
      stars: p.stars,
      stars_numeric: parseFloat(p.stars?.replace(' sao', '')) || null,
      review_count: p.reviewCount,
      review_count_numeric: parseInt(p.reviewCount?.replace(/,/g, '')) || null,
      detailed_seller: p.detailedSeller,
      type: p.type || 'N/A',
      scraped_at: p.timestamp || new Date().toISOString()
    }));

    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100);
      const productsRes = await fetch(`${config.url}/rest/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(batch)
      });

      if (!productsRes.ok) {
        console.error(`[Supabase] Batch ${i / 100 + 1} insert failed:`, productsRes.status);
      }
    }

    console.log(`[Supabase] ✅ Pushed ${sessionData.products.length} products to Supabase`);
  } catch (err) {
    console.error('[Supabase] Push error:', err.message);
  }
}

// ── NEW: Export session from storage ──
async function exportSessionAsExcel(sessionId) {
  return new Promise((resolve) => {
    chrome.storage.local.get('sessions', (result) => {
      const sessions = result.sessions || [];
      const session = sessions.find(s => s.id === sessionId);
      if (session && session.products) {
        exportExcel(session.products).then(resolve);
      } else {
        resolve();
      }
    });
  });
}

// ── MAIN: Refactored scraping engine ──
async function startScrape(keywords, numPages) {
  scrapeTab = await new Promise(resolve => {
    chrome.tabs.create({ url: 'https://www.amazon.com', active: false }, tab => resolve(tab));
  });

  const allData = [];
  const totalKeywords = keywords.length;
  globalSeenAsins = new Set(); // Reset for new scrape

  const stats = {
    total: 0,
    valid: 0,
    invalid: 0,
    kwDone: 0,
    kwTotal: totalKeywords
  };

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sessionStartTime = new Date();

  try {
    for (let ki = 0; ki < keywords.length; ki++) {
      if (stopRequested) break;
      const keyword = keywords[ki];
      const keywordSearchResults = new Map(); // {asin => {rank, type}}
      const keywordData = [];

      sendProgress(
        Math.round((ki / totalKeywords) * 100),
        `Keyword <span>${ki + 1}/${totalKeywords}</span>: <span>${keyword}</span>`,
        `🔑 Keyword: "${keyword}"`,
        'info',
        stats
      );

      for (let page = 1; page <= numPages; page++) {
        if (stopRequested) break;
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&page=${page}`;
        await navigateTab(scrapeTab.id, url);
        await sleep(500);

        const searchResults = await execScript(scrapeTab.id, extractSearchResults);
        if (!searchResults || searchResults.length === 0) {
          sendProgress(null, null, `⚠️ Trang ${page} không có ASIN`, 'err', stats);
          continue;
        }

        let newCount = 0;
        searchResults.forEach(result => {
          if (!keywordSearchResults.has(result.asin)) {
            keywordSearchResults.set(result.asin, { rank: result.rank, type: result.type });
            newCount++;
          }
        });

        sendProgress(
          Math.round(((ki + page / numPages) / totalKeywords) * 80),
          `Keyword <span>${ki + 1}/${totalKeywords}</span> · Trang <span>${page}/${numPages}</span> · <span>${keywordSearchResults.size} ASINs</span>`,
          `📄 Trang ${page}: +${newCount} ASINs (tổng: ${keywordSearchResults.size})`,
          'ok',
          stats
        );
      }

      // Filter out already-seen ASINs from other keywords
      const asinList = [...keywordSearchResults.keys()].filter(asin => !globalSeenAsins.has(asin));

      for (let ai = 0; ai < asinList.length; ai++) {
        if (stopRequested) break;
        const asin = asinList[ai];

        sendProgress(
          Math.round(((ki + 0.5 + (ai / asinList.length) * 0.5) / totalKeywords) * 90),
          `Keyword <span>${ki + 1}/${totalKeywords}</span> · ASIN <span>${ai + 1}/${asinList.length}</span>: ${asin}`,
          null,
          'info',
          stats
        );

        await navigateTab(scrapeTab.id, `https://www.amazon.com/dp/${asin}`);
        const detail = await execScript(scrapeTab.id, extractProductDetail);

        // Skip if not found or unavailable
        if (!detail || detail.notFound || detail.notAvailable) {
          stats.invalid++;
          const reason = detail?.notFound ? 'Not Found' : 'Unavailable';
          sendProgress(null, null, `⚠️ ${asin}: ${reason} — bỏ qua`, 'err', stats);
          continue;
        }

        stats.valid++;
        stats.total++;

        // Get rank and type from search results
        const { rank, type } = keywordSearchResults.get(asin);
        const timestamp = new Date().toISOString();

        let detailedSeller = 'N/A';
        if (detail.seller === 'Amazon.com' || detail.store === 'Amazon Echo & Alexa') {
          detailedSeller = 'Amazon.com LLC';
        } else if (detail.sellerId && detail.sellerId !== 'N/A') {
          await navigateTab(scrapeTab.id, `https://www.amazon.com/sp?seller=${detail.sellerId}`);
          detailedSeller = await execScript(scrapeTab.id, extractSellerInfo) || 'N/A';
        }

        keywordData.push({
          keyword,
          asin,
          rank,
          title: detail.title,
          image: detail.image,
          price: detail.price,
          sold: detail.sold,
          listingDate: detail.listingDate,
          store: detail.store,
          seller: detail.seller,
          stars: detail.stars,
          reviewCount: detail.reviewCount,
          detailedSeller,
          type,
          timestamp
        });

        globalSeenAsins.add(asin); // Track globally
        sendProgress(null, null, `✅ ${asin}: ${detail.title.substring(0, 40)}...`, 'ok', stats);
        await sleep(300);
      }

      stats.kwDone++;
      allData.push(...keywordData);
      sendProgress(
        Math.round(((ki + 1) / totalKeywords) * 90),
        `Xong keyword <span>${ki + 1}/${totalKeywords}</span>: <span>${keywordData.length} sản phẩm</span>`,
        `🎉 "${keyword}": ${keywordData.length} sản phẩm`,
        'ok',
        stats
      );
    }

    if (!stopRequested && allData.length > 0) {
      sendProgress(95, 'Đang tạo file Excel...', '📊 Đang xuất Excel...', 'info', stats);
      await exportExcel(allData);

      // Save session to storage
      const sessionData = {
        id: sessionId,
        timestamp: sessionStartTime.toISOString(),
        keywords,
        numPages,
        products: allData,
        stats: {
          total: stats.total,
          valid: stats.valid,
          invalid: stats.invalid
        }
      };
      await saveSession(sessionData);
      await pushToSupabase(sessionData); // Push to Supabase

      sendProgress(100, 'Hoàn tất!', null, 'info', stats);
    }

    chrome.tabs.remove(scrapeTab.id);
    scrapeTab = null;

    if (stopRequested) {
      chrome.runtime.sendMessage({ type: 'STOPPED' }).catch(() => {});
    } else {
      chrome.runtime.sendMessage({
        type: 'DONE',
        totalAsins: stats.total,
        totalKeywords: keywords.length,
        sessionId,
        stats
      }).catch(() => {});
    }

  } catch (err) {
    chrome.runtime.sendMessage({ type: 'ERROR', text: err.message }).catch(() => {});
    if (scrapeTab) chrome.tabs.remove(scrapeTab.id);
  }
}

// ── UPDATED: Export Excel with 15 columns ──
async function exportExcel(data) {
  const exportTab = await new Promise(resolve => {
    chrome.tabs.create({ url: 'https://www.amazon.com', active: false }, t => resolve(t));
  });

  await new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function listener(tid, info) {
      if (tid === exportTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        setTimeout(resolve, 1000);
      }
    });
  });

  await chrome.scripting.executeScript({
    target: { tabId: exportTab.id },
    files: ['libs/xlsx.full.min.js']
  });

  await chrome.scripting.executeScript({
    target: { tabId: exportTab.id },
    func: (rows) => { window._exportData = rows; },
    args: [data]
  });

  await chrome.scripting.executeScript({
    target: { tabId: exportTab.id },
    func: () => {
      try {
        const data = window._exportData;
        // 15 columns as per spec
        const headers = [
          'Keyword', 'ASIN', 'Rank', 'Title', 'Image', 'Price',
          'Sold', 'Listing Date', 'Store', 'Seller', 'Stars',
          'Reviews', 'Detailed Seller', 'Type', 'Timestamp'
        ];
        const rows = data.map(r => [
          r.keyword,
          r.asin,
          r.rank || 'N/A',
          r.title,
          r.image,
          r.price,
          r.sold,
          r.listingDate,
          r.store,
          r.seller,
          r.stars,
          r.reviewCount,
          r.detailedSeller,
          r.type || 'N/A',
          r.timestamp || 'N/A'
        ]);
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        ws['!cols'] = [
          {wch:16},{wch:14},{wch:8},{wch:52},{wch:45},{wch:12},
          {wch:22},{wch:18},{wch:20},{wch:20},{wch:10},{wch:12},{wch:60},{wch:12},{wch:25}
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Amazon Data');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amazon_scraper_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.remove();
        }, 5000);
        return 'ok';
      } catch(e) {
        return 'error: ' + e.message;
      }
    }
  });

  await sleep(5000);
  chrome.tabs.remove(exportTab.id);
}
