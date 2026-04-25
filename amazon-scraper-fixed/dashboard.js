const sessionsList = document.getElementById('sessionsList');

// Format datetime
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins}m trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays < 7) return `${diffDays}d trước`;

  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// Render sessions
function renderSessions() {
  chrome.storage.local.get('sessions', (result) => {
    const sessions = result.sessions || [];

    if (sessions.length === 0) {
      sessionsList.innerHTML = `
        <div class="empty-state">
          <div class="icon">📭</div>
          <p>Chưa có phiên nào được lưu</p>
          <small>Hãy bắt đầu cào dữ liệu để tạo phiên mới</small>
        </div>
      `;
      return;
    }

    sessionsList.innerHTML = sessions.map((session, index) => {
      const keywords = session.keywords?.join(', ') || 'N/A';
      const stats = session.stats || { total: 0, valid: 0, invalid: 0 };
      const timestamp = formatDateTime(session.timestamp);

      return `
        <div class="session-item">
          <div class="session-info">
            <div class="session-title">Phiên #${sessions.length - index}</div>
            <div class="session-meta">
              <span>⏰ ${timestamp}</span>
              <span>🔍 ${session.numPages || 1} trang/keyword</span>
              <span>🔑 ${session.keywords?.length || 0} keywords</span>
            </div>
            <div class="session-title" style="margin-top: 8px; font-size: 11px; color: #666; max-width: 600px;">
              Keywords: ${keywords}
            </div>
            <div class="session-stats">
              <div class="stat-badge total">
                <strong>${stats.total}</strong> Tổng cộng
              </div>
              <div class="stat-badge valid">
                <strong>${stats.valid}</strong> Hợp lệ ✅
              </div>
              <div class="stat-badge invalid">
                <strong>${stats.invalid}</strong> Loại bỏ ❌
              </div>
            </div>
          </div>
          <div class="session-actions">
            <button class="btn btn-export" data-session-id="${session.id}">📥 Export</button>
            <button class="btn btn-delete" data-session-id="${session.id}">🗑️ Xoá</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners
    document.querySelectorAll('.btn-export').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.target.getAttribute('data-session-id');
        exportSession(sessionId);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.target.getAttribute('data-session-id');
        if (confirm('Bạn có chắc muốn xoá phiên này?')) {
          deleteSession(sessionId);
        }
      });
    });
  });
}

// Export session
function exportSession(sessionId) {
  const backgroundPort = chrome.runtime.connect();
  backgroundPort.postMessage({
    type: 'EXPORT_SESSION',
    sessionId
  });
}

// Delete session
function deleteSession(sessionId) {
  chrome.storage.local.get('sessions', (result) => {
    let sessions = result.sessions || [];
    sessions = sessions.filter(s => s.id !== sessionId);
    chrome.storage.local.set({ sessions }, () => {
      renderSessions();
    });
  });
}

// Initial render
renderSessions();

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.sessions) {
    renderSessions();
  }
});
