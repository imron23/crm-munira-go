// API Setup
const API_URL = (window.location.protocol === 'file:' || window.location.port === '3000' || window.location.port === '8080') ? 'http://localhost:8080/api' : '/api';
let authToken = localStorage.getItem('munira_crm_token');
let allLeads = []; // Cache for leads
let currentUserData = null;

// Safe JWT Decoder to prevent Base64/Padding issues
function parseJwtPayload(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        return JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
    } catch (e) {
        console.warn('Failed to decode JWT:', e);
        return null;
    }
}

// Pre-decode JWT so it's available synchronously for early UI renders
if (authToken) {
    const payload = parseJwtPayload(authToken);
    if (payload) {
        currentUserData = payload;
        localStorage.setItem('munira_crm_user', currentUserData.username);
    }
}

// ============================================================
// Elements
const bladeLogin = document.getElementById('login-blade');
const bladeDashboard = document.getElementById('dashboard-blade');
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const txtUserRole = document.getElementById('txtUserRole');
const navLinks = document.querySelectorAll('.nav-link[data-target]');
const navMenuEl = document.querySelector('.nav-menu');
const pagesGrid = document.getElementById('pages-grid');

// Theme toggle — cycles: dark → light → sepia (reading mode)
const themeToggle = document.getElementById('themeToggle');
const THEMES = ['dark', 'light', 'sepia'];
const THEME_ICONS = { dark: 'fa-moon', light: 'fa-sun', sepia: 'fa-book-open' };
const THEME_LABELS = { dark: '🌙 Dark', light: '☀️ Light', sepia: '📖 Reading' };
let currentTheme = localStorage.getItem('munira_crm_theme') || 'dark';

function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'sepia-mode');
    if (theme === 'light') document.body.classList.add('light-mode');
    if (theme === 'sepia') document.body.classList.add('sepia-mode');
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = 'fas ' + (THEME_ICONS[theme] || 'fa-moon');
    }
    themeToggle.setAttribute('title', THEME_LABELS[theme] || 'Toggle Theme');
    localStorage.setItem('munira_crm_theme', theme);
}
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    const idx = THEMES.indexOf(currentTheme);
    currentTheme = THEMES[(idx + 1) % THEMES.length];
    applyTheme(currentTheme);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Mobile menu toggle (with safety checks)
const mobileMenuToggleBtn = document.getElementById('mobileMenuToggle');
const sidebarEl = document.querySelector('.sidebar');
const mainWrapperEl = document.querySelector('.main-wrapper');

if (mobileMenuToggleBtn && sidebarEl) {
    mobileMenuToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sidebarEl.classList.toggle('mobile-open');
    });
}

// Close mobile menu if clicked outside (on main content)
if (mainWrapperEl && sidebarEl) {
    mainWrapperEl.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebarEl.classList.remove('mobile-open');
        }
    });
}

// LOGIN LOGIC
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const errorMsg = document.getElementById('loginError');

    errorMsg.textContent = 'Authenticating...';

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('munira_crm_token', authToken);
            localStorage.setItem('munira_crm_user', data.user.username);
            showDashboard();
        } else {
            errorMsg.textContent = data.message || 'Access Denied.';
        }
    } catch (err) {
        errorMsg.textContent = 'Server Unreachable.';
    }
});

btnLogout.addEventListener('click', () => {
    authToken = null;
    localStorage.removeItem('munira_crm_token');
    localStorage.removeItem('munira_crm_user');
    showLogin();
});

