// ============================================================
// NOTIFICATION SYSTEM (Bell Alert)
// ============================================================
let notifications = JSON.parse(localStorage.getItem('munira_notifications') || '[]');
let notifPanelOpen = false;
let lastLeadCount = null;
let bellAudio = null;

function playBellSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) { }
}

function addNotification(title, body, type = 'info') {
    const notif = { id: Date.now(), title, body, type, time: new Date().toISOString(), read: false };
    notifications.unshift(notif);
    if (notifications.length > 50) notifications = notifications.slice(0, 50);
    localStorage.setItem('munira_notifications', JSON.stringify(notifications));
    renderNotifications();
    playBellSound();
    // Browser notification
    if (Notification.permission === 'granted') {
        new Notification(`🔔 ${title}`, { body, icon: '/assets/icons/icon-192x192.png' });
    }
}

function renderNotifications() {
    const list = document.getElementById('notifList');
    const badge = document.getElementById('bellBadge');
    if (!list || !badge) return;

    const unread = notifications.filter(n => !n.read).length;
    badge.style.display = unread > 0 ? 'flex' : 'none';
    badge.textContent = unread > 9 ? '9+' : unread;

    if (notifications.length === 0) {
        list.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-secondary); font-size:0.85rem;">
            <i class="far fa-bell-slash" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
            Tidak ada notifikasi
        </div>`;
        return;
    }

    const typeIcon = { new_lead: '🔔', status_update: '📊', info: 'ℹ️', warning: '⚠️' };
    const typeBg = { new_lead: 'rgba(37,99,234,0.08)', status_update: 'rgba(245,158,11,0.08)', info: 'rgba(100,116,139,0.08)', warning: 'rgba(239,68,68,0.08)' };

    list.innerHTML = notifications.map(n => `
        <div onclick="markNotifRead(${n.id})" style="padding:12px 16px; border-bottom:1px solid var(--border); cursor:pointer; background:${n.read ? 'transparent' : typeBg[n.type] || typeBg.info}; transition:background 0.2s;"
             onmouseenter="this.style.background='rgba(37,99,234,0.06)'" onmouseleave="this.style.background='${n.read ? 'transparent' : typeBg[n.type] || typeBg.info}'">
            <div style="display:flex; gap:10px; align-items:flex-start;">
                <span style="font-size:1.2rem; flex-shrink:0;">${typeIcon[n.type] || 'ℹ️'}</span>
                <div style="flex:1; min-width:0;">
                    <div style="font-size:0.82rem; font-weight:${n.read ? '400' : '700'}; color:var(--text-primary); line-height:1.3; margin-bottom:3px;">${n.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">${n.body}</div>
                    <div style="font-size:0.7rem; color:var(--text-secondary); margin-top:4px; opacity:0.7;">${timeAgo(n.time)}</div>
                </div>
                ${!n.read ? '<div style="width:7px; height:7px; background:var(--brand); border-radius:50%; flex-shrink:0; margin-top:4px;"></div>' : ''}
            </div>
        </div>
    `).join('');
}

function markNotifRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        localStorage.setItem('munira_notifications', JSON.stringify(notifications));
        renderNotifications();

        // Redirect when notification clicked
        document.getElementById('notifDropdown')?.classList.remove('active');
        navigateTo('leads');
    }
}

window.clearNotifications = function () {
    notifications = [];
    localStorage.removeItem('munira_notifications');
    renderNotifications();
};

// Bell button toggle
document.getElementById('btnBell')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('notifPanel');
    notifPanelOpen = !notifPanelOpen;
    panel.style.display = notifPanelOpen ? 'flex' : 'none';
    if (notifPanelOpen) {
        // Mark all read
        notifications.forEach(n => n.read = true);
        localStorage.setItem('munira_notifications', JSON.stringify(notifications));
        renderNotifications();
    }
});

document.addEventListener('click', () => {
    const panel = document.getElementById('notifPanel');
    if (panel && notifPanelOpen) {
        notifPanelOpen = false;
        panel.style.display = 'none';
    }
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => Notification.requestPermission(), 2000);
}

// Poll for new leads every 30 seconds
setInterval(async () => {
    if (!authToken) return;
    try {
        const res = await fetch(`${API_URL}/leads/stats/overview`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (!data.success) return;
        const count = data.data.totalLeads;
        if (lastLeadCount !== null && count > lastLeadCount) {
            const diff = count - lastLeadCount;
            addNotification(
                `${diff} Lead Baru Masuk! 🎉`,
                `Total sekarang: ${count} leads. Segera follow up!`,
                'new_lead'
            );
            // Refresh table
            fetchDashboardData();
        }
        lastLeadCount = count;
    } catch (e) { }
}, 30000);

