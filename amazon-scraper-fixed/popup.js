const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnDashboard = document.getElementById('btnDashboard');
const btnExportSession = document.getElementById('btnExportSession');
const progressBox = document.getElementById('progressBox');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const logBox = document.getElementById('logBox');
const doneBox = document.getElementById('doneBox');
const doneMsg = document.getElementById('doneMsg');
const doneDetail = document.getElementById('doneDetail');
const statsBox = document.getElementById('statsBox');
const statTotalNum = document.getElementById('statTotalNum');
const statValidNum = document.getElementById('statValidNum');
const statInvalidNum = document.getElementById('statInvalidNum');
const statKwNum = document.getElementById('statKwNum');

let isRunning = false;
let lastSessionId = null;

function addLog(msg, type = 'info') {
  const div = document.createElement('div');
  div.className = `log-item ${type}`;
  div.textContent = msg;
  logBox.appendChild(div);
  logBox.scrollTop = logBox.scrollHeight;
}

function updateProgress(pct, text) {
  progressBar.style.width = pct + '%';
  progressText.innerHTML = text;
}

function updateStats(stats) {
  if (!stats) return;
  statTotalNum.textContent = stats.total || 0;
  statValidNum.textContent = stats.valid || 0;
  statInvalidNum.textContent = stats.invalid || 0;
  statKwNum.textContent = `${stats.kwDone || 0}/${stats.kwTotal || 0}`;
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'PROGRESS') {
    updateProgress(msg.pct, msg.text);
    if (msg.log) addLog(msg.log, msg.logType || 'info');
    if (msg.stats) updateStats(msg.stats);
  }
  if (msg.type === 'DONE') {
    isRunning = false;
    btnStart.disabled = false;
    btnStop.style.display = 'none';
    progressBox.querySelector('.progress-title').textContent = '✅ Hoàn tất!';
    updateProgress(100, `<span>Đã cào xong ${msg.totalAsins} ASINs từ ${msg.totalKeywords} keywords</span>`);
    lastSessionId = msg.sessionId;
    doneBox.style.display = 'block';
    doneMsg.textContent = `Đã xuất ${msg.totalAsins} sản phẩm ra file Excel!`;
    doneDetail.textContent = `${msg.totalKeywords} keyword · ${msg.totalAsins} ASIN · Hợp lệ: ${msg.stats.valid} · Loại bỏ: ${msg.stats.invalid}`;
  }
  if (msg.type === 'ERROR') {
    addLog('❌ ' + msg.text, 'err');
  }
  if (msg.type === 'STOPPED') {
    isRunning = false;
    btnStart.disabled = false;
    btnStop.style.display = 'none';
    addLog('⛔ Đã dừng bởi người dùng.', 'err');
  }
});

btnStart.addEventListener('click', () => {
  const raw = document.getElementById('keywords').value.trim();
  if (!raw) { alert('Vui lòng nhập ít nhất 1 keyword!'); return; }

  const keywords = raw.split('\n').map(k => k.trim()).filter(k => k.length > 0);
  const numPages = parseInt(document.getElementById('numPages').value);

  isRunning = true;
  btnStart.disabled = true;
  btnStop.style.display = 'block';
  progressBox.style.display = 'block';
  statsBox.classList.add('active');
  doneBox.style.display = 'none';
  logBox.innerHTML = '';
  progressBar.style.width = '0%';
  progressBox.querySelector('.progress-title').textContent = '⏳ Đang cào dữ liệu...';

  // Reset stats
  updateStats({ total: 0, valid: 0, invalid: 0, kwDone: 0, kwTotal: keywords.length });

  addLog(`🔑 ${keywords.length} keyword · ${numPages} trang/keyword`, 'info');

  chrome.runtime.sendMessage({
    type: 'START_SCRAPE',
    keywords,
    numPages
  });
});

btnStop.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'STOP_SCRAPE' });
});

btnDashboard.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

btnExportSession.addEventListener('click', () => {
  if (lastSessionId) {
    chrome.runtime.sendMessage({
      type: 'EXPORT_SESSION',
      sessionId: lastSessionId
    });
    addLog('📥 Đang re-export session...', 'info');
  }
});

// ── Supabase Config Handlers ──
document.addEventListener('DOMContentLoaded', () => {
  // Load Supabase config when popup opens
  chrome.storage.local.get('supabaseConfig', r => {
    if (r.supabaseConfig) {
      document.getElementById('supabaseUrl').value = r.supabaseConfig.url || '';
      document.getElementById('supabaseKey').value = r.supabaseConfig.key || '';
      document.getElementById('configStatus').textContent = '✅ Đã cấu hình Supabase';
    }
  });
});

// Save config
document.getElementById('btnSaveConfig').addEventListener('click', () => {
  const url = document.getElementById('supabaseUrl').value.trim();
  const key = document.getElementById('supabaseKey').value.trim();
  if (!url || !key) {
    document.getElementById('configStatus').textContent = '⚠️ Nhập đủ URL và Key';
    return;
  }
  chrome.storage.local.set({ supabaseConfig: { url, key } }, () => {
    document.getElementById('configStatus').textContent = '✅ Đã lưu!';
  });
});

// Test connection
document.getElementById('btnTestConfig').addEventListener('click', async () => {
  const url = document.getElementById('supabaseUrl').value.trim();
  const key = document.getElementById('supabaseKey').value.trim();
  document.getElementById('configStatus').textContent = '🔄 Đang test...';
  try {
    const res = await fetch(`${url}/rest/v1/sessions?limit=1`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    if (res.ok) {
      document.getElementById('configStatus').textContent = '✅ Kết nối thành công!';
    } else {
      document.getElementById('configStatus').textContent = `❌ Lỗi ${res.status}`;
    }
  } catch (e) {
    document.getElementById('configStatus').textContent = '❌ Không kết nối được';
  }
});