// ============================================================
// QUICK SWITCH — Super Admin Only (Dynamic from API)
// ============================================================
async function loadQuickSwitch() {
    const role = currentUserData?.role;
    if (role !== 'super_admin') return; // Only for super_admin

    try {
        const res = await fetch(`${API_URL}/team`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (!data.success || !data.data) return;

        const container = document.querySelector('.profile-card');
        if (!container) return;

        // Remove old panel if exists
        const old = document.getElementById('quickSwitchPanel');
        if (old) old.remove();

        const roleIcons = { super_admin: '👑', admin: '🔑', sales: '💼', viewer: '👁', owner: '🏢' };
        const roleColors = { super_admin: '#9333ea', admin: '#2563ea', sales: '#16a34a', viewer: '#64748b', owner: '#F59E0B' };

        const members = data.data.filter(m => m.is_active && m.username !== currentUserData?.username);
        if (!members.length) return;

        const panel = document.createElement('div');
        panel.id = 'quickSwitchPanel';
        panel.style.cssText = 'margin-top:0; padding:6px 8px; border-top:1px dashed rgba(255,255,255,0.08);';
        panel.innerHTML = `
            <div id="qsHeader" style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.8px; padding:6px 4px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; border-radius:var(--radius-sm); transition:background 0.2s; user-select:none;"
                 onmouseenter="this.style.background='rgba(255,255,255,0.05)'" onmouseleave="this.style.background='none'"
                 onclick="(function(e){
                     var body = document.getElementById('qsBody');
                     var chev = document.getElementById('qsChevron');
                     if(body.style.display==='none'){
                         body.style.display='flex';
                         chev.style.transform='rotate(180deg)';
                     }else{
                         body.style.display='none';
                         chev.style.transform='rotate(0deg)';
                     }
                 })()">
                <span style="display:flex; align-items:center; gap:5px;">
                    <i class="fas fa-exchange-alt" style="color:var(--brand); font-size:0.6rem;"></i> Quick Switch
                    <span style="background:var(--brand); color:white; font-size:0.5rem; padding:1px 5px; border-radius:50px; font-weight:700;">${members.length}</span>
                </span>
                <i id="qsChevron" class="fas fa-chevron-down" style="font-size:0.5rem; transition:transform 0.2s; color:var(--text-secondary);"></i>
            </div>
            <div id="qsBody" style="display:none; flex-direction:column; gap:2px; max-height:160px; overflow-y:auto; padding-top:4px;">
                ${members.map(m => `
                    <button class="btn btn-outline btn-mini" onclick="doQuickSwitch('${m._id}')"
                        style="font-size:0.63rem; text-align:left; justify-content:flex-start; padding:4px 6px; width:100%; border-color:transparent; gap:6px;"
                        onmouseenter="this.style.borderColor='var(--border)'" onmouseleave="this.style.borderColor='transparent'">
                        <span style="color:${roleColors[m.role] || '#64748b'}; font-size:0.7rem;">${roleIcons[m.role] || '👤'}</span>
                        <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.full_name || m.username}</span>
                        <span style="opacity:0.4; font-size:0.55rem; flex-shrink:0;">${m.role}</span>
                    </button>
                `).join('')}
            </div>
        `;
        container.parentNode.insertBefore(panel, container);
    } catch (e) {
        console.error('Quick switch load error:', e);
    }
}

