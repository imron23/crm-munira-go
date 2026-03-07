// ============================================================
// TOAST NOTIFICATION
// ============================================================
window.showToast = function (message, type = 'success') {
    const existing = document.getElementById('munira-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'munira-toast';
    const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#ef4444' : '#2563ea';
    toast.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:99999;
        background:${bg}; color:white; padding:12px 20px; border-radius:12px;
        font-size:0.85rem; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.3);
        display:flex; align-items:center; gap:10px;
        animation: slideInRight 0.3s ease;
        max-width:320px;
    `;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}