window.doQuickSwitch = async function (userId) {
    try {
        const res = await fetch(`${API_URL}/auth/impersonate/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('munira_crm_token', authToken);
            localStorage.setItem('munira_crm_user', data.user.username);
            showToast(`⚡ Switched to ${data.user.full_name || data.user.username} (${data.user.role})`);
            showDashboard();
        } else {
            showToast(`❌ ${data.message}`, 'error');
        }
    } catch (e) {
        showToast('❌ Gagal switch akun', 'error');
    }
};

function showLogin() {
    bladeLogin.classList.add('active');
    bladeDashboard.classList.remove('active');
}

async function showDashboard() {
    bladeLogin.classList.remove('active');
    bladeDashboard.classList.add('active');

    // Decode JWT to get user info
    const payload = parseJwtPayload(authToken);
    if (payload) {
        currentUserData = payload;
        localStorage.setItem('munira_crm_user', currentUserData.username);
    }

    // Set Profile in sidebar
    const usr = currentUserData?.full_name || currentUserData?.username || localStorage.getItem('munira_crm_user') || 'Admin';
    const role = currentUserData?.role || 'admin';
    if (txtUserRole) {
        txtUserRole.innerHTML = `${usr.charAt(0).toUpperCase() + usr.slice(1)}`;
    }
    const roleEl = document.querySelector('.profile-info small');
    if (roleEl) {
        const roleLabels = { super_admin: '👑 Super Admin', admin: '🔑 Admin', sales: '💼 Sales', viewer: '👁 Viewer', owner: '🏢 Owner' };
        roleEl.textContent = roleLabels[role] || role;
    }

    // Show/hide Team nav based on role
    const navTeamLi = document.getElementById('navTeamLi');
    if (navTeamLi) {
        navTeamLi.style.display = ['super_admin', 'admin'].includes(role) ? 'block' : 'none';
    }
    const navTrashLi = document.getElementById('navTrashLi');
    if (navTrashLi) {
        navTrashLi.style.display = (role === 'super_admin') ? 'block' : 'none';
    }

    // Owner specific UI setup
    if (role === 'owner') {
        document.body.classList.add('is-owner-role');
        document.querySelectorAll('.nav-menu li').forEach(li => {
            const link = li.querySelector('.nav-link');
            if (link && link.getAttribute('data-target') !== 'overview') {
                li.style.display = 'none';
            }
        });
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.style.display = 'none';
    } else {
        document.body.classList.remove('is-owner-role');
        document.querySelectorAll('.nav-menu li').forEach(li => {
            li.style.display = '';
        });
        if (navTeamLi) {
            navTeamLi.style.display = ['super_admin', 'admin'].includes(role) ? 'block' : 'none';
        }
        if (navTrashLi) {
            navTrashLi.style.display = (role === 'super_admin') ? 'block' : 'none';
        }
    }

    // Render existing notifications
    renderNotifications();

    // Initial load
    await fetchSettings();
    await loadProgramsList();
    fetchDashboardData();
    initAllRpInputs();

    // Load Quick Switch panel (super_admin only — fetches live team from API)
    loadQuickSwitch();

    // Restore last page from URL hash (must run after dashboard is shown)
    const savedHash = window.location.hash.replace('#', '');
    const validViews = ['overview', 'leads', 'pages', 'forms', 'distribution', 'programs', 'marketing', 'team'];
    if (savedHash && validViews.includes(savedHash)) {
        const targetLink = document.querySelector(`.nav-link[data-target="${savedHash}"]`);
        if (targetLink) setTimeout(() => targetLink.click(), 100);
    }
}

// NAVIGATION (event delegation for better mobile support)
if (navMenuEl) {
    navMenuEl.addEventListener('click', (event) => {
        const link = event.target.closest('.nav-link[data-target]');
        if (!link) return;

        event.preventDefault();

        const targetId = link.dataset.target;
        if (!targetId) return;

        // Reset UI
        if (navLinks && typeof navLinks.forEach === 'function') {
            navLinks.forEach(l => l.classList.remove('active'));
        } else {
            Array.from(navLinks || []).forEach(l => l.classList.remove('active'));
        }
        document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));

        // Set Active
        link.classList.add('active');
        const targetView = document.getElementById(`view-${targetId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Page title
        const pageTitleEl = document.getElementById('pageTitle');
        if (pageTitleEl) {
            pageTitleEl.textContent = link.textContent.trim();
        }

        // Update URL hash for page persistence
        window.location.hash = targetId;

        // Close mobile sidebar after navigating on small screens
        if (window.innerWidth <= 768 && sidebarEl && sidebarEl.classList.contains('mobile-open')) {
            sidebarEl.classList.remove('mobile-open');
        }

        // Routings
        if (targetId === 'overview' || targetId === 'leads') {
            fetchDashboardData();
        } else if (targetId === 'pages') {
            fetchPages();
            fetchPrograms();
        } else if (targetId === 'programs') {
            fetchProgramBuilder();
        } else if (targetId === 'marketing') {
            fetchSettings();
        } else if (targetId === 'forms') {
            fetchFormBuilder();
        } else if (targetId === 'distribution') {
            fetchDistribution();
        } else if (targetId === 'team') {
            fetchTeam();
        } else if (targetId === 'trash') {
            fetchTrash();
        }
    });
}

// ============================================================
// STATUS HISTORY MODAL
// ============================================================
document.getElementById('historyClose')?.addEventListener('click', () => {
    document.getElementById('historyOverlay').classList.remove('active');
});
document.getElementById('historyOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
});

window.openStatusHistory = async function (leadId, encodedName) {
    const leadName = decodeURIComponent(encodedName || '');
    const overlay = document.getElementById('historyOverlay');
    const content = document.getElementById('historyContent');
    overlay.classList.add('active');
    content.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-secondary);"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i></div>`;

    try {
        const res = await fetch(`${API_URL}/leads/${leadId}/history`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const history = data.data || [];
        if (history.length === 0) {
            content.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-secondary);">
                <i class="fas fa-history" style="font-size:2rem; margin-bottom:12px; opacity:0.3;"></i>
                <p>Belum ada riwayat perubahan status</p>
            </div>`;
            return;
        }

        const statusColors = {
            'New Data': '#2563ea', 'Contacted': '#9333EA', 'Nego Harga': '#D97706',
            'Proses FU': '#3B82F6', 'Negosiasi': '#DB2777', 'DP': '#F59E0B',
            'Order Complete': '#16a34a', 'Lost': '#DC2626', 'Pembatalan': '#ef4444', 'Pengembalian': '#64748b'
        };

        content.innerHTML = `
            <div style="margin-bottom:16px; font-size:0.9rem; color:var(--text-secondary);">
                <i class="fas fa-user" style="margin-right:6px;"></i><strong style="color:var(--text-primary);">${leadName}</strong> — ${history.length} perubahan status
            </div>
            <div style="position:relative; padding-left:24px;">
                <div style="position:absolute; left:8px; top:0; bottom:0; width:2px; background:var(--border);"></div>
                ${history.map((h, i) => `
                    <div style="position:relative; margin-bottom:${i < history.length - 1 ? '20px' : '0'};">
                        <div style="position:absolute; left:-20px; top:2px; width:12px; height:12px; border-radius:50%; background:${statusColors[h.status] || '#64748b'}; border:2px solid var(--bg-card);"></div>
                        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px 14px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                                <span style="font-size:0.78rem; font-weight:700; color:${statusColors[h.status] || '#64748b'}; background:${statusColors[h.status] || '#64748b'}18; padding:2px 10px; border-radius:50px;">${h.status}</span>
                                <small style="color:var(--text-secondary); font-size:0.7rem;">${h.changed_at ? formatDate(h.changed_at) : '-'}</small>
                            </div>
                            <div style="font-size:0.78rem; color:var(--text-secondary);">
                                <i class="fas fa-user-circle" style="margin-right:4px;"></i><strong style="color:var(--text-primary);">${h.changed_by_name || h.changed_by || 'System'}</strong>
                                ${h.catatan ? `<div style="margin-top:6px; font-size:0.75rem; border-left:2px solid var(--border); padding-left:8px; color:var(--text-secondary);">${h.catatan}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div style="text-align:center; padding:32px; color:var(--danger);">Gagal memuat riwayat: ${err.message}</div>`;
    }
};

// ============================================================
// ============================================================


// Add toast animation style
const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:none; } }`;
document.head.appendChild(toastStyle);

// ─── Copy: Nama + No HP ─────────────────────────────────────────────────────
window.copyNameWa = function (nama, wa, btnEl) {
    const text = `${nama}\n${wa}`;
    navigator.clipboard.writeText(text).then(() => {
        if (btnEl) {
            const orig = btnEl.innerHTML;
            btnEl.innerHTML = '<i class="fas fa-check"></i>';
            btnEl.style.color = '#16a34a';
            setTimeout(() => { btnEl.innerHTML = orig; btnEl.style.color = ''; }, 1500);
        }
        showToast(`📋 Disalin: ${nama} | ${wa}`, 'success');
    }).catch(() => showToast('Gagal menyalin', 'error'));
};

// ─── Smart Copy Popup — klik Lead ID atau nama ───────────────────────────────
window.smartCopyLead = function (encodedL) {
    let L;
    try { L = JSON.parse(decodeURIComponent(encodedL)); } catch { return; }

    const progName = L.program_id ? getProgramName(L.program_id) : '-';
    const rev = L.revenue || 0;
    const isDollar = rev > 0 && rev < 100000;
    const revStr = rev > 0 ? (isDollar ? `$${rev.toLocaleString('en-US')}` : `Rp ${rev.toLocaleString('id-ID')}`) : '-';
    const allText = `ID     : ${L.user_id || L.id}\nNama   : ${L.nama_lengkap}\nWA     : ${L.whatsapp_num}\nProgram: ${progName}\nPaket  : ${L.paket_pilihan || '-'}\nStatus : ${L.status_followup}\nRevenue: ${revStr}\nAsal   : ${L.landing_page || '-'} / ${L.utm_source || 'organic'}`;

    // Remove existing popup
    const existing = document.getElementById('smartCopyPopup');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'smartCopyPopup';
    overlay.style.cssText = `position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);`;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    const rows = [
        { label: 'Lead ID', val: L.user_id || L.id },
        { label: 'Nama', val: L.nama_lengkap },
        { label: 'WhatsApp', val: L.whatsapp_num },
        { label: 'Program', val: progName },
        { label: 'Paket', val: L.paket_pilihan || '-' },
        { label: 'Status', val: L.status_followup },
        { label: 'Revenue', val: revStr },
        { label: 'Nama + WA', val: `${L.nama_lengkap}\n${L.whatsapp_num}` },
    ];

    const rowsHtml = rows.map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:8px;background:var(--bg-surface);margin-bottom:6px;">
            <div>
                <div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-secondary);margin-bottom:1px;">${r.label}</div>
                <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);white-space:pre-line;">${r.val}</div>
            </div>
            <button onclick="(() => {
                navigator.clipboard.writeText(\`${r.val.replace(/`/g, "'")}\`).then(()=>{
                    this.innerHTML='<i class=\\'fas fa-check\\'></i>';
                    this.style.color='#16a34a';
                    setTimeout(()=>{this.innerHTML='<i class=\\'far fa-copy\\'></i>';this.style.color='';},1200);
                });
            })()" style="border:none;background:rgba(91,158,244,0.1);color:var(--brand);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:0.75rem;flex-shrink:0;margin-left:10px;">
                <i class="far fa-copy"></i>
            </button>
        </div>`).join('');

    overlay.innerHTML = `
        <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:16px;padding:20px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div>
                    <div style="font-weight:800;font-size:1rem;">📋 Smart Copy Lead</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">Klik ikon copy tiap baris</div>
                </div>
                <button onclick="document.getElementById('smartCopyPopup').remove()" style="border:none;background:var(--bg-surface);color:var(--text-secondary);border-radius:8px;padding:6px 10px;cursor:pointer;">✕</button>
            </div>
            ${rowsHtml}
            <button onclick="navigator.clipboard.writeText(\`${allText.replace(/`/g, "'")}\`).then(()=>{ showToast('✅ Semua info disalin!'); document.getElementById('smartCopyPopup').remove(); })"
                style="width:100%;margin-top:10px;padding:10px;border:none;border-radius:10px;background:var(--brand);color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">
                <i class="fas fa-copy" style="margin-right:6px;"></i> Copy Semua Info
            </button>
        </div>`;
    document.body.appendChild(overlay);
};



// ============================================================
// NAVIGATION HELPERS (navigateTo kept for potential programmatic use)
// ============================================================
function navigateTo(targetId) {
    const link = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if (link) link.click();
}

// LOAD CORE DATA
async function fetchDashboardData() {
    try {
        const resLeads = await fetch(`${API_URL}/leads?status=All&limit=10000`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (resLeads.status === 401 || resLeads.status === 403) {
            btnLogout.click();
            return;
        }

        const payloadLeads = await resLeads.json();

        if (payloadLeads.success) {
            allLeads = payloadLeads.data || [];

            // Dynamic Overview: Batasi data untuk Role Sales (kinerja sendiri vs tim)
            if (currentUserData?.role === 'sales') {
                const uName = currentUserData.username;
                const fName = currentUserData.full_name;
                allLeads = allLeads.filter(L =>
                    L.assigned_to === uName ||
                    L.assigned_to_name === fName ||
                    L.assigned_to === fName ||
                    L.assigned_to_name === uName // fuzzy matching if name and user are swapped
                );
            }

            // Populate CS filter dropdown FIRST
            populateCSFilter();

            // Render widgets based on overview date pickers and CS filter
            const sd = document.getElementById('overviewStartDate').value;
            const ed = document.getElementById('overviewEndDate').value;
            const csList = document.getElementById('overviewCSFilter')?.value;
            let ovData = filterByDateRange(allLeads, sd, ed);
            if (csList) {
                ovData = ovData.filter(L => L.assigned_to_name === csList || L.assigned_to === csList);
            }
            renderWidgetsAndCharts(ovData);

            // Render table based on leads date pickers
            renderLeadsTable();
        }
    } catch (err) {
        console.error('Failed fetching data:', err);
    }
}

function filterByDateRange(dataList, startStr, endStr) {
    if (!startStr && !endStr) return dataList;
    // Parse 'YYYY-MM-DD' as LOCAL midnight (avoids UTC timezone shift for WIB +7)
    function localMidnight(str) {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
    }
    const sTime = startStr ? localMidnight(startStr) : 0;
    const eTime = endStr ? localMidnight(endStr) + 86399000 : Infinity; // +23:59:59
    return dataList.filter(L => {
        const t = new Date(L.created_at).getTime();
        return t >= sTime && t <= eTime;
    });
}


// RENDER WIDGETS & CHARTS
function renderWidgetsAndCharts(leadsArray) {
    if (!leadsArray) return;

    const todayStr = new Date().toISOString().split('T')[0];
    let todaysCount = 0;
    let closingCount = 0;
    let lostCount = 0;

    leadsArray.forEach(L => {
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') closingCount++;
        if (L.status_followup === 'Lost') lostCount++;
        if (L.created_at && L.created_at.startsWith(todayStr)) todaysCount++;
    });

    const totalLeads = leadsArray.length;
    const cvr = totalLeads > 0 ? ((closingCount / totalLeads) * 100).toFixed(1) : '0.0';

    // Revenue calculation — split Rp vs USD (USD = revenue < 100,000)
    let totalRevRp = 0;
    let totalRevUsd = 0;
    const orderLeads = leadsArray.filter(L => L.status_followup === 'Order Complete' || L.status_followup === 'DP');
    let totalPacks = 0;

    orderLeads.forEach(L => {
        const r = L.revenue || 0;
        if (r > 0 && r < 100000) totalRevUsd += r;
        else totalRevRp += r;

        let packs = 1; // default fallback
        if (L.yang_berangkat) {
            const m = L.yang_berangkat.match(/\d+/);
            if (m) packs = parseInt(m[0], 10);
            else if (L.yang_berangkat.toLowerCase().includes('keluarga')) packs = 4;
            else if (L.yang_berangkat.toLowerCase().includes('rombongan')) packs = 10;
        }
        totalPacks += packs;
    });

    const elPacks = document.getElementById('stTotalPacks');
    if (elPacks) elPacks.textContent = totalPacks;

    // Format and push to the two separate Revenue cards
    const rpEl = document.getElementById('stRevenueRp');
    const usdEl = document.getElementById('stRevenueUsd');
    if (rpEl) {
        rpEl.textContent = totalRevRp > 0 ? formatRpKPI(totalRevRp) : 'Rp 0';
        rpEl.title = `Rp ${totalRevRp.toLocaleString('id-ID')}`;
    }
    if (usdEl) {
        usdEl.textContent = totalRevUsd > 0 ? `$${totalRevUsd.toLocaleString('en-US')}` : '$0';
        usdEl.title = `USD ${totalRevUsd.toLocaleString('en-US')}`;
    }
    // Legacy fallback if old element still present
    const legacyRev = document.getElementById('stRevenue');
    if (legacyRev) legacyRev.textContent = totalRevRp > 0 ? formatRpKPI(totalRevRp) : '$' + totalRevUsd.toLocaleString('en-US');


    // Repeat customer: same whatsapp number appears more than once
    const phoneCounts = {};
    leadsArray.forEach(L => { phoneCounts[L.whatsapp_num] = (phoneCounts[L.whatsapp_num] || 0) + 1; });
    const repeatCount = Object.values(phoneCounts).filter(c => c > 1).length;

    document.getElementById('stTotalLeads').textContent = totalLeads;
    document.getElementById('stTodayLeads').textContent = todaysCount;
    document.getElementById('stTotalClosing').textContent = closingCount;
    document.getElementById('stTotalLost').textContent = lostCount;
    document.getElementById('stCVR').textContent = cvr + '%';
    document.getElementById('stRepeatCustomer').textContent = repeatCount;


    // Recent 5 leads
    const recents = leadsArray.slice(0, 5);
    const tblRecent = document.getElementById('tblRecentLeads');
    tblRecent.innerHTML = '';

    recents.forEach(L => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${L.nama_lengkap}</strong><br>
                <small style="color:var(--text-secondary);">${formatDate(L.created_at)}</small>
            </td>
            <td>${L.paket_pilihan || 'N/A'}</td>
            <td><span class="status st-${L.status_followup.toLowerCase().replace(/\s+/g, '')}">${L.status_followup}</span></td>
            <td style="font-size:0.8rem; color:var(--text-secondary); max-width:200px;">${L.catatan || '<span style="opacity:0.5;">—</span>'}</td>
        `;
        tblRecent.appendChild(tr);
    });

    // CS LEADERBOARD LOGIC
    const csLeaderboard = document.getElementById('csLeaderboardContainer');
    if (csLeaderboard) {
        csLeaderboard.innerHTML = '';
        const csStats = {};
        leadsArray.forEach(L => {
            const csName = L.assigned_to_name || L.assigned_to || 'Unassigned';
            if (!csStats[csName]) csStats[csName] = { total: 0, closed: 0, points: 0 };
            csStats[csName].total++;
            if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
                csStats[csName].closed++;
                csStats[csName].points += 10;
            } else if (L.status_followup === 'Proses FU' || L.status_followup === 'Kirim PPL/Dokumen') {
                csStats[csName].points += 2;
            } else if (L.status_followup === 'Contacted') {
                csStats[csName].points += 1;
            }
        });

        // Convert to array and sort by closed desc, then points desc
        const sortedCS = Object.keys(csStats).map(name => ({
            name,
            ...csStats[name],
            cvr: csStats[name].total > 0 ? ((csStats[name].closed / csStats[name].total) * 100).toFixed(1) : 0
        })).sort((a, b) => b.closed - a.closed || b.points - a.points || b.total - a.total).slice(0, 5); // Top 5

        if (sortedCS.length === 0) {
            csLeaderboard.innerHTML = '<div style="text-align:center; color:var(--text-secondary); padding:20px 0;"><i class="fas fa-trophy" style="font-size:2rem; opacity:0.3; margin-bottom:10px;"></i><br>Belum ada performa.</div>';
        } else {
            sortedCS.forEach((cs, i) => {
                let badgeHtml = '';
                if (i === 0 && cs.closed > 0) badgeHtml = '<i class="fas fa-crown" style="color:#FBBF24; margin-left:6px; font-size:0.9rem;"></i>';
                else if (i === 1 && cs.closed > 0) badgeHtml = '<i class="fas fa-medal" style="color:#94A3B8; margin-left:6px; font-size:0.9rem;"></i>';
                else if (i === 2 && cs.closed > 0) badgeHtml = '<i class="fas fa-medal" style="color:#C47B3A; margin-left:6px; font-size:0.9rem;"></i>';

                csLeaderboard.innerHTML += `
                    <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-app); border:1px solid var(--border); border-radius:10px; padding:10px 14px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:36px; height:36px; border-radius:50%; background:var(--brand-light); color:var(--brand); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem;">
                                ${i + 1}
                            </div>
                            <div>
                                <div style="font-weight:700; font-size:0.95rem;">${cs.name} ${badgeHtml}</div>
                                <div style="font-size:0.75rem; color:var(--text-secondary);">${cs.total} leads • <span style="color:var(--success);"><i class="fas fa-check-circle" style="font-size:0.7rem;"></i> ${cs.closed} closing</span></div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:800; color:var(--text-primary); font-size:1.1rem;">${cs.cvr}%</div>
                            <div style="font-size:0.7rem; color:var(--text-secondary);">Closing Rate</div>
                        </div>
                    </div>
                `;
            });
        }
    }

    drawTrendChart(leadsArray);
    drawPackageChart(leadsArray);
    drawStatusFunnelChart(leadsArray);
    drawCityChart(leadsArray);

    // Advanced Analytics
    drawGoalTracker(leadsArray);
    drawStagnantLeads(leadsArray);
    drawSourceChart(leadsArray);
    drawWinRatePackageChart(leadsArray);
    drawLostReasonChart(leadsArray);
    drawHourlyChart(leadsArray);
    drawSpeedToLeadChart(leadsArray);

    fetchLpShowcase();
}
