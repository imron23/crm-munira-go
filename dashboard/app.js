// API Setup
const API_URL = (window.location.protocol === 'file:' || ['3000', '8080'].includes(window.location.port)) ? 'http://localhost:8080/api' : '/api';
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
// RUPIAH UTILITIES — Global formatter system
// ============================================================

/**
 * Tampil singkat: 35.000.000 → "35jt" | 1.500.000 → "1,5jt" | 500.000 → "500rb" | 1500 -> "$1,500"
 */
function formatRpShort(n) {
    if (!n || n == 0) return '0';
    // Auto-detect Dollar (Umrah packages < 100_000 are usually USD)
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US');
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'jt';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb';
    return String(n);
}

/**
 * Display lengkap dengan titik: 35000000 → "35.000.000"
 */
function formatRpDot(n) {
    if (!n || n == 0) return '0';
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US');
    return Number(n).toLocaleString('id-ID');
}

/**
 * Display KPI: "Rp 35jt" or "Rp 35.000.000" jika < 1jt
 */
function formatRpKPI(n) {
    if (!n || n == 0) return 'Rp 0';
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US'); // Auto Dollar
    if (n >= 1_000_000) return 'Rp ' + formatRpShort(n);
    return 'Rp ' + formatRpDot(n);
}

/**
 * Parse nilai dari input yg sudah diformat (hapus titik)
 */
function parseRpInput(str) {
    if (!str) return 0;
    const s = String(str).toLowerCase().trim().replace(/ /g, '');
    let rawStr = s.replace(/[^0-9.,]/g, '');

    // Convert 1,5jt to 1.5 format for math
    rawStr = rawStr.replace(/,/g, '.');
    // Ensure we only keep the last decimal separator if there are multiple dots from grouping
    const parts = rawStr.split('.');
    const decimal = parts.length > 1 && parts[parts.length - 1].length <= 2 ? '.' + parts.pop() : '';
    const numRaw = parts.join('') + decimal;

    let num = parseFloat(numRaw) || 0;

    if (s.includes('jt') || s.includes('j')) return Math.round(num * 1_000_000);
    if (s.includes('m')) return Math.round(num * 1_000_000_000);
    if (s.includes('k') || s.includes('rb')) return Math.round(num * 1_000);

    // fallback plain input
    return parseInt(s.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
}

/**
 * Pasang auto-dot-formatter ke elemen input (type=text)
 * Saat user ketik, angka otomatis dipisah titik per 3 digit
 */
function attachRpFormatter(el) {
    if (!el || el.dataset.rpAttached) return;
    el.dataset.rpAttached = '1';
    el.setAttribute('inputmode', 'numeric');
    el.setAttribute('autocomplete', 'off');
    el.placeholder = el.placeholder || 'mis: 35.000.000';

    el.addEventListener('input', function () {
        const val = this.value.toLowerCase().trim();
        if (val === '') { this.value = ''; return; }

        // If user typed 'k', 'jt', 'm', parse it instantly and format it back to short form
        if (/[kjmbt]$/.test(val)) {
            const parsed = parseRpInput(val);
            if (parsed) {
                this.value = formatRpShort(parsed);
            }
            return; // Let them finish or blur
        }

        // Just numeric input -> auto dot
        const pos = this.selectionStart;
        const raw = val.replace(/\./g, '').replace(/[^0-9]/g, '');
        if (raw === '') return;
        const formatted = Number(raw).toLocaleString('id-ID');
        const diff = formatted.length - this.value.length;
        this.value = formatted;

        // Restore cursor
        try { this.setSelectionRange(pos + diff, pos + diff); } catch (e) { }
    });

    // On blur, force short format
    el.addEventListener('blur', function () {
        if (this.value) {
            const parsed = parseRpInput(this.value);
            if (parsed) this.value = formatRpShort(parsed);
            else this.value = '';
        }
    });

    el.addEventListener('keydown', function (e) {
        // Allow backspace, delete, arrows, tab
        if ([8, 46, 37, 38, 39, 40, 9].includes(e.keyCode)) return;
        // Allow ctrl+a, ctrl+c, ctrl+v
        if (e.ctrlKey || e.metaKey) return;
        // Block non-numeric AND non-shortcut chars
        if (!/[0-9kKjJtTmMbBrR,.]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

/**
 * Set nilai ke rp-input (sudah formatted)
 */
function setRpInput(el, value) {
    if (!el) return;
    if (!value || value == 0) { el.value = ''; return; }
    el.value = Number(value).toLocaleString('id-ID');
}

/**
 * Init semua .rp-input di DOM
 */
function initAllRpInputs() {
    document.querySelectorAll('.rp-input').forEach(attachRpFormatter);
}


// ============================================================
// IMPORT CSV MODULE
// ============================================================
var importParsedData = [];

// Parse CSV text into array of objects
function parseCSV(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    // Parse header
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cells = [];
        let inQuote = false, cell = '';
        for (let ch of lines[i]) {
            if (ch === '"') { inQuote = !inQuote; continue; }
            if (ch === ',' && !inQuote) { cells.push(cell.trim()); cell = ''; continue; }
            cell += ch;
        }
        cells.push(cell.trim());
        const row = {};
        headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });
        rows.push(row);
    }
    return rows;
}

// Open Import Modal
document.getElementById('btnImport')?.addEventListener('click', () => {
    importParsedData = [];
    document.getElementById('importFile').value = '';
    document.getElementById('importFileInfo').textContent = '';
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importPreviewTable').innerHTML = '';
    document.getElementById('importResult').style.display = 'none';
    document.getElementById('btnDoImport').disabled = true;
    document.getElementById('importOverlay').classList.add('active');
});

document.getElementById('importClose')?.addEventListener('click', () => {
    document.getElementById('importOverlay').classList.remove('active');
});

// CSV file picker handler
document.getElementById('importFile')?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        document.getElementById('importFileInfo').textContent = '⚠️ Hanya file .csv yang didukung';
        return;
    }
    document.getElementById('importFileInfo').textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const reader = new FileReader();
    reader.onload = (e) => {
        importParsedData = parseCSV(e.target.result);
        if (!importParsedData.length) {
            document.getElementById('importFileInfo').textContent += ' — Tidak ada data valid ditemukan!';
            document.getElementById('btnDoImport').disabled = true;
            return;
        }
        document.getElementById('importFileInfo').textContent += ` — ${importParsedData.length} baris data ditemukan`;
        document.getElementById('btnDoImport').disabled = false;

        // Preview (first 5 rows)
        const preview = importParsedData.slice(0, 5);
        const headers = Object.keys(preview[0]);
        const previewHtml = `
            <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                <thead>
                    <tr style="background:var(--bg-app);">
                        ${headers.map(h => `<th style="padding:6px 8px; text-align:left; color:var(--text-secondary); white-space:nowrap;">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${preview.map(row => `
                        <tr style="border-top:1px solid var(--border);">
                            ${headers.map(h => `<td style="padding:6px 8px; color:var(--text-primary); white-space:nowrap;">${row[h] || '-'}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        document.getElementById('importPreviewTable').innerHTML = previewHtml;
        document.getElementById('importPreview').style.display = 'block';
    };
    reader.readAsText(file);
});

// Download template CSV
window.downloadImportTemplate = async function () {
    try {
        const res = await fetch(`${API_URL}/leads/template`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_import_leads_munira.csv';
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Gagal download template.');
    }
};

// Execute import
document.getElementById('btnDoImport')?.addEventListener('click', async () => {
    if (!importParsedData.length) return;
    const btn = document.getElementById('btnDoImport');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengimport...';

    try {
        const res = await fetch(`${API_URL}/leads/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ leads: importParsedData })
        });
        const data = await res.json();
        const resultEl = document.getElementById('importResult');
        resultEl.style.display = 'block';
        if (data.success) {
            resultEl.style.background = 'rgba(16,185,129,0.1)';
            resultEl.style.border = '1px solid rgba(16,185,129,0.3)';
            resultEl.style.color = '#10B981';
            resultEl.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px;"></i>${data.message}
                ${data.errors && data.errors.length ? `<div style="margin-top:6px; font-size:0.75rem; color:var(--danger);">${data.errors.join('<br>')}</div>` : ''}`;
            showToast(`Import: ${data.imported} lead berhasil ditambahkan ✅`);
            fetchDashboardData();
        } else {
            resultEl.style.background = 'rgba(239,68,68,0.1)';
            resultEl.style.border = '1px solid rgba(239,68,68,0.3)';
            resultEl.style.color = '#EF4444';
            resultEl.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right:8px;"></i>${data.message}`;
        }
    } catch (e) {
        const resultEl = document.getElementById('importResult');
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<i class="fas fa-times-circle"></i> Server error, coba lagi.';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-import"></i> Mulai Import';
    }
});
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
    const tToggle = document.getElementById('themeToggle');
    if (tToggle) {
        const icon = tToggle.querySelector('i');
        if (icon) icon.className = 'fas ' + (THEME_ICONS[theme] || 'fa-moon');
        tToggle.setAttribute('title', THEME_LABELS[theme] || 'Toggle Theme');
    }
    localStorage.setItem('munira_crm_theme', theme);
}
applyTheme(currentTheme);

const _themeToggle = document.getElementById('themeToggle');
if (_themeToggle) {
    _themeToggle.addEventListener('click', () => {
        const idx = THEMES.indexOf(currentTheme);
        currentTheme = THEMES[(idx + 1) % THEMES.length];
        applyTheme(currentTheme);
    });
}

// Initialization — wait for full DOM
document.addEventListener('DOMContentLoaded', () => {
    // Re-bind loginForm since it must exist at this point
    const _loginForm = document.getElementById('loginForm');
    const _btnLogout = document.getElementById('btnLogout');

    if (_loginForm) {
        _loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUser').value;
            const password = document.getElementById('loginPass').value;
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.textContent = 'Authenticating...';
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
                    if (errorMsg) errorMsg.textContent = data.message || 'Access Denied.';
                }
            } catch (err) {
                if (errorMsg) errorMsg.textContent = 'Server Unreachable. Check connection.';
                console.error('Login error:', err);
            }
        });
    }

    if (_btnLogout) {
        _btnLogout.addEventListener('click', () => {
            authToken = null;
            localStorage.removeItem('munira_crm_token');
            localStorage.removeItem('munira_crm_user');
            showLogin();
        });
    }

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

// LOGIN LOGIC — moved into DOMContentLoaded above (safe version)
// Kept here as fallback for direct DOM availability
if (loginForm) {
    if (!loginForm._loginBound) {
        loginForm._loginBound = true;
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUser').value;
            const password = document.getElementById('loginPass').value;
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.textContent = 'Authenticating...';
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
                    if (errorMsg) errorMsg.textContent = data.message || 'Access Denied.';
                }
            } catch (err) {
                if (errorMsg) errorMsg.textContent = 'Server Unreachable.';
            }
        });
    }
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        authToken = null;
        localStorage.removeItem('munira_crm_token');
        localStorage.removeItem('munira_crm_user');
        showLogin();
    });
}

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
                    <button class="btn btn-outline btn-mini" onclick="doQuickSwitch('${m.id}')"
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
// NOTIFICATION SYSTEM (Bell Alert)
// ============================================================
var notifications = JSON.parse(localStorage.getItem('munira_notifications') || '[]');
var notifPanelOpen = false;
var lastLeadCount = null;
var bellAudio = null;

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
// TEAM MANAGEMENT
// ============================================================
var teamEditId = null;

function getRoleBadge(role) {
    const map = {
        super_admin: { color: '#9333ea', label: 'Super Admin' },
        admin: { color: '#2563ea', label: 'Admin' },
        sales: { color: '#16a34a', label: 'Sales' },
        viewer: { color: '#64748b', label: 'Viewer' },
    };
    const r = map[role] || map.viewer;
    return `<span style="background:${r.color}22; color:${r.color}; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:50px;">${r.label}</span>`;
}

async function fetchTeam() {
    try {
        const res = await fetch(`${API_URL}/team`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        const grid = document.getElementById('teamGrid');
        const empty = document.getElementById('teamEmpty');
        if (!grid) return;
        grid.innerHTML = '';

        if (!data.success || !data.data || data.data.length === 0) {
            if (empty) empty.style.display = 'block';
            return;
        }
        if (empty) empty.style.display = 'none';

        data.data.forEach(member => {
            const isMe = member.username === (currentUserData?.username || localStorage.getItem('munira_crm_user'));
            const initial = (member.full_name || member.username || '?').charAt(0).toUpperCase();
            const roleColors = { super_admin: '#9333ea', admin: '#2563ea', sales: '#16a34a', viewer: '#64748b', owner: '#F59E0B' };
            const color = roleColors[member.role] || '#64748b';
            const lastLogin = member.last_login ? timeAgo(member.last_login) : 'Belum pernah login';

            grid.innerHTML += `
                <div style="background:var(--bg-surface); border:1px solid ${isMe ? 'var(--brand)' : 'var(--border)'}; border-radius:var(--radius-lg); padding:20px; transition:all 0.2s; position:relative;"
                     onmouseenter="this.style.borderColor='var(--brand)'; this.style.transform='translateY(-2px)'"
                     onmouseleave="this.style.borderColor='${isMe ? 'var(--brand)' : 'var(--border)'}'; this.style.transform='none'">
                    ${!member.is_active ? `<div style="position:absolute; top:10px; right:10px; background:#ef444420; color:#ef4444; font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px;">SUSPENDED</div>` : ''}
                    ${isMe ? `<div style="position:absolute; top:10px; right:10px; background:var(--brand)20; color:var(--brand); font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px;">SAYA</div>` : ''}
                    <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
                        <div style="width:48px; height:48px; border-radius:12px; background:${color}22; color:${color}; display:flex; align-items:center; justify-content:center; font-size:1.3rem; font-weight:800; flex-shrink:0;">${initial}</div>
                        <div>
                            <div style="font-weight:700; font-size:0.95rem; line-height:1.3;">${member.full_name || member.username}</div>
                            <div style="color:var(--text-secondary); font-size:0.78rem;">@${member.username}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                        ${getRoleBadge(member.role)}
                        ${member.email ? `<span style="font-size:0.65rem; color:var(--text-secondary); background:var(--bg-app); padding:2px 8px; border-radius:50px;"><i class="fas fa-envelope"></i> ${member.email}</span>` : ''}
                    </div>
                    <div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:14px; border-top:1px solid var(--border); padding-top:10px;">
                        <i class="fas fa-clock" style="margin-right:4px;"></i>Login terakhir: ${lastLogin}
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-outline btn-mini" style="flex:1;" onclick="openTeamModal('${member.id}')"><i class="fas fa-pen" style="font-size:0.7rem;"></i> Edit</button>
                        ${member.username !== (currentUserData?.username) ? `<button class="btn btn-mini" style="color:var(--danger);" onclick="deleteTeamMember('${member.id}', '${member.full_name || member.username}')"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>` : ''}
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error('Error fetching team:', err);
    }
}

window.openTeamModal = async function (editId = null) {
    teamEditId = editId;
    const overlay = document.getElementById('teamMemberOverlay');
    const form = document.getElementById('teamMemberForm');
    const title = document.getElementById('teamModalTitle');
    const pwdGroup = document.getElementById('tmPasswordGroup');
    const statusGroup = document.getElementById('tmStatusGroup');
    const resetGroup = document.getElementById('tmResetPwdGroup');

    // Reset form
    form.reset();
    document.getElementById('tmId').value = '';

    if (editId) {
        title.innerHTML = '<i class="fas fa-user-edit" style="color:var(--brand); margin-right:8px;"></i>Edit Anggota Tim';
        document.getElementById('tmUsername').readOnly = true;
        document.getElementById('tmUsername').style.opacity = '0.6';
        pwdGroup.style.display = 'none';
        document.getElementById('tmPassword').required = false; // remove required in edit mode
        statusGroup.style.display = 'block';
        resetGroup.style.display = 'block';

        // Fetch member data
        try {
            const res = await fetch(`${API_URL}/team`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            const member = data.data.find(m => m.id === editId);
            if (member) {
                document.getElementById('tmId').value = member.id;
                document.getElementById('tmUsername').value = member.username;
                document.getElementById('tmFullName').value = member.full_name || '';
                document.getElementById('tmEmail').value = member.email || '';
                document.getElementById('tmPhone').value = member.phone || '';
                document.getElementById('tmRole').value = member.role || 'sales';
                document.getElementById('tmIsActive').value = member.is_active ? 'true' : 'false';
                // Fill permissions
                const perms = member.permissions || {};
                const permKeys = ['can_view_leads', 'can_edit_leads', 'can_view_pages', 'can_edit_pages',
                    'can_view_forms', 'can_edit_forms', 'can_view_programs', 'can_edit_programs',
                    'can_view_marketing', 'can_edit_marketing', 'can_delete', 'can_export', 'can_view_revenue'];
                permKeys.forEach(k => {
                    const el = document.getElementById('perm_' + k);
                    if (el) el.checked = !!perms[k];
                });
                onRoleChange();
            }
        } catch (e) { console.error(e); }
    } else {
        title.innerHTML = '<i class="fas fa-user-plus" style="color:var(--brand); margin-right:8px;"></i>Tambah Anggota Tim';
        document.getElementById('tmUsername').readOnly = false;
        document.getElementById('tmUsername').style.opacity = '1';
        pwdGroup.style.display = 'block';
        document.getElementById('tmPassword').required = true; // enforce required in create mode
        statusGroup.style.display = 'none';
        resetGroup.style.display = 'none';
        // Set default permissions based on role
        onRoleChange();
    }

    overlay.classList.add('active');
};

window.closeTeamModal = function () {
    document.getElementById('teamMemberOverlay').classList.remove('active');
    teamEditId = null;
};

document.getElementById('teamMemberClose')?.addEventListener('click', closeTeamModal);
document.getElementById('teamMemberOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTeamModal();
});

document.getElementById('teamMemberForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = teamEditId;
    const submitBtn = e.target.querySelector('[type=submit]');

    // --- Frontend Validation ---
    if (!id) {
        // Create mode: validate username + password
        const username = document.getElementById('tmUsername').value.trim();
        const password = document.getElementById('tmPassword').value;
        if (!username) {
            showToast('❌ Username wajib diisi', 'error');
            document.getElementById('tmUsername').focus();
            return;
        }
        if (!password || password.length < 8) {
            showToast('❌ Password wajib diisi (minimal 8 karakter)', 'error');
            document.getElementById('tmPassword').focus();
            return;
        }
    }

    const payload = {
        full_name: document.getElementById('tmFullName').value.trim(),
        email: document.getElementById('tmEmail').value.trim(),
        phone: document.getElementById('tmPhone').value.trim(),
        role: document.getElementById('tmRole').value,
        permissions: {
            can_view_leads: document.getElementById('perm_can_view_leads')?.checked || false,
            can_edit_leads: document.getElementById('perm_can_edit_leads')?.checked || false,
            can_view_pages: document.getElementById('perm_can_view_pages')?.checked || false,
            can_edit_pages: document.getElementById('perm_can_edit_pages')?.checked || false,
            can_view_forms: document.getElementById('perm_can_view_forms')?.checked || false,
            can_edit_forms: document.getElementById('perm_can_edit_forms')?.checked || false,
            can_view_programs: document.getElementById('perm_can_view_programs')?.checked || false,
            can_edit_programs: document.getElementById('perm_can_edit_programs')?.checked || false,
            can_view_marketing: document.getElementById('perm_can_view_marketing')?.checked || false,
            can_edit_marketing: document.getElementById('perm_can_edit_marketing')?.checked || false,
            can_delete: document.getElementById('perm_can_delete')?.checked || false,
            can_export: document.getElementById('perm_can_export')?.checked || false,
            can_view_revenue: document.getElementById('perm_can_view_revenue')?.checked || false,
        }
    };

    if (id) {
        payload.is_active = document.getElementById('tmIsActive').value === 'true';
    } else {
        payload.username = document.getElementById('tmUsername').value.trim();
        payload.password = document.getElementById('tmPassword').value;
    }

    // --- Loading State ---
    submitBtn.disabled = true;
    const origBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
        const url = id ? `${API_URL}/team/${id}` : `${API_URL}/team`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            closeTeamModal();
            fetchTeam();
            showToast(id ? 'Anggota tim diperbarui ✅' : 'Anggota baru ditambahkan ✅');
        } else {
            showToast('❌ ' + (data.message || 'Gagal menyimpan'), 'error');
        }
    } catch (err) {
        console.error('Team save error:', err);
        showToast('❌ Server error. Periksa koneksi.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
    }
});

// Auto-set permissions based on selected role
window.onRoleChange = function () {
    const role = document.getElementById('tmRole')?.value;
    if (!role) return;
    const isSA = role === 'super_admin';
    const isAdmin = role === 'admin';
    const isSales = role === 'sales';
    const isOwner = role === 'owner';

    const defaults = {
        can_view_leads: !isOwner,
        can_edit_leads: isSA || isAdmin || isSales,
        can_view_pages: !isOwner,
        can_edit_pages: isSA || isAdmin,
        can_view_forms: !isOwner,
        can_edit_forms: isSA || isAdmin,
        can_view_programs: !isOwner,
        can_edit_programs: isSA || isAdmin,
        can_view_marketing: !isOwner,
        can_edit_marketing: isSA || isAdmin,
        can_delete: isSA || isAdmin,
        can_export: isSA || isAdmin || isSales,
        can_view_revenue: isSA || isAdmin || isOwner,
    };
    Object.entries(defaults).forEach(([k, v]) => {
        const el = document.getElementById('perm_' + k);
        if (el) el.checked = v;
    });
};

window.doResetPassword = async function () {
    const newPwd = document.getElementById('tmNewPwd').value;
    if (!newPwd || newPwd.length < 8) {
        alert('Password minimal 8 karakter');
        return;
    }
    if (!teamEditId) return;
    if (!confirm('Reset password untuk user ini?')) return;

    try {
        const res = await fetch(`${API_URL}/team/${teamEditId}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ new_password: newPwd })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Password berhasil direset ✅');
            document.getElementById('tmNewPwd').value = '';
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (e) {
        alert('Server error.');
    }
};

window.deleteTeamMember = async function (id, name) {
    if (!confirm(`Yakin hapus anggota "${name}"? Aksi ini tidak bisa dibatalkan.`)) return;
    try {
        const res = await fetch(`${API_URL}/team/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
            fetchTeam();
            showToast('Anggota tim dihapus');
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (e) {
        alert('Server error.');
    }
};

document.getElementById('btnAddMember')?.addEventListener('click', () => openTeamModal(null));

// ============================================================
function showToast(message, type = 'success') {
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

    // HIDE SENSITIVE METRICS DARI NON-SUPERADMIN
    const isSuperAdmin = currentUserData && currentUserData.role === 'super_admin';
    const advRow1 = document.getElementById('advMetricsRow1');
    const advRow2 = document.getElementById('advMetricsRow2');
    const advRow3 = document.getElementById('advMetricsRow3');
    const advRow4 = document.getElementById('advMetricsRow4');
    const advRow5 = document.getElementById('advMetricsRow5');
    if (!isSuperAdmin) {
        if (advRow1) advRow1.style.display = 'none';
        if (advRow2) advRow2.style.display = 'none';
        if (advRow3) advRow3.style.display = 'none';
        if (advRow4) advRow4.style.display = 'none';
        if (advRow5) advRow5.style.display = 'none';
    } else {
        if (advRow1) advRow1.style.display = 'block'; // overview-section wrapper
        if (advRow2) advRow2.style.display = 'block'; // overview-section wrapper
        if (advRow3) advRow3.style.display = 'block'; // overview-section wrapper
        if (advRow4) advRow4.style.display = 'block'; // overview-section wrapper
        if (advRow5) advRow5.style.display = 'block'; // overview-section wrapper
    }

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

    // Analysis Metrics
    let totalResponseMs = 0;
    let validResponseCount = 0;
    const stagnantLeads = [];
    const now = Date.now();
    const sourceMap = {};

    // NEW ADVANCED METRICS
    let totalCloseDays = 0;
    let validCloseCount = 0;
    let revenuePipeline = 0;
    let totalHistoryCount = 0;
    let historyLeadsCount = 0;
    const paketMap = {};
    const lostReasonMap = {};

    const orderLeads = leadsArray.filter(L => L.status_followup === 'Order Complete' || L.status_followup === 'DP');
    orderLeads.forEach(L => {
        const r = L.revenue || 0;
        if (r > 0 && r < 100000) totalRevUsd += r;
        else totalRevRp += r;
    });

    leadsArray.forEach(L => {
        // Win-Rate per Paket Logic
        const paketName = L.paket_pilihan || 'Belum Menentukan';
        if (!paketMap[paketName]) paketMap[paketName] = { total: 0, closed: 0 };
        paketMap[paketName].total++;
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
            paketMap[paketName].closed++;
        }

        // Revenue Pipeline Logic (Proses FU & Nego Harga)
        if (L.status_followup === 'Proses FU' || L.status_followup === 'Nego Harga') {
            // Estimasi harga dari nama paket (bisa pakai dictionary revenueByPaket di server, ini estimasi front)
            let estimasi = 25000000;
            if (paketName.includes('VIP') || paketName.includes('Plus')) estimasi = 40000000;
            if (paketName.includes('Haji')) estimasi = 150000000;
            revenuePipeline += estimasi;
        }

        // Lost Reason Logic
        if (L.status_followup === 'Lost') {
            // Priority 1: Check if CS explicitly chose via dropdown (marked with [Lost: Reason])
            let reason = 'Lainnya';
            const cat = L.catatan || '';
            const match = cat.match(/\[Lost:\s*(.*?)\]/i);
            if (match && match[1]) {
                reason = match[1].trim();
            } else {
                // Priority 2: Fallback ke ekstraksi manual untuk data lama
                const catLower = cat.toLowerCase();
                if (catLower.includes('mahal') || catLower.includes('budget') || catLower.includes('harga')) reason = 'Kendala Budget / Kemahalan';
                else if (catLower.includes('kompetitor') || catLower.includes('travel lain') || catLower.includes('travel sebelah')) reason = 'Pilih Travel Lain';
                else if (catLower.includes('tidak respon') || catLower.includes('diam') || catLower.includes('susah dihubungi')) reason = 'Ghosting / Tidak Respon';
                else if (catLower.includes('jadwal') || catLower.includes('waktu') || catLower.includes('undur')) reason = 'Ketidakcocokan Jadwal';
                else if (catLower.includes('keluarga') || catLower.includes('suami') || catLower.includes('istri')) reason = 'Diskusi Keluarga Alot';
            }

            lostReasonMap[reason] = (lostReasonMap[reason] || 0) + 1;
        }

        // Source Performance Logic
        const source = L.utm_source ? `${L.utm_source} (Ads)` : (L.form_source || L.landing_page || 'Organic');
        if (!sourceMap[source]) sourceMap[source] = { total: 0, closed: 0 };
        sourceMap[source].total++;
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
            sourceMap[source].closed++;
        }

        // Status History Logic (Response time, Sales velocity, Follow-up intensity)
        if (L.status_history && L.status_history.length > 0) {
            historyLeadsCount++;
            totalHistoryCount += L.status_history.length;

            const firstFU = L.status_history.find(h => h.status !== 'New Data');
            if (firstFU && L.created_at) {
                const createdTime = new Date(L.created_at).getTime();
                const fuTime = new Date(firstFU.changed_at).getTime();
                if (fuTime > createdTime) {
                    totalResponseMs += (fuTime - createdTime);
                    validResponseCount++;
                }
            }

            if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
                // Cari histori saat dia DP/Complete
                const closeHistory = L.status_history.find(h => h.status === 'Order Complete' || h.status === 'DP');
                if (closeHistory && L.created_at) {
                    const cTime = new Date(L.created_at).getTime();
                    const eTime = new Date(closeHistory.changed_at).getTime();
                    if (eTime > cTime) {
                        totalCloseDays += (eTime - cTime) / 86400000;
                        validCloseCount++;
                    }
                }
            }
        }

        // Stagnant Logic
        if (['Proses FU', 'Contacted', 'Kirim PPL/Dokumen', 'New Data'].includes(L.status_followup)) {
            let lastUpdate = new Date(L.created_at).getTime();
            if (L.status_history && L.status_history.length > 0) {
                lastUpdate = new Date(L.status_history[L.status_history.length - 1].changed_at).getTime();
            } else if (L.updated_at) {
                lastUpdate = new Date(L.updated_at).getTime();
            }
            const diffDays = (now - lastUpdate) / (1000 * 3600 * 24);
            if (diffDays > 3) {
                stagnantLeads.push({
                    ...L,
                    daysStagnant: Math.floor(diffDays)
                });
            }
        }
    });

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

    // Response Time Format
    const avgResponseEl = document.getElementById('stAvgResponse');
    if (avgResponseEl) {
        if (validResponseCount > 0) {
            const avgMs = totalResponseMs / validResponseCount;
            const avgMins = Math.round(avgMs / 60000);
            if (avgMins >= 60) {
                avgResponseEl.textContent = `${Math.floor(avgMins / 60)}j ${avgMins % 60}m`;
            } else {
                avgResponseEl.textContent = `${avgMins}m`;
            }
        } else {
            avgResponseEl.textContent = 'N/A';
        }
    }

    // ADVANCED METRICS OUTPUT
    const svEl = document.getElementById('stSalesVelocity');
    if (svEl) {
        if (validCloseCount > 0) {
            svEl.textContent = `${(totalCloseDays / validCloseCount).toFixed(1)} Hari`;
        } else {
            svEl.textContent = 'N/A';
        }
    }

    const plEl = document.getElementById('stRevenuePipeline');
    if (plEl) {
        plEl.textContent = revenuePipeline > 0 ? formatRpKPI(revenuePipeline) : 'Rp 0';
        plEl.title = `Rp ${revenuePipeline.toLocaleString('id-ID')}`;
    }

    const fiEl = document.getElementById('stFollowupIntensity');
    if (fiEl) {
        if (historyLeadsCount > 0) {
            fiEl.textContent = `${(totalHistoryCount / historyLeadsCount).toFixed(1)}x`;
        } else {
            fiEl.textContent = '0x';
        }
    }


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

    if (recents.length === 0) {
        tblRecent.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary); padding:30px;">Belum ada data di periode ini.</td></tr>';
    }

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

    // Render Stagnant Leads
    stagnantLeads.sort((a, b) => b.daysStagnant - a.daysStagnant);
    const tblStagnant = document.getElementById('tblStagnantLeads');
    if (tblStagnant) {
        tblStagnant.innerHTML = '';
        if (stagnantLeads.length === 0) {
            tblStagnant.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); padding:20px;"><i class="fas fa-check-circle" style="color:var(--success); font-size:1.5rem; margin-bottom:10px;"></i><br>Kerja responsif! Tidak ada lead yang tertahan.</td></tr>';
        } else {
            stagnantLeads.slice(0, 5).forEach(L => {
                const csName = L.assigned_to_name || L.assigned_to || 'Unassigned';
                tblStagnant.innerHTML += `
                    <tr>
                        <td><strong>${L.nama_lengkap}</strong><br><small style="color:var(--text-secondary);"><i class="fas fa-user" style="font-size:0.7rem;"></i> ${csName}</small></td>
                        <td><span class="status st-${L.status_followup.toLowerCase().replace(/\s+/g, '')}">${L.status_followup}</span></td>
                        <td style="color:var(--danger); font-weight:bold;">${L.daysStagnant} Hari</td>
                    </tr>
                `;
            });
        }
    }

    // Render Source Quality Table
    const sortedSources = Object.keys(sourceMap).map(s => {
        return {
            name: s,
            total: sourceMap[s].total,
            closed: sourceMap[s].closed,
            cvr: sourceMap[s].total > 0 ? ((sourceMap[s].closed / sourceMap[s].total) * 100).toFixed(1) : 0
        }
    }).sort((a, b) => b.total - a.total);

    const tblSource = document.getElementById('tblSourcePerformance');
    if (tblSource) {
        tblSource.innerHTML = '';
        if (sortedSources.length === 0) {
            tblSource.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary); padding:20px;">Belum ada data source.</td></tr>';
        } else {
            sortedSources.slice(0, 5).forEach(src => {
                tblSource.innerHTML += `
                    <tr>
                        <td style="font-weight:600;">${src.name}</td>
                        <td style="text-align:center;">${src.total}</td>
                        <td style="text-align:center; color:var(--success);"><i class="fas fa-check-circle" style="font-size:0.75rem;"></i> ${src.closed}</td>
                        <td style="text-align:right; font-weight:700;">${src.cvr}%</td>
                    </tr>
                `;
            });
        }
    }

    // Render Package Win Rate Table
    const sortedPackages = Object.keys(paketMap).map(p => {
        return {
            name: p,
            ...paketMap[p],
            cvr: paketMap[p].total > 0 ? ((paketMap[p].closed / paketMap[p].total) * 100).toFixed(1) : 0
        }
    }).sort((a, b) => b.closed - a.closed || b.total - a.total); // Sort by closing desc

    const tblPackageWin = document.getElementById('tblPackageWinRate');
    if (tblPackageWin) {
        tblPackageWin.innerHTML = '';
        if (sortedPackages.length === 0) {
            tblPackageWin.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary); padding:20px;">Belum ada data peminat paket.</td></tr>';
        } else {
            sortedPackages.forEach(pkt => {
                tblPackageWin.innerHTML += `
                    <tr>
                        <td style="font-weight:600;">${pkt.name}</td>
                        <td style="text-align:center;">${pkt.total}</td>
                        <td style="text-align:center; color:var(--success);"><i class="fas fa-check-circle" style="font-size:0.75rem;"></i> ${pkt.closed}</td>
                        <td style="text-align:right; font-weight:700; color:#EAB308;">${pkt.cvr}%</td>
                    </tr>
                `;
            });
        }
    }

    drawTrendChart(leadsArray);
    drawPackageChart(leadsArray);
    drawStatusFunnelChart(leadsArray);
    drawCityChart(leadsArray);
    drawLostReasonChart(lostReasonMap);
    if (isSuperAdmin) {
        drawRevenueGauge(totalRevRp);
        drawTimeOfDayChart(leadsArray);
        drawSpeedToLeadChart(leadsArray);
    }
    fetchLpShowcase();
}

// Chart Instance Trackers
var chartTrend = null;
var chartPkg = null;
var chartLostReason = null;
var chartRevenueGauge = null;
var chartTimeOfDay = null;
var chartSpeedToLead = null;

// Monthly Revenue Target saved in localStorage
var monthlyRevenueTarget = parseInt(localStorage.getItem('munira_rev_target') || '2000000000');

window.updateTargetOmset = function () {
    const input = document.getElementById('targetOmsetInput');
    if (!input) return;
    const raw = input.value.replace(/[^0-9]/g, '');
    if (raw) {
        monthlyRevenueTarget = parseInt(raw);
        localStorage.setItem('munira_rev_target', monthlyRevenueTarget);
        // Re-draw with last known revenue
        drawRevenueGauge(window._lastTotalRevRp || 0);
        input.value = '';
    }
};

function drawRevenueGauge(totalRevRp) {
    window._lastTotalRevRp = totalRevRp;
    const ctx = document.getElementById('revenueGaugeChart');
    if (!ctx) return;
    if (chartRevenueGauge) chartRevenueGauge.destroy();

    const target = monthlyRevenueTarget;
    const achieved = Math.min(totalRevRp, target);
    const remaining = Math.max(target - totalRevRp, 0);
    const pct = target > 0 ? Math.min((totalRevRp / target) * 100, 100) : 0;

    // Update text labels
    const curEl = document.getElementById('gaugeCurrentVal');
    const tgtEl = document.getElementById('gaugeTargetVal');
    if (curEl) curEl.textContent = 'Rp ' + totalRevRp.toLocaleString('id-ID');
    if (tgtEl) tgtEl.textContent = `Target: Rp ${target.toLocaleString('id-ID')} (${pct.toFixed(1)}%)`;

    const color = pct >= 100 ? '#10B981' : pct >= 70 ? '#F59E0B' : pct >= 40 ? '#3B82F6' : '#EF4444';

    chartRevenueGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [achieved, remaining],
                backgroundColor: [color, 'rgba(148,163,184,0.1)'],
                borderWidth: 0,
                borderRadius: 6,
                circumference: 270,
                rotation: -135,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '78%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { duration: 1000 }
        }
    });
}

function drawTimeOfDayChart(leadsArray) {
    const ctx = document.getElementById('timeOfDayChart');
    if (!ctx) return;
    if (chartTimeOfDay) chartTimeOfDay.destroy();

    // Hitung lead masuk dan closing per jam
    const hourLeads = new Array(24).fill(0);
    const hourClosing = new Array(24).fill(0);
    leadsArray.forEach(L => {
        if (!L.created_at) return;
        const h = new Date(L.created_at).getHours();
        hourLeads[h]++;
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
            hourClosing[h]++;
        }
    });

    const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    chartTimeOfDay = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Lead Masuk',
                    data: hourLeads,
                    backgroundColor: 'rgba(139,92,246,0.5)',
                    borderColor: '#8B5CF6',
                    borderWidth: 1,
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'Closing',
                    data: hourClosing,
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    borderWidth: 2,
                    borderRadius: 4,
                    type: 'line',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#10B981',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: 'var(--text-secondary)', boxWidth: 12, padding: 16 } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)', font: { size: 10 }, maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
                y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: 'var(--text-secondary)', precision: 0 } }
            }
        }
    });
}

function drawSpeedToLeadChart(leadsArray) {
    const ctx = document.getElementById('speedToLeadChart');
    if (!ctx) return;
    if (chartSpeedToLead) chartSpeedToLead.destroy();

    // Bucket leads berdasarkan response time
    const buckets = [
        { label: '< 5 Menit', max: 5, leads: [], closed: 0 },
        { label: '5–30 Menit', max: 30, leads: [], closed: 0 },
        { label: '30m–2 Jam', max: 120, leads: [], closed: 0 },
        { label: '2–6 Jam', max: 360, leads: [], closed: 0 },
        { label: '> 6 Jam', max: Infinity, leads: [], closed: 0 },
    ];

    leadsArray.forEach(L => {
        if (!L.status_history || L.status_history.length === 0 || !L.created_at) return;
        const firstFU = L.status_history.find(h => h.status !== 'New Data');
        if (!firstFU) return;
        const responseMin = (new Date(firstFU.changed_at) - new Date(L.created_at)) / 60000;
        if (responseMin <= 0) return;

        const bucket = buckets.find(b => responseMin <= b.max);
        if (!bucket) return;
        bucket.leads.push(L);
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') bucket.closed++;
    });

    const labels = buckets.map(b => b.label);
    const cvrData = buckets.map(b => b.leads.length > 0 ? parseFloat(((b.closed / b.leads.length) * 100).toFixed(1)) : 0);
    const countData = buckets.map(b => b.leads.length);

    chartSpeedToLead = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Win Rate (%)',
                    data: cvrData,
                    backgroundColor: cvrData.map(v => v >= 30 ? 'rgba(16,185,129,0.8)' : v >= 15 ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.75)'),
                    borderRadius: 6,
                    borderWidth: 0,
                    yAxisID: 'yCVR',
                    order: 1
                },
                {
                    label: 'Jumlah Lead',
                    data: countData,
                    type: 'line',
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99,102,241,0.1)',
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#6366F1',
                    fill: true,
                    yAxisID: 'yCount',
                    order: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: 'var(--text-secondary)', boxWidth: 12, padding: 16 } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ctx.dataset.label === 'Win Rate (%)' ? `Win Rate: ${ctx.raw}%` : `Lead: ${ctx.raw}`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)', font: { size: 11 } } },
                yCVR: { beginAtZero: true, max: 100, position: 'left', ticks: { color: '#10B981', callback: v => v + '%' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                yCount: { beginAtZero: true, position: 'right', ticks: { color: '#6366F1', precision: 0 }, grid: { display: false } }
            }
        }
    });
}

function drawLostReasonChart(reasonMap) {
    const ctx = document.getElementById('lostReasonChart');
    if (!ctx) return;

    if (chartLostReason) chartLostReason.destroy();

    const labels = Object.keys(reasonMap);
    const data = Object.values(reasonMap);

    if (labels.length === 0) {
        // Dummy datanya kosong
        labels.push('Belum ada data');
        data.push(1);
        ctx.getContext('2d').globalAlpha = 0.2;
    } else {
        ctx.getContext('2d').globalAlpha = 1.0;
    }

    chartLostReason = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#8B5CF6', '#64748B'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: "'Inter', sans-serif" } } }
            }
        }
    });
}

function drawTrendChart(leadsArray) {
    const ctx = document.getElementById('leadsTrendChart');
    if (!ctx) return;

    // Group by week for cleaner visualization
    const weekMap = {};
    leadsArray.forEach(L => {
        if (!L.created_at) return;
        const d = new Date(L.created_at);
        // Get Monday of the week
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d);
        monday.setDate(diff);
        const weekKey = monday.toISOString().split('T')[0];
        weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
    });

    const sortedWeeks = Object.keys(weekMap).sort();
    const weekVals = sortedWeeks.map(w => weekMap[w]);

    // Format labels: "3 Sep", "10 Sep", etc.
    const labels = sortedWeeks.map(w => {
        const d = new Date(w);
        return d.getDate() + ' ' + d.toLocaleString('id-ID', { month: 'short' });
    });

    // Cumulative running total
    let cumulative = 0;
    const cumulativeVals = weekVals.map(v => { cumulative += v; return cumulative; });

    if (chartTrend) chartTrend.destroy();

    const ctxFill = ctx.getContext('2d');
    const grad1 = ctxFill.createLinearGradient(0, 0, 0, 280);
    grad1.addColorStop(0, 'rgba(37, 99, 234, 0.2)');
    grad1.addColorStop(1, 'rgba(37, 99, 234, 0)');

    const grad2 = ctxFill.createLinearGradient(0, 0, 0, 280);
    grad2.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    grad2.addColorStop(1, 'rgba(16, 185, 129, 0)');

    chartTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Leads / Minggu',
                    data: weekVals,
                    borderColor: '#2563ea',
                    backgroundColor: grad1,
                    fill: true,
                    tension: 0.45,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHitRadius: 20,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#2563ea',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Kumulatif',
                    data: cumulativeVals,
                    borderColor: '#10B981',
                    backgroundColor: grad2,
                    fill: true,
                    tension: 0.45,
                    borderWidth: 1.5,
                    borderDash: [4, 3],
                    pointRadius: 0,
                    pointHitRadius: 20,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#10B981',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#8896AB',
                        font: { size: 11 },
                        boxWidth: 12,
                        boxHeight: 2,
                        padding: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        title: (items) => 'Minggu ' + items[0].label
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                    ticks: { color: '#8896AB', font: { size: 11 }, padding: 6 },
                    title: { display: false }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: '#6ee7b7', font: { size: 10 }, padding: 6 },
                    title: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#8896AB',
                        font: { size: 10 },
                        maxRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 12
                    }
                }
            }
        }
    });
}

function drawPackageChart(leadsArray) {
    const ctx = document.getElementById('packageChart');
    if (!ctx) return;

    const grouped = {};
    leadsArray.forEach(L => {
        let p = L.paket_pilihan && L.paket_pilihan.trim() !== '' ? L.paket_pilihan : 'Lainnya';
        grouped[p] = (grouped[p] || 0) + 1;
    });

    const total = leadsArray.length || 1;

    // Sort and limit to 6 + Lainnya to avoid clutter
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    let finalLabels = [];
    let finalValues = [];
    let otherCount = 0;

    sorted.forEach((item, index) => {
        if (index < 6) {
            finalLabels.push(item[0]);
            finalValues.push(item[1]);
        } else {
            otherCount += item[1];
        }
    });

    if (otherCount > 0) {
        finalLabels.push('Lainnya');
        finalValues.push(otherCount);
    }

    if (chartPkg) chartPkg.destroy();

    const chartColors = ['#2563ea', '#ea580c', '#16a34a', '#d97706', '#9333ea', '#ec4899', '#64748b'];

    chartPkg = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: finalLabels,
            datasets: [{
                data: finalValues,
                backgroundColor: chartColors.slice(0, finalLabels.length),
                borderWidth: 2,
                borderColor: 'var(--bg-card, #1a1f35)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%', // Thinner ring looks more modern
            plugins: {
                legend: {
                    position: 'right', // Move legend to right to save vertical space
                    labels: {
                        color: '#8896AB',
                        font: { size: 11 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function (chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const val = data.datasets[0].data[i];
                                const pct = ((val / total) * 100).toFixed(1);
                                // Truncate long package names
                                let shortLabel = label.length > 22 ? label.substring(0, 22) + '...' : label;
                                return {
                                    text: `${shortLabel} (${pct}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: 'transparent',
                                    pointStyle: 'circle',
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    titleColor: '#e2e8f0',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function (ctx) {
                            const val = ctx.raw;
                            const pct = ((val / total) * 100).toFixed(1);
                            return ` ${ctx.label}: ${val} leads (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

var chartFunnel = null;
var chartCity = null;

function drawStatusFunnelChart(leadsArray) {
    const ctx = document.getElementById('statusFunnelChart');
    if (!ctx) return;

    const statusOrder = ['New Data', 'Contacted', 'Proses FU', 'DP', 'Order Complete', 'Lost'];
    const statusColors = ['#2563ea', '#9333EA', '#3B82F6', '#F59E0B', '#16a34a', '#DC2626'];
    const counts = statusOrder.map(s => leadsArray.filter(L => L.status_followup === s).length);

    if (chartFunnel) chartFunnel.destroy();
    chartFunnel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statusOrder,
            datasets: [{
                label: 'Jumlah',
                data: counts,
                backgroundColor: statusColors,
                borderRadius: 6,
                barThickness: 22
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, grid: { display: false }, ticks: { color: '#8896AB' } },
                y: { grid: { display: false }, ticks: { color: '#8896AB' } }
            }
        }
    });
}

function drawCityChart(leadsArray) {
    const ctx = document.getElementById('cityChart');
    if (!ctx) return;

    const grouped = {};
    leadsArray.forEach(L => {
        const city = L.domisili && L.domisili.trim() !== '' ? L.domisili : 'Tidak Diketahui';
        grouped[city] = (grouped[city] || 0) + 1;
    });

    // Sort by count descending, take top 8
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const cityColors = ['#2563ea', '#16a34a', '#D97706', '#9333EA', '#DB2777', '#DC2626', '#64748b', '#0891b2'];

    if (chartCity) chartCity.destroy();
    chartCity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
                label: 'Leads',
                data: sorted.map(s => s[1]),
                backgroundColor: cityColors.slice(0, sorted.length),
                borderRadius: 6,
                barThickness: 28
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8896AB' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// RENDER LEADS TABLE (Full)
let currentPage = 1;

window.setOptDate = function (prefix, opt) {
    const now = new Date();
    // Clone clean dates (no time carry-over)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start = new Date(today);
    let end = new Date(today);

    if (opt === 'today') {
        // start & end = today (already set above)
    } else if (opt === 'yesterday') {
        start = new Date(today); start.setDate(today.getDate() - 1);
        end = new Date(today); end.setDate(today.getDate() - 1);
    } else if (opt === '7d') {
        start = new Date(today); start.setDate(today.getDate() - 6);
    } else if (opt === '14d') {
        start = new Date(today); start.setDate(today.getDate() - 13);
    } else if (opt === '1m') {
        start = new Date(today); start.setMonth(today.getMonth() - 1);
    }

    const fmt = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    };

    if (opt === 'all') {
        document.getElementById(prefix + 'StartDate').value = '';
        document.getElementById(prefix + 'EndDate').value = '';
    } else {
        document.getElementById(prefix + 'StartDate').value = fmt(start);
        document.getElementById(prefix + 'EndDate').value = fmt(end);
    }

    if (prefix === 'leads') { currentPage = 1; renderLeadsTable(); }
    else fetchDashboardData();
}

// Bulk selection state
let selectedLeads = new Set();

function renderLeadsTable() {
    const searchVal = document.getElementById('searchLead').value.toLowerCase();
    const filterVal = document.getElementById('filterStatus').value;
    const filterCS = document.getElementById('filterCS')?.value || '';
    const body = document.getElementById('tblLeadsBody');
    if (!body) return;
    body.innerHTML = '';

    // Reset selections on table re-render
    selectedLeads.clear();
    const checkAll = document.getElementById('checkAllLeads');
    if (checkAll) checkAll.checked = false;
    updateBulkActionBar();

    // Date range filter
    const sd = document.getElementById('leadsStartDate').value;
    const ed = document.getElementById('leadsEndDate').value;
    let baseData = filterByDateRange(allLeads, sd, ed);

    // Sorting logic globals definition at top
    window.currentSortCol = window.currentSortCol || 'created_at';
    window.currentSortDir = window.currentSortDir || 'desc';

    window.handleSort = function (col) {
        if (window.currentSortCol === col) {
            window.currentSortDir = window.currentSortDir === 'asc' ? 'desc' : 'asc';
        } else {
            window.currentSortCol = col;
            window.currentSortDir = 'asc';
        }

        // Update header UI
        document.querySelectorAll('.sort-icon').forEach(el => {
            el.className = 'fas fa-sort sort-icon';
            el.style.color = '';
            el.style.opacity = '0.5';
        });
        const icon = document.getElementById('sortIcon-' + col);
        if (icon) {
            icon.className = window.currentSortDir === 'asc' ? 'fas fa-sort-up sort-icon' : 'fas fa-sort-down sort-icon';
            icon.style.color = 'var(--brand)';
            icon.style.opacity = '1';
        }

        currentPage = 1;
        renderLeadsTable();
    };

    // Text, Status & CS Filter
    let filtered = baseData.filter(L => {
        let matchS = filterVal === 'All' || L.status_followup === filterVal;
        let matchCS = !filterCS || (L.assigned_to || '') === filterCS || (L.assigned_to_name || '') === filterCS;
        let matchQ = L.nama_lengkap.toLowerCase().includes(searchVal) ||
            L.user_id.toLowerCase().includes(searchVal) ||
            L.whatsapp_num.includes(searchVal) ||
            (L.paket_pilihan || '').toLowerCase().includes(searchVal) ||
            (L.assigned_to_name || '').toLowerCase().includes(searchVal);
        return matchS && matchCS && matchQ;
    });

    // Expose for Export CSV
    window.__currentTableData = filtered;

    // Apply Sorting
    filtered.sort((a, b) => {
        let valA = a[window.currentSortCol] !== undefined && a[window.currentSortCol] !== null ? a[window.currentSortCol] : '';
        let valB = b[window.currentSortCol] !== undefined && b[window.currentSortCol] !== null ? b[window.currentSortCol] : '';

        if (window.currentSortCol === 'created_at') {
            valA = new Date(valA).getTime() || 0;
            valB = new Date(valB).getTime() || 0;
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return window.currentSortDir === 'asc' ? -1 : 1;
        if (valA > valB) return window.currentSortDir === 'asc' ? 1 : -1;
        return 0;
    });

    if (filtered.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-secondary);">Tidak ada data leads ditemukan.</td></tr>`;
        const pf = document.getElementById('pageInfo');
        if (pf) pf.textContent = `Showing 0 of 0`;
        return;
    }

    // Pagination Logic
    var pageSizeEl = document.getElementById('pageSize');
    let limit = pageSizeEl ? pageSizeEl.value : '20';
    let startIdx = 0;
    let endIdx = filtered.length;
    let totalItems = filtered.length;

    if (limit !== 'All') {
        limit = parseInt(limit, 10);
        let maxPage = Math.ceil(totalItems / limit) || 1;
        if (currentPage > maxPage) currentPage = maxPage;

        startIdx = (currentPage - 1) * limit;
        endIdx = startIdx + limit;

        // update UI info
        let displayEnd = Math.min(endIdx, totalItems);
        const pf = document.getElementById('pageInfo');
        if (pf) pf.textContent = `Showing ${startIdx + 1} - ${displayEnd} of ${totalItems}`;
        const pBtn = document.getElementById('btnPagePrev');
        if (pBtn) pBtn.disabled = currentPage === 1;
        const nBtn = document.getElementById('btnPageNext');
        if (nBtn) nBtn.disabled = currentPage === maxPage;
    } else {
        const pf = document.getElementById('pageInfo');
        if (pf) pf.textContent = `Showing All ${totalItems}`;
        const pBtn = document.getElementById('btnPagePrev');
        if (pBtn) pBtn.disabled = true;
        const nBtn = document.getElementById('btnPageNext');
        if (nBtn) nBtn.disabled = true;
    }

    const highlightCount = parseInt(window.uiHighlightCount) || 5;
    const recentlyUpdatedIds = [...allLeads]
        .filter(l => l.updated_at && (new Date(l.updated_at).getTime() > new Date(l.created_at).getTime() + 1000))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, highlightCount)
        .map(l => l.id);

    filtered.slice(startIdx, endIdx).forEach(L => {
        let statCls = L.status_followup.toLowerCase().replace(/\s+/g, '');
        const csName = L.assigned_to_name || L.assigned_to || '—';
        const csInitial = csName !== '—' ? csName.charAt(0).toUpperCase() : '?';
        const csColors = [
            '#6366F1', '#22D3EE', '#F472B6', '#34D399', '#FBBF24', '#FB923C', '#A78BFA', '#60A5FA'
        ];
        const csColorIdx = csName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % csColors.length;
        const csColor = csColors[csColorIdx];

        // Smart Copy element (Only for Super Admin)
        const isSuperAdmin = currentUserData?.role === 'super_admin';
        const smartCopyHtml = isSuperAdmin
            ? `<button class="btn-mini btn-outline" style="border:none; padding:2px 4px; font-size:0.8rem; margin-left:6px; color:var(--brand); background:rgba(91,158,244,0.1);" title="Smart Copy" onclick="openSmartCopyModal('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"><i class="far fa-copy"></i></button>`
            : '';

        const tr = document.createElement('tr');
        tr.className = 'table-main-row';

        const recentIdx = recentlyUpdatedIds.indexOf(L.id);
        if (recentIdx !== -1) {
            const hColor = window.uiHighlightColor || '#16A34A';
            const hStyle = window.uiHighlightStyle || 'solid';
            const opacity = 0.25 - (recentIdx * 0.04);

            let r = 22, g = 163, b = 74;
            let m = hColor.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
            if (m) {
                let hex = m[1];
                if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }

            if (hStyle === 'glow') {
                tr.style.setProperty('box-shadow', `inset 0 0 16px rgba(${r}, ${g}, ${b}, ${opacity * 1.5})`, 'important');
                tr.style.setProperty('border', `2px solid rgba(${r}, ${g}, ${b}, ${opacity * 2})`, 'important');
            } else if (hStyle === 'text') {
                tr.style.setProperty('color', `rgba(${r}, ${g}, ${b}, ${opacity * 3 + 0.3})`, 'important');
                tr.style.setProperty('font-weight', `bold`, 'important');
            } else {
                tr.style.setProperty('background-color', `rgba(${r}, ${g}, ${b}, ${opacity})`, 'important');
            }
        }

        tr.onclick = (e) => {
            if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return; // ignore if clicking buttons
            if (e.target.type === 'checkbox') {
                toggleSelectLead(L.id, e.target.checked);
                return;
            }
            toggleAccordion(L.id);
        };
        tr.innerHTML = `
            <td style="text-align:center;">
                <input type="checkbox" class="lead-checkbox" value="${L.id}" ${selectedLeads.has(L.id) ? 'checked' : ''} style="cursor:pointer; width:16px; height:16px; accent-color:var(--brand);">
            </td>
            <td>
                <div style="display:flex; align-items:flex-start; gap:10px;">
                    <div>
                        <div style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:2px;">
                            ${formatDate(L.created_at)} · <strong>${timeAgo(L.created_at)}</strong>
                        </div>
                        <strong style="cursor:pointer; display:inline-block; font-size:1.05rem;" title="Klik untuk Smart Copy" onclick="smartCopyLead('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"
                            onmouseover="this.style.color='var(--brand)'" onmouseout="this.style.color=''">${L.nama_lengkap}</strong>
                        <button class="btn-mini" style="border:none; padding:2px 5px; font-size:0.75rem; margin-left:5px; color:var(--brand); background:transparent; cursor:pointer;" title="Copy: Nama + No HP" onclick="copyNameWa('${L.nama_lengkap.replace(/'/g, '&#39;')}', '${L.whatsapp_num}', this)">
                            <i class="far fa-copy"></i>
                        </button>
                        <div style="font-size:0.85rem; margin-top:2px;">
                            <a href="#" class="wa-direct" onclick="alertWA('${L.whatsapp_num}'); return false;" style="color:var(--success); font-weight:600; text-decoration:none;">${L.whatsapp_num}</a>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                            <i class="fas fa-map-marker-alt"></i> ${L.domisili || '-'} | <span style="font-family:monospace; color:var(--brand);">${L.user_id || L.id}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-weight:600; margin-bottom:2px;">${L.paket_pilihan || 'N/A'}</div>
                <div style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:4px;">${L.yang_berangkat || '1 Pax'}</div>
                ${(() => {
                const progName = L.program_id ? getProgramName(L.program_id) : null;
                const rev = L.revenue || 0;
                const revBadge = rev > 0 ? `<span style="color:#10B981;font-size:0.75rem;font-weight:700;">Rp ${formatRpShort(rev)}</span>` : '';
                const hasProg = progName && progName !== '-';
                if (!hasProg && !revBadge) return '';
                return `<div style="display:flex; gap:6px; align-items:center;">
                            ${hasProg ? `<span style="font-size:0.75rem; background:rgba(91,158,244,0.1); color:var(--brand); padding:2px 6px; border-radius:4px; font-weight:600;">${progName}</span>` : ''}
                            ${revBadge}
                        </div>`;
            })()}
            </td>
            <td>
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                    <div style="width:24px; height:24px; border-radius:50%; background:${csColor}22; border:1px solid ${csColor}; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:700; color:${csColor};">${csInitial}</div>
                    <span style="font-size:0.85rem; font-weight:600;">${csName}</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">
                    <i class="fas fa-link"></i> ${formatLpName(L.landing_page)} <br>
                    <span style="background:#f1f5f9; padding:1px 4px; border-radius:3px; margin-top:2px; display:inline-block; font-size:0.7rem; text-transform:uppercase;">${L.utm_source || 'organic'} • ${L.form_source || 'Default'}</span>
                </div>
            </td>
            <td>
                <span class="status st-${statCls}">${L.status_followup}</span>
                ${L.catatan ? `<div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${L.catatan.replace(/"/g, '&quot;')}">${L.catatan}</div>` : ''}
            </td>
            <td style="text-align:right;">
                <div class="act-row" style="justify-content:flex-end;">
                    <button class="btn-mini btn-outline" onclick="toggleAccordion('${L.id}')"><i class="fas fa-chevron-down"></i> Detail</button>
                    ${isSuperAdmin ? `<button class="btn-mini btn-outline" style="border:none; padding:2px 4px; font-size:0.8rem; margin-left:6px; color:var(--brand); background:rgba(91,158,244,0.1);" title="Smart Copy" onclick="openSmartCopyModal('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"><i class="far fa-copy"></i></button>` : ''}
                    <button class="btn-mini btn-primary" onclick="openWaModal('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"><i class="fab fa-whatsapp"></i></button>
                    ${currentUserData?.role === 'super_admin' ? `<button class="btn-mini btn-danger" style="background:var(--danger-light); color:var(--danger); border-color:transparent;" onclick="deleteLead('${L.id}', '${(L.nama_lengkap || '').replace(/'/g, '')}')" title="Hapus Lead" onmouseover="this.style.background='var(--danger)'; this.style.color='#fff'" onmouseout="this.style.background='var(--danger-light)'; this.style.color='var(--danger)'"><i class="fas fa-trash"></i></button>` : ''}
                </div>
            </td>
        `;
        body.appendChild(tr);

        const trAcc = document.createElement('tr');
        trAcc.className = 'accordion-row';
        trAcc.id = 'acc-' + L.id;
        trAcc.innerHTML = `
            <td colspan="6" class="accordion-content" style="padding: 20px 24px !important; background: var(--bg-surface);">
                <div style="display:grid; grid-template-columns: 1fr 1.3fr 1FR; gap: 20px; font-size: 0.85rem;">
                    
                    <!-- Profil Singkat -->
                    <div style="background: var(--bg-app); padding: 18px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                        <strong style="display:flex; align-items:center; gap:8px; margin-bottom:12px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;"><i class="fas fa-id-card"></i> Kebutuhan Jamaah</strong>
                        <ul style="list-style:none; padding:0; margin:0; line-height:1.7; color:var(--text-primary);">
                            <li><span style="color:var(--text-secondary); display:inline-block; width:70px;">Domisili</span> <strong>${L.domisili || '-'}</strong></li>
                            <li><span style="color:var(--text-secondary); display:inline-block; width:70px;">Paspor</span> <strong>${L.kesiapan_paspor || '-'}</strong></li>
                            <li><span style="color:var(--text-secondary); display:inline-block; width:70px;">Jumlah</span> <strong>${L.yang_berangkat || '-'}</strong></li>
                            <li><span style="color:var(--text-secondary); display:inline-block; width:70px;">Paket</span> <strong>${L.paket_pilihan || '-'}</strong></li>
                            <li><span style="color:var(--text-secondary); display:inline-block; width:70px;">Rencana</span> <strong>${L.rencana_umrah || '-'}</strong></li>
                            <li style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border); display:flex; align-items:center;">
                                <span style="color:var(--text-secondary); width:70px;">Sales/CS</span> 
                                <span style="background:var(--brand-light); color:var(--brand); padding:2px 8px; border-radius:12px; font-weight:600; font-size:0.75rem;">${L.assigned_to_name || L.assigned_to || 'Belum Assigned'}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Log Status & Program -->
                    <div style="background: var(--bg-app); padding: 18px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border); display:flex; flex-direction:column; gap:12px;">
                        <strong style="display:flex; align-items:center; gap:8px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;"><i class="fas fa-tasks"></i> Follow-up & Program</strong>
                        
                        <div style="display:flex; gap:8px; align-items:center;">
                            <select id="selStatus-${L.id}" class="select-base" style="padding:6px; flex:1;" onchange="toggleInlineRevenue('${L.id}')">
                                <option value="New Data" ${L.status_followup === 'New Data' ? 'selected' : ''}>New Data</option>
                                <option value="Contacted" ${L.status_followup === 'Contacted' ? 'selected' : ''}>Contacted</option>
                                <option value="Proses FU" ${L.status_followup === 'Proses FU' ? 'selected' : ''}>Proses FU</option>
                                <option value="DP" ${L.status_followup === 'DP' ? 'selected' : ''}>DP</option>
                                <option value="Order Complete" ${L.status_followup === 'Order Complete' ? 'selected' : ''}>Order Complete</option>
                                <option value="Lost" ${L.status_followup === 'Lost' ? 'selected' : ''}>Lost</option>
                                <option value="Pembatalan" ${L.status_followup === 'Pembatalan' ? 'selected' : ''}>Pembatalan</option>
                                <option value="Pengembalian" ${L.status_followup === 'Pengembalian' ? 'selected' : ''}>Pengembalian</option>
                            </select>
                            <input type="text" id="note-${L.id}" placeholder="Catatan baru..." style="flex:1.5; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-surface); color:var(--text-primary);" oninput="markSaveBtn('${L.id}')">
                            <button class="btn-primary btn-mini btn-save-lead" id="saveBtn-${L.id}" onclick="updateLeadStatus('${L.id}')" title="Simpan Log" style="background:#EC4899; border-color:#EC4899; padding:6px 14px;" data-saved="false"><i class="fas fa-save"></i></button>
                        </div>

                        <div id="lostReasonRow-${L.id}" style="display:${L.status_followup === 'Lost' ? 'flex' : 'none'}; gap:8px; align-items:center; background:rgba(239,68,68,0.05); padding:8px 10px; border-radius:6px; border-left:3px solid #EF4444;">
                            <label style="color:#EF4444; font-size:0.8rem; font-weight:600;"><i class="fas fa-heart-broken" style="margin-right:6px;"></i>Alasan Lost / Gagal</label>
                            <select id="selLostReason-${L.id}" class="select-base" style="flex:1; padding:6px; border-color:#fca5a5; font-size:0.8rem;" onchange="markSaveBtn('${L.id}')">
                                <option value="">-- Pilih Alasan Utama --</option>
                                <option value="Kendala Budget / Kemahalan">Kendala Budget / Kemahalan</option>
                                <option value="Pilih Travel Lain">Pilih Travel Lain (Kompetitor)</option>
                                <option value="Ghosting / Tidak Respon">Ghosting / Tidak Respon</option>
                                <option value="Ketidakcocokan Jadwal">Ketidakcocokan Jadwal / Tanggal</option>
                                <option value="Diskusi Keluarga Alot">Diskusi Keluarga Belum Sepakat</option>
                                <option value="Lainnya">Lainnya...</option>
                            </select>
                        </div>
                        
                        <div style="background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border);">
                            <div style="margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                                <small style="color:var(--text-secondary);">Update Terakhir: ${formatDate(L.updated_at || L.created_at)}</small>
                                <a href="#" onclick="openStatusHistory('${L.id}', '${encodeURIComponent(L.nama_lengkap || '').replace(/'/g, "%27")}'); return false;" style="color:var(--brand); text-decoration:none; font-weight:600; display:flex; align-items:center; gap:4px;"><i class="fas fa-history"></i> Log</a>
                            </div>
                            <div style="line-height:1.4;"><strong style="color:var(--brand)">[${L.status_followup}]</strong> - ${L.catatan || 'Lead Masuk Sistem'}</div>
                        </div>

                        <div style="border-top:1px dashed var(--border); padding-top:12px; margin-top:auto;">
                            <label style="font-weight:600; display:block; margin-bottom:6px; color:var(--text-secondary);">Pemilihan Program & Revenue</label>
                            <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                                <select id="selProg-${L.id}" class="select-base prog-select" style="padding:6px; flex:1;" onchange="handleProgramChange('${L.id}')">
                                    <option value="">— Pilih Program Khusus —</option>
                                    ${programsListCache.map(p => `<option value="${p.id}" ${p.id === L.program_id ? 'selected' : ''}>${p.nama_program}</option>`).join('')}
                                </select>
                            </div>
                            <div id="pkgDropRow-${L.id}" style="display:${L.program_id ? 'flex' : 'none'}; gap:8px; align-items:center; margin-bottom:8px;">
                                <select id="selPkg-${L.id}" class="select-base" style="padding:6px; flex:1; border-color:rgba(251,191,36,0.4);" onchange="handlePkgDropdownChange('${L.id}')">
                                    ${getPkgDropdownOptions(L.program_id, L.paket_pilihan)}
                                </select>
                            </div>
                            <div id="progSummary-${L.id}">
                                ${L.program_id ? getProgramSummaryHtml(L) : ''}
                            </div>
                            <div id="revRow-${L.id}" style="display:${['DP', 'Order Complete'].includes(L.status_followup) ? 'flex' : 'none'}; gap:8px; align-items:center; margin-top:10px; background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid rgba(245,158,11,0.3);">
                                <label style="font-weight:700; white-space:nowrap; color:#F59E0B;"><i class="fas fa-money-bill-wave" style="margin-right:6px;"></i>Nominal Rp</label>
                                <input type="text" id="rev-${L.id}" value="${L.revenue ? Number(L.revenue).toLocaleString('id-ID') : ''}" placeholder="mis: 35.000.000" style="flex:1; padding:6px 10px; font-size:1rem; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-app); color:var(--text-primary); font-weight:700;" class="rp-input" inputmode="numeric">
                            </div>
                        </div>
                    </div>

                    <!-- Action & Templates(Brosur / GDrive) -->
                    <div style="background: var(--bg-app); padding: 18px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border); display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                            <strong style="color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;"><i class="fas fa-paper-plane"></i> Komunikasi Lead</strong>
                            <button class="btn-mini btn-outline" onclick="openEditModal('${L.id}', '${L.status_followup}', \`${(L.catatan || '').replace(/`/g, "'")}\`, ${L.revenue || 0}, '${L.program_id || ''}')"><i class="fas fa-external-link-alt" style="margin-right:4px;"></i> Full Edit</button>
                        </div>
                        
                        <div style="margin-bottom:16px;">
                            <label style="font-weight:600; display:block; margin-bottom:6px; color:var(--text-secondary);">Lampiran Link (Drive / Brosur)</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <i class="fab fa-google-drive" style="color:#4285F4; font-size:1.2rem;"></i>
                                <input type="url" id="waLink-${L.id}" placeholder="https://..." style="flex:1; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-surface); color:var(--text-primary);">
                            </div>
                        </div>

                        <div style="background:var(--bg-surface); padding:12px; border-radius:var(--radius-sm); border:1px dashed var(--border);">
                            <label style="font-weight:600; display:block; margin-bottom:8px; color:var(--text-secondary); text-align:center;">Template Pesan WA Otomatis</label>
                            <div style="margin-bottom:12px; display:flex; gap:8px;">
                                ${(() => {
                const savedPrefix = localStorage.getItem('user_prefix') || 'Bapak/Ibu';
                return `
                                    <select id="userPrefix-${L.id}" class="user-prefix-input select-base" style="flex:1; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-app); color:var(--text-primary); font-size:0.8rem;" onchange="localStorage.setItem('user_prefix', this.value); document.querySelectorAll('.user-prefix-input').forEach(el => el.value = this.value);">
                                        <option value="Bapak/Ibu" ${savedPrefix === 'Bapak/Ibu' ? 'selected' : ''}>Bapak/Ibu</option>
                                        <option value="Kakak" ${savedPrefix === 'Kakak' ? 'selected' : ''}>Kakak</option>
                                        <option value="Mas/Mbak" ${savedPrefix === 'Mas/Mbak' ? 'selected' : ''}>Mas/Mbak</option>
                                        <option value="Agan" ${savedPrefix === 'Agan' ? 'selected' : ''}>Agan</option>
                                        <option value="Ust/Usth" ${savedPrefix === 'Ust/Usth' ? 'selected' : ''}>Ust/Usth</option>
                                    </select>
                                    `;
            })()}
                                <input type="text" id="csName-${L.id}" class="cs-name-input" placeholder="Panggilan CS (Cth: Teh Nisa)" value="${localStorage.getItem('cs_nickname') || ''}" style="flex:1; padding:6px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--bg-app); color:var(--text-primary); font-size:0.8rem; text-align:center;" onchange="localStorage.setItem('cs_nickname', this.value); document.querySelectorAll('.cs-name-input').forEach(el => el.value = this.value);">
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;" id="waTplGrid-${L.id}">
                                <button class="btn-outline btn-mini" onclick="sendWAtpl('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}', 1)" style="padding:8px; justify-content:center;"><i class="fab fa-whatsapp" style="color:#25D366; font-size:1rem;"></i> Katalog</button>
                                <button class="btn-outline btn-mini" onclick="sendWAtpl('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}', 2)" style="padding:8px; justify-content:center;"><i class="fab fa-whatsapp" style="color:#25D366; font-size:1rem;"></i> Paspor</button>
                                <button class="btn-outline btn-mini" onclick="sendWAtpl('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}', 3)" style="padding:8px; justify-content:center;"><i class="fab fa-whatsapp" style="color:#25D366; font-size:1rem;"></i> Kabar</button>
                                <button class="btn-primary btn-mini" onclick="openWaModal('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')" style="padding:8px; justify-content:center;"><i class="fas fa-comment-dots" style="font-size:1rem;"></i> WA Custom</button>
                                ${getCustomWaTplButtonsHtml(L)}
                            </div>
                            <div style="display:flex; gap:8px; margin-top:8px;">
                                <button class="btn-secondary btn-mini w-100" onclick="openTplBuilderModal()" style="background:var(--bg-app); border-color:var(--border); color:var(--text-secondary);"><i class="fas fa-magic" style="margin-right:6px; color:#EC4899;"></i>Kelola Template Khusus</button>
                            </div>
                            <button class="btn-primary btn-mini w-100" style="margin-top:8px; background:#EC4899; border-color:#EC4899;" onclick="openCustomFuModal('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"><i class="fas fa-clipboard-check" style="margin-right:6px;"></i>Log Follow Up Custom</button>
                        </div>
                    </div>
                </div>
            </td>
        `;
        body.appendChild(trAcc);
    });
    // Attach Rp formatter to new .rp-input elements rendered inside accordion
    initAllRpInputs();
}

// CUSTOM CONFIRM MODAL PROMISE
window.showConfirmModal = function (title, message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('confirmOverlay');
        const titleEl = document.getElementById('confirmTitle');
        const msgEl = document.getElementById('confirmMessage');
        const btnOk = document.getElementById('confirmBtnOk');
        const btnCancel = document.getElementById('confirmBtnCancel');

        if (!overlay) {
            resolve(confirm(title + '\n\n' + message));
            return;
        }

        titleEl.textContent = title;
        msgEl.textContent = message;

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const cleanup = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
            btnOk.onclick = null;
            btnCancel.onclick = null;
        };

        btnOk.onclick = () => {
            cleanup();
            resolve(true);
        };

        btnCancel.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
};

// DELETE LEAD — Super Admin only
window.deleteLead = async function (id, nama) {
    if (currentUserData?.role !== 'super_admin') {
        showToast('Hanya super admin yang bisa menghapus lead.', 'error');
        return;
    }
    const isOK = await showConfirmModal('Hapus Lead?', `⚠️ Yakin hapus lead "${nama}"?\n\nData yang dihapus TIDAK bisa dikembalikan.`);
    if (!isOK) return;
    try {
        const res = await fetch(`${API_URL}/leads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
            showToast(`🗑️ Lead "${nama}" berhasil dihapus.`);
            allLeads = allLeads.filter(L => L.id !== id && L.id !== id);
            renderLeadsTable();
            // Re-render overview widgets with updated data
            const sd = document.getElementById('overviewStartDate')?.value;
            const ed = document.getElementById('overviewEndDate')?.value;
            renderWidgetsAndCharts(filterByDateRange(allLeads, sd, ed));
        } else {
            showToast('Gagal menghapus: ' + (data.message || 'Server error'), 'error');
        }
    } catch (err) {
        console.error('Delete lead error:', err);
        showToast('Gagal menghapus lead. Cek koneksi.', 'error');
    }
};

// ============================================================
// BULK ACTIONS
// ============================================================

window.toggleSelectAllLeads = function (el) {
    const isChecked = el.checked;
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        if (isChecked) selectedLeads.add(cb.value);
        else selectedLeads.delete(cb.value);
    });
    updateBulkActionBar();
};

window.toggleSelectLead = function (id, isChecked) {
    if (isChecked) selectedLeads.add(id);
    else selectedLeads.delete(id);

    const checkAll = document.getElementById('checkAllLeads');
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    if (checkAll) {
        checkAll.checked = checkboxes.length > 0 && selectedLeads.size === checkboxes.length;
    }
    updateBulkActionBar();
};

window.updateBulkActionBar = function () {
    const bar = document.getElementById('bulkActionsBar');
    const countSpan = document.getElementById('bulkCount');
    if (!bar || !countSpan) return;

    if (selectedLeads.size > 0) {
        bar.style.display = 'flex';
        countSpan.textContent = `${selectedLeads.size} terpilih`;
    } else {
        bar.style.display = 'none';
    }
};

window.bulkChangeStatus = async function () {
    if (selectedLeads.size === 0) return;
    const newStatus = document.getElementById('bulkStatusSelect')?.value;
    if (!newStatus) {
        showToast('Pilih status baru terlebih dahulu!', 'error');
        return;
    }

    const ids = Array.from(selectedLeads);
    if (!confirm(`⚠️ Yakin mengubah status ${ids.length} lead menjadi "${newStatus}"?`)) return;

    try {
        let successCount = 0;
        // In real PROD, ideally we should have a bulk update endpoint
        // Here we update one by one for simplicity and existing endpoint
        for (let id of ids) {
            const lObj = allLeads.find(l => l.id === id);
            if (!lObj) continue;

            const payload = {
                data: {
                    ...lObj,
                    status_followup: newStatus,
                    updated_at: new Date().toISOString()
                }
            };

            const res = await fetch(`${API_URL}/leads/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                // Update local cache
                const idx = allLeads.findIndex(l => l.id === id);
                if (idx > -1) allLeads[idx].status_followup = newStatus;
                successCount++;
            }
        }

        showToast(`✅ ${successCount} lead berhasil diupdate statunya.`);
        document.getElementById('checkAllLeads').checked = false;
        selectedLeads.clear();
        renderLeadsTable();
        // re-calc overview
        const sd = document.getElementById('overviewStartDate')?.value;
        const ed = document.getElementById('overviewEndDate')?.value;
        renderWidgetsAndCharts(filterByDateRange(allLeads, sd, ed));

    } catch (e) {
        showToast('Gagal update massal. Cek koneksi.', 'error');
    }
};

window.bulkDeleteLeads = async function () {
    if (currentUserData?.role !== 'super_admin') {
        showToast('Hanya super admin yang bisa menghapus lead.', 'error');
        return;
    }

    if (selectedLeads.size === 0) return;
    const ids = Array.from(selectedLeads);
    const isOK = await showConfirmModal('Hapus Massal?', `⚠️ PERINGATAN! Yakin HAPUS ${ids.length} lead terpilih?\n\nData tidak bisa dikembalikan!`);
    if (!isOK) return;

    try {
        let successCount = 0;
        for (let id of ids) {
            const res = await fetch(`${API_URL}/leads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (data.success) {
                allLeads = allLeads.filter(L => L.id !== id && L.id !== id);
                successCount++;
            }
        }

        showToast(`🗑️ ${successCount} lead berhasil dihapus.`);
        document.getElementById('checkAllLeads').checked = false;
        selectedLeads.clear();
        renderLeadsTable();

        const sd = document.getElementById('overviewStartDate')?.value;
        const ed = document.getElementById('overviewEndDate')?.value;
        renderWidgetsAndCharts(filterByDateRange(allLeads, sd, ed));

    } catch (e) {
        showToast('Gagal menghapus massal. Cek koneksi.', 'error');
    }
};

// REFRESH LISTENER
['searchLead', 'filterStatus', 'filterCS', 'leadsStartDate', 'leadsEndDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(id === 'searchLead' ? 'input' : 'change', () => { currentPage = 1; renderLeadsTable(); });
    }
});

// Populate CS filter dropdown from leads data
function populateCSFilter() {
    const selL = document.getElementById('filterCS');
    const selO = document.getElementById('overviewCSFilter');

    const csSet = new Set();
    allLeads.forEach(L => {
        if (L.assigned_to_name) csSet.add(L.assigned_to_name);
        else if (L.assigned_to) csSet.add(L.assigned_to);
    });

    const optionsHtml = Array.from(csSet).map(cs => `<option value="${cs}">${cs}</option>`).join('');

    if (selL) {
        const oldVal = selL.value;
        selL.innerHTML = '<option value="">All CS</option>' + optionsHtml;
        if (oldVal && csSet.has(oldVal)) selL.value = oldVal;
    }

    if (selO) {
        const oldVal = selO.value;
        selO.innerHTML = '<option value="">All CS / Global</option>' + optionsHtml;
        if (oldVal && csSet.has(oldVal)) selO.value = oldVal;
    }
}

var pageSizeEl = document.getElementById('pageSize');
if (pageSizeEl) pageSizeEl.addEventListener('change', () => { currentPage = 1; renderLeadsTable(); });

var btnPrev = document.getElementById('btnPagePrev');
if (btnPrev) btnPrev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderLeadsTable(); } });

var btnNext = document.getElementById('btnPageNext');
if (btnNext) btnNext.addEventListener('click', () => { currentPage++; renderLeadsTable(); });

// FETCH PAGES DIRECTORY (New CMS Features)
var pagesListCache = [];

async function fetchPages() {
    try {
        const res = await fetch(`${API_URL}/pages`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        pagesGrid.innerHTML = '';
        if (data.success && data.pages) {
            pagesListCache = data.pages;
            data.pages.forEach(pg => {
                const isHome = pg.path === 'index.html';
                const icon = isHome ? 'fa-home' : 'fa-rocket';
                const statusCls = pg.status === 'Live' ? 'ordercomplete' : 'negoharga';
                const thumbUrl = pg.image || '';
                const thumbHtml = thumbUrl
                    ? `<div style="width:100%; height:160px; border-radius:var(--radius-md) var(--radius-md) 0 0; overflow:hidden; background:#0d1117; position:relative;">
                        <img src="${thumbUrl.startsWith('http') ? thumbUrl : pg.url.replace('/index.html', '') + '/' + thumbUrl}" 
                             style="width:100%; height:100%; object-fit:cover;" 
                             onerror="this.parentElement.innerHTML='<div style=\\'height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:2rem;\\'><i class=\\'fas fa-image\\'></i></div>'"
                        >
                       </div>`
                    : `<div style="width:100%; height:160px; border-radius:var(--radius-md) var(--radius-md) 0 0; background:linear-gradient(135deg, var(--brand), #9333ea); display:flex; align-items:center; justify-content:center; position:relative;">
                        <i class="fas ${icon}" style="font-size:2.5rem; color:white; opacity:0.7;"></i>
                       </div>`;

                const descSnippet = pg.description
                    ? `<div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:8px; line-height:1.4; border-left:2px solid var(--brand); padding-left:8px;">${pg.description.substring(0, 100)}${pg.description.length > 100 ? '...' : ''}</div>`
                    : '';

                const folderEncoded = encodeURIComponent(pg.folder);
                const formBadge = pg.linked_form_id
                    ? `<span style="font-size:0.65rem; background:rgba(139,92,246,0.15); color:#8B5CF6; padding:2px 8px; border-radius:50px; margin-left:6px;"><i class="fas fa-wpforms" style="margin-right:3px;"></i>Form</span>`
                    : `<span style="font-size:0.65rem; background:rgba(100,116,139,0.12); color:var(--text-secondary); padding:2px 8px; border-radius:50px; margin-left:6px;">No Form</span>`;
                const progCount = (pg.linked_program_ids || []).length;
                const programBadge = progCount > 0
                    ? `<span style="font-size:0.65rem; background:rgba(251,191,36,0.15); color:#FBBF24; padding:2px 8px; border-radius:50px; margin-left:4px;"><i class="fas fa-box-open" style="margin-right:3px;"></i>${progCount} Paket</span>`
                    : `<span style="font-size:0.65rem; background:rgba(100,116,139,0.12); color:var(--text-secondary); padding:2px 8px; border-radius:50px; margin-left:4px;">No Paket</span>`;
                const defaultBadge = pg.is_default
                    ? `<span style="font-size:0.65rem; background:rgba(236,72,153,0.15); color:#EC4899; padding:2px 8px; border-radius:50px; margin-right:4px;"><i class="fas fa-star" style="margin-right:3px;"></i>Default</span>`
                    : '';

                pagesGrid.innerHTML += `
                    <div class="page-card" style="padding:0; overflow:hidden; ${pg.is_default ? 'border-color:#EC4899;' : ''}">
                        ${thumbHtml}
                        <div style="padding:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                                <h4 style="font-size:0.9rem; line-height:1.3; margin:0; flex:1;">${pg.title}</h4>
                                <span class="status st-${statusCls}" style="margin-left:8px; white-space:nowrap;">${pg.status}</span>
                            </div>
                            <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:6px;">
                                <i class="fas fa-folder" style="margin-right:4px;"></i> ${pg.alias || pg.folder}
                            </div>
                            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
                                ${formBadge}${programBadge}${defaultBadge ? defaultBadge : ''}
                            </div>
                            ${descSnippet}
                            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                                <a href="${pg.url}" target="_blank" style="font-size:0.78rem; color:var(--brand); text-decoration:none;">
                                    <i class="fas fa-external-link-alt" style="margin-right:4px;"></i> Buka
                                </a>
                                <div style="display:flex; gap:4px;">
                                    ${!pg.is_default ? `<button class="btn-mini" title="Jadikan Default LP" onclick="setDefaultLP('${folderEncoded}')" style="color:#EC4899; font-size:0.65rem;"><i class="fas fa-star"></i></button>` : ''}
                                    <button class="btn-mini" title="Edit Form & Program" onclick="openLpEditModal('${folderEncoded}')">
                                        <i class="fas fa-pen" style="font-size:0.7rem;"></i>
                                    </button>
                                    <button class="btn-mini copy" onclick="navigator.clipboard.writeText(window.location.origin + '${pg.url}'); this.innerHTML='<i class=\\'fas fa-check\\'></i>'; setTimeout(()=>this.innerHTML='<i class=\\'far fa-copy\\'></i>',1500)" title="Copy URL">
                                        <i class="far fa-copy"></i>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

    } catch (e) { console.error('Error fetching pages', e); }
}

// ==================== LP EDIT MODAL ====================
var lpEditOverlay = document.getElementById('lpEditOverlay');
var lpEditForm = document.getElementById('lpEditForm');
var lpEditImageInput = document.getElementById('lpEditImage');
var lpEditImgPreview = document.getElementById('lpEditImgPreview');
var lpEditImgTag = document.getElementById('lpEditImgTag');
var lpEditImgError = document.getElementById('lpEditImgError');

document.getElementById('lpEditClose')?.addEventListener('click', closeLpEdit);
document.getElementById('lpEditCancelBtn')?.addEventListener('click', closeLpEdit);
lpEditOverlay?.addEventListener('click', (e) => { if (e.target === lpEditOverlay) closeLpEdit(); });

function closeLpEdit() {
    if (lpEditOverlay) lpEditOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

// Live image preview
lpEditImageInput?.addEventListener('input', function () {
    const url = this.value.trim();
    if (url && url.startsWith('http')) {
        lpEditImgPreview.style.display = 'block';
        lpEditImgTag.style.display = 'block';
        lpEditImgError.style.display = 'none';
        lpEditImgTag.src = url;
        lpEditImgTag.onerror = () => {
            lpEditImgTag.style.display = 'none';
            lpEditImgError.style.display = 'flex';
        };
    } else {
        lpEditImgPreview.style.display = 'none';
    }
});

window.openLpEditModal = function (folderEncoded) {
    const folder = decodeURIComponent(folderEncoded);
    const pg = pagesListCache.find(p => p.folder === folder);
    if (!pg) return;

    document.getElementById('lpEditFolder').value = folder;
    document.getElementById('lpEditTitle').textContent = `Edit: ${pg.title}`;
    lpEditImageInput.value = pg.image || '';
    document.getElementById('lpEditDesc').value = pg.description || '';

    // form linking & default
    const fbSelect = document.getElementById('lpEditFormLink');
    if (fbSelect) fbSelect.value = pg.linked_form_id || '';
    const defChk = document.getElementById('lpEditIsDefault');
    if (defChk) defChk.checked = pg.is_default || false;

    // Trigger preview
    if (pg.image && pg.image.startsWith('http')) {
        lpEditImgPreview.style.display = 'block';
        lpEditImgTag.style.display = 'block';
        lpEditImgError.style.display = 'none';
        lpEditImgTag.src = pg.image;
        lpEditImgTag.onerror = () => {
            lpEditImgTag.style.display = 'none';
            lpEditImgError.style.display = 'flex';
        };
    } else {
        lpEditImgPreview.style.display = 'none';
    }

    // Populate form dropdown
    if (fbSelect) {
        populateLpFormDropdown(fbSelect, pg.linked_form_id || '');
    }

    // Populate program checkboxes
    populateLpProgramCheckboxes(pg.linked_program_ids || []);

    lpEditOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

async function populateLpFormDropdown(selectEl, currentFormId) {
    try {
        const res = await fetch(`${API_URL}/forms`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        const forms = (data.data || []).filter(f => f.is_active);
        selectEl.innerHTML = `<option value="">— Tanpa Form (kosong) —</option>`;
        forms.forEach(f => {
            selectEl.innerHTML += `<option value="${f.id}" ${f.id === currentFormId ? 'selected' : ''}>${f.name}</option>`;
        });
    } catch (e) {
        console.warn('Cannot load forms for LP dropdown:', e);
    }
}

async function populateLpProgramCheckboxes(selectedIds) {
    const container = document.getElementById('lpProgramCheckboxList');
    if (!container) return;
    container.innerHTML = `<div style="padding:12px; text-align:center; color:var(--text-secondary); font-size:0.78rem;"><i class="fas fa-spinner fa-spin"></i> Memuat...</div>`;
    try {
        const res = await fetch(`${API_URL}/programs`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        const programs = data.programs || [];
        if (!programs.length) {
            container.innerHTML = `<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:0.78rem;">Belum ada program. Buat dulu di Program Builder.</div>`;
            return;
        }
        container.innerHTML = programs.map(p => {
            const checked = selectedIds.includes(String(p.id)) || selectedIds.includes(p.id);
            const minPrice = p.packages?.length ? Math.min(...p.packages.map(pk => pk.price)) : 0;
            const priceStr = minPrice ? `mulai ${formatRpShort(minPrice)}` : '';
            return `
            <label style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border-radius:10px; cursor:pointer; transition:background 0.15s; border:1px solid transparent;"
                onmouseover="this.style.background='rgba(251,191,36,0.08)'; this.style.borderColor='rgba(251,191,36,0.2)'"
                onmouseout="this.style.background=''; this.style.borderColor='transparent'">
                <input type="checkbox" name="lpProgramCheck" value="${p.id || p.id}"
                    ${checked ? 'checked' : ''}
                    style="width:16px; height:16px; accent-color:#FBBF24; margin-top:2px; flex-shrink:0;">
                <div>
                    <div style="font-weight:600; font-size:0.82rem; color:var(--text-primary);">${p.nama_program}</div>
                    <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
                        ${p.packages?.length || 0} paket ${priceStr ? '• ' + priceStr : ''}
                        ${p.is_active ? '<span style="color:#34D399; margin-left:4px;">● Aktif</span>' : '<span style="color:#F87171; margin-left:4px;">● Nonaktif</span>'}
                    </div>
                </div>
            </label>`;
        }).join('');
    } catch (err) {
        container.innerHTML = `<div style="padding:12px; color:var(--danger); font-size:0.78rem;">Gagal memuat program.</div>`;
    }
}

lpEditForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const folder = document.getElementById('lpEditFolder').value;
    const image_url = lpEditImageInput.value.trim();
    const description = document.getElementById('lpEditDesc').value.trim();
    const linked_form_id = document.getElementById('lpEditFormLink')?.value || '';
    const is_default = document.getElementById('lpEditIsDefault')?.checked || false;

    // Collect selected program IDs
    const programChecks = document.querySelectorAll('input[name="lpProgramCheck"]:checked');
    const linked_program_ids = Array.from(programChecks).map(cb => cb.value);

    try {
        const res = await fetch(`${API_URL}/pages/${encodeURIComponent(folder)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
            body: JSON.stringify({ image_url, description, linked_form_id, linked_program_ids, is_default })
        });
        const data = await res.json();
        if (data.success) {
            closeLpEdit();
            fetchPages();
            showToast(`LP diperbarui ✅ — ${linked_program_ids.length} program dikaitkan`);
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Server error updating page settings.');
    }
});

// ==================== LP SHOWCASE ON OVERVIEW ====================
async function fetchLpShowcase() {
    const grid = document.getElementById('lpShowcaseGrid');
    if (!grid) return;

    try {
        // Reuse cached pages or fetch fresh
        let pages = pagesListCache;
        if (!pages || pages.length === 0) {
            const res = await fetch(`${API_URL}/pages`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (data.success) {
                pages = data.pages;
                pagesListCache = pages;
            }
        }

        grid.innerHTML = '';
        if (!pages || pages.length === 0) {
            grid.innerHTML = '<div style="padding:24px; color:var(--text-secondary); text-align:center; width:100%;">Belum ada landing page.</div>';
            return;
        }

        pages.forEach(pg => {
            const thumbUrl = pg.image || '';
            const imgSrc = thumbUrl.startsWith('http') ? thumbUrl : (thumbUrl ? pg.url.replace('/index.html', '') + '/' + thumbUrl : '');
            const thumbStyle = imgSrc
                ? `background:url('${imgSrc}') center/cover no-repeat; background-color:#0d1117;`
                : `background:linear-gradient(135deg, var(--brand), #9333ea); display:flex; align-items:center; justify-content:center;`;
            const thumbInner = imgSrc ? '' : '<i class="fas fa-rocket" style="font-size:1.8rem; color:white; opacity:0.5;"></i>';
            const descText = pg.description ? pg.description.substring(0, 60) + (pg.description.length > 60 ? '...' : '') : '';

            grid.innerHTML += `
                <div style="min-width:220px; max-width:220px; scroll-snap-align:start; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; flex-shrink:0; transition:all 0.2s; cursor:pointer;"
                     onmouseenter="this.style.borderColor='var(--brand)'; this.style.transform='translateY(-2px)'"
                     onmouseleave="this.style.borderColor='var(--border)'; this.style.transform='none'"
                     onclick="window.open('${pg.url}', '_blank')">
                    <div style="width:100%; height:120px; ${thumbStyle}">
                        ${thumbInner}
                    </div>
                    <div style="padding:12px;">
                        <div style="font-weight:600; font-size:0.82rem; line-height:1.3; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${pg.title}</div>
                        ${descText ? `<div style="font-size:0.7rem; color:var(--text-secondary); line-height:1.3; margin-bottom:6px;">${descText}</div>` : ''}
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.65rem; padding:2px 8px; border-radius:50px; background:${pg.status === 'Live' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color:${pg.status === 'Live' ? '#10B981' : '#F59E0B'}; font-weight:700;">${pg.status}</span>
                            <span style="font-size:0.68rem; color:var(--text-secondary);"><i class="fas fa-folder" style="margin-right:2px;"></i>${pg.alias || pg.folder}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        console.error('Error fetching LP showcase', e);
    }
}

// ==================== PROGRAM MANAGEMENT ====================
async function fetchPrograms() {
    try {
        const res = await fetch(`${API_URL}/programs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        const grid = document.getElementById('programs-grid');
        const empty = document.getElementById('programs-empty');
        if (!grid) return;
        grid.innerHTML = '';

        if (data.success && data.programs && data.programs.length > 0) {
            if (empty) empty.style.display = 'none';
            data.programs.forEach(pg => {
                const activeBadge = pg.is_active
                    ? '<span style="font-size:0.65rem; padding:2px 8px; border-radius:50px; background:rgba(16,185,129,0.15); color:#10B981; font-weight:700;">AKTIF</span>'
                    : '<span style="font-size:0.65rem; padding:2px 8px; border-radius:50px; background:rgba(239,68,68,0.15); color:#EF4444; font-weight:700;">NONAKTIF</span>';

                const fallbackHtml = `<div class="poster-fallback" style="width:100%; height:160px; background:linear-gradient(135deg, #1E3A5F, #0B1120); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-image" style="font-size:2rem; color:rgba(255,255,255,0.15);"></i>
                       </div>`;

                // If img fails to load, hide img and show fallback div by selecting nextElementSibling
                const posterHtml = pg.poster_url
                    ? `<img src="${pg.poster_url}" style="width:100%; height:160px; object-fit:cover; border-radius:var(--radius-sm);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div style="display:none; width:100%; height:160px; background:linear-gradient(135deg, #1E3A5F, #0B1120); border-radius:var(--radius-sm); align-items:center; justify-content:center;">
                        <i class="fas fa-image" style="font-size:2rem; color:rgba(255,255,255,0.15);"></i>
                       </div>`
                    : fallbackHtml;

                grid.innerHTML += `
                    <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; transition:all 0.2s;" 
                         onmouseenter="this.style.borderColor='var(--brand)'" onmouseleave="this.style.borderColor='var(--border)'">
                        ${posterHtml}
                        <div style="padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <strong style="font-size:0.85rem; line-height:1.3;">${pg.nama_program}</strong>
                                ${activeBadge}
                            </div>
                            ${pg.deskripsi ? `<p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:10px; line-height:1.4;">${pg.deskripsi.substring(0, 80)}${pg.deskripsi.length > 80 ? '...' : ''}</p>` : ''}
                            <div style="display:flex; gap:6px; justify-content:flex-end;">
                                <button class="btn-mini" onclick="openProgramModal('${pg.id}')" title="Edit"><i class="fas fa-pen" style="font-size:0.7rem;"></i></button>
                                <button class="btn-mini" onclick="toggleProgram('${pg.id}', ${pg.is_active ? 0 : 1})" title="${pg.is_active ? 'Nonaktifkan' : 'Aktifkan'}">
                                    <i class="fas fa-${pg.is_active ? 'eye-slash' : 'eye'}" style="font-size:0.7rem;"></i>
                                </button>
                                <button class="btn-mini" onclick="deleteProgram('${pg.id}')" title="Hapus" style="color:var(--danger);"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            if (empty) empty.style.display = 'block';
        }
    } catch (e) { console.error('Error fetching programs', e); }
}

// Store programs data for edit
var programsCache = [];

async function openProgramModal(editId) {
    const overlay = document.getElementById('programOverlay');
    const title = document.getElementById('programModalTitle');
    overlay.style.display = 'flex';

    document.getElementById('programId').value = '';
    document.getElementById('programNama').value = '';
    document.getElementById('programPoster').value = '';
    document.getElementById('programDeskripsi').value = '';
    document.getElementById('programLink').value = '';
    document.getElementById('programOrder').value = '0';
    document.getElementById('programActive').value = '1';
    document.getElementById('programPosterPreview').style.display = 'none';

    if (editId) {
        title.textContent = 'Edit Program';
        try {
            const res = await fetch(`${API_URL}/programs`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            const data = await res.json();
            const pg = data.programs.find(p => String(p.id || p.id) === String(editId));
            if (pg) {
                document.getElementById('programId').value = pg.id;
                document.getElementById('programNama').value = pg.nama_program;
                document.getElementById('programPoster').value = pg.poster_url || '';
                document.getElementById('programDeskripsi').value = pg.deskripsi || '';
                document.getElementById('programLink').value = pg.landing_url || '';
                document.getElementById('programOrder').value = pg.sort_order || 0;
                document.getElementById('programActive').value = pg.is_active ? '1' : '0';
                if (pg.poster_url) {
                    document.getElementById('programPosterPreview').style.display = 'block';
                    document.getElementById('programPosterImg').src = pg.poster_url;
                }
            }
        } catch (e) { console.error(e); }
    } else {
        title.textContent = 'Tambah Program Baru';
    }
}

function closeProgramModal() {
    document.getElementById('programOverlay').style.display = 'none';
}

document.getElementById('programClose')?.addEventListener('click', closeProgramModal);
document.getElementById('programCancelBtn')?.addEventListener('click', closeProgramModal);

// Live poster preview for old modal
document.getElementById('programPoster')?.addEventListener('input', function () {
    const url = this.value.trim();
    const preview = document.getElementById('programPosterPreview');
    const img = document.getElementById('programPosterImg');
    const errObj = document.getElementById('programPosterError');
    if (url) {
        preview.style.display = 'block';
        img.style.display = 'block';
        errObj.style.display = 'none';
        img.src = url;
        img.onerror = () => { img.style.display = 'none'; errObj.style.display = 'flex'; };
    } else {
        preview.style.display = 'none';
        img.src = '';
    }
});

// Live poster preview for new builder modal
document.getElementById('pbPoster')?.addEventListener('input', function () {
    const url = this.value.trim();
    const preview = document.getElementById('pbPosterPreview');
    const img = document.getElementById('pbPosterImg');
    const errObj = document.getElementById('pbPosterError');
    if (url) {
        preview.style.display = 'block';
        img.style.display = 'block';
        errObj.style.display = 'none';
        img.src = url;
        img.onerror = () => { img.style.display = 'none'; errObj.style.display = 'flex'; };
    } else {
        preview.style.display = 'none';
        img.src = '';
    }
});

document.getElementById('programForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('programId').value;
    const payload = {
        nama_program: document.getElementById('programNama').value.trim(),
        poster_url: document.getElementById('programPoster').value.trim(),
        deskripsi: document.getElementById('programDeskripsi').value.trim(),
        landing_url: document.getElementById('programLink').value.trim(),
        sort_order: parseInt(document.getElementById('programOrder').value) || 0,
        is_active: document.getElementById('programActive').value === '1'
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/programs/${id}` : `${API_URL}/programs`;
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        closeProgramModal();
        fetchPrograms();
    } catch (err) { console.error(err); alert('Gagal menyimpan program'); }
});

async function toggleProgram(id, newState) {
    try {
        await fetch(`${API_URL}/programs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ is_active: newState })
        });
        fetchPrograms();
    } catch (e) { console.error(e); }
}

async function deleteProgram(id) {
    if (!confirm('Hapus program ini?')) return;
    try {
        await fetch(`${API_URL}/programs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        fetchPrograms();
    } catch (e) { console.error(e); }
}

document.getElementById('btnAddProgram')?.addEventListener('click', () => openProgramModal(null));

document.getElementById('btnExport')?.addEventListener('click', async () => {
    try {
        const btn = document.getElementById('btnExport');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        btn.disabled = true;

        const dataToExport = window.__currentTableData || [];

        btn.innerHTML = '<i class="fas fa-download"></i> Export';
        btn.disabled = false;

        if (dataToExport.length > 0) {
            // Build CSV natively (no external library needed)
            const headers = [
                'Lead UID', 'Tanggal', 'Nama Lengkap', 'No WhatsApp', 'Domisili',
                'Jumlah Peserta', 'Paket Pilihan', 'Kesiapan Paspor', 'Rencana Umrah',
                'Status', 'Catatan CRM', 'Revenue', 'CS Assigned', 'Landing Page', 'Form Source',
                'UTM Source', 'UTM Medium', 'UTM Campaign', 'Log Update'
            ];
            const escCsv = (val) => {
                if (val === null || val === undefined) return '';
                const s = String(val).replace(/"/g, '""');
                return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
            };
            const rows = dataToExport.map(L => {
                let historyLogStr = '';
                if (L.status_history && L.status_history.length > 0) {
                    historyLogStr = L.status_history.map(h => {
                        const date = new Date(h.changed_at).toLocaleString('id-ID');
                        return `[${date}] ${h.status} by ${h.changed_by_name}` + (h.catatan ? ` - ${h.catatan}` : '');
                    }).join(' | ');
                }
                return [
                    L.user_id || L.id,
                    formatDate(L.created_at),
                    L.nama_lengkap,
                    L.whatsapp_num,
                    L.domisili || '',
                    L.yang_berangkat || '',
                    L.paket_pilihan || '',
                    L.kesiapan_paspor || '',
                    L.rencana_umrah || '',
                    L.status_followup || '',
                    L.catatan || '',
                    L.revenue || 0,
                    L.assigned_to_name || L.assigned_to || '',
                    L.landing_page || '',
                    L.form_source || '',
                    L.utm_source || '',
                    L.utm_medium || '',
                    L.utm_campaign || '',
                    historyLogStr
                ].map(escCsv).join(',');
            });

            const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Munira_Leads_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`✅ Export berhasil: ${dataToExport.length} leads`);
        } else {
            showToast('Tidak ada data untuk diexport.', 'error');
        }
    } catch (err) {
        console.error('Export error:', err);
        showToast('Gagal mengekspor data.', 'error');
        document.getElementById('btnExport').innerHTML = '<i class="fas fa-download"></i> Export';
        document.getElementById('btnExport').disabled = false;
    }
});

// MARKETING HUB Settings Logic
var marketingForm = document.getElementById('marketingForm');
async function fetchSettings() {
    try {
        const res = await fetch(`${API_URL}/settings/admin`, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        if (data.success && data.data) {
            document.getElementById('mFbPixel').value = data.data.meta_pixel_id || '';
            document.getElementById('mGa4').value = data.data.ga4_id || '';
            document.getElementById('mTgToken').value = data.data.tg_bot_token || '';
            document.getElementById('mTgChat').value = data.data.tg_chat_id || '';

            window.uiHighlightColor = data.data.ui_highlight_color || '#16A34A';
            window.uiHighlightStyle = data.data.ui_highlight_style || 'solid';
            window.uiHighlightCount = data.data.ui_highlight_count || 5;

            if (document.getElementById('mUiHighlightColor')) {
                document.getElementById('mUiHighlightColor').value = window.uiHighlightColor;
                document.getElementById('mUiHighlightColorText').value = window.uiHighlightColor;
                document.getElementById('mUiHighlightStyle').value = window.uiHighlightStyle;
                document.getElementById('mUiHighlightCount').value = window.uiHighlightCount;
            }

            if (currentUserData && currentUserData.role === 'super_admin') {
                const sAdminPanel = document.getElementById('superAdminSettings');
                if (sAdminPanel) sAdminPanel.style.display = 'block';
            }
        }
    } catch (e) { }
}

if (marketingForm) {
    marketingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            meta_pixel_id: document.getElementById('mFbPixel').value,
            ga4_id: document.getElementById('mGa4').value,
            tg_bot_token: document.getElementById('mTgToken').value,
            tg_chat_id: document.getElementById('mTgChat').value,
            ui_highlight_color: document.getElementById('mUiHighlightColor').value,
            ui_highlight_style: document.getElementById('mUiHighlightStyle').value,
            ui_highlight_count: document.getElementById('mUiHighlightCount').value
        };
        try {
            const res = await fetch(`${API_URL}/settings/admin`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            alert(data.message || 'Saved successfully');
        } catch (e) { alert('Error saving configurations'); }
    });
}

var mUiHighlightColor = document.getElementById('mUiHighlightColor');
var mUiHighlightColorText = document.getElementById('mUiHighlightColorText');
if (mUiHighlightColor && mUiHighlightColorText) {
    mUiHighlightColor.addEventListener('input', e => mUiHighlightColorText.value = e.target.value);
    mUiHighlightColorText.addEventListener('input', e => mUiHighlightColor.value = e.target.value);
}

// ======================================
// CUSTOM FU MODAL LOGIC
// ======================================
var buildCfuOverlay = () => {
    document.getElementById('customFuClose')?.addEventListener('click', () => document.getElementById('customFuOverlay').classList.remove('active'));
    document.getElementById('cfuCancelBtn')?.addEventListener('click', () => document.getElementById('customFuOverlay').classList.remove('active'));
    const form = document.getElementById('customFuForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('cfuLeadId').value;
            const status = document.getElementById('cfuStatus').value;
            const note = document.getElementById('cfuNotes').value.trim();

            if (!id || !status || !note) {
                alert('Pilih status dan tuliskan catatan follow up!');
                return;
            }

            try {
                const b = { status_followup: status, catatan: note };
                const res = await fetch(`${API_URL}/leads/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                    body: JSON.stringify(b)
                });
                const data = await res.json();
                if (data.success) {
                    showToast('Follow Up Custom Disimpan. Status: ' + status);
                    document.getElementById('customFuOverlay').classList.remove('active');
                    fetchDashboardData();
                } else {
                    alert('Gagal: ' + data.message);
                }
            } catch (err) { alert('Error network'); }
        });
    }
};
buildCfuOverlay();

window.openCustomFuModal = function (encodedLead) {
    const L = JSON.parse(decodeURIComponent(encodedLead));
    document.getElementById('cfuLeadId').value = L.id || L.id || '';
    document.getElementById('cfuStatus').value = L.status_followup || 'New Data';
    document.getElementById('cfuNotes').value = '';
    document.getElementById('customFuOverlay').classList.add('active');
};

// MODAL WA EDITOR Logic
let activeWhatsApp = '';
const waOverlay = document.getElementById('waOverlay');
const waText = document.getElementById('waText');
window.openWaModal = function (leadStr) {
    const L = JSON.parse(decodeURIComponent(leadStr));
    activeWhatsApp = L.whatsapp_num.replace(/[^\d]/g, ''); // sanitize dial string
    if (activeWhatsApp.startsWith('0')) activeWhatsApp = '62' + activeWhatsApp.substring(1);

    const txt = `Assalamu'alaikum Bpk/Ibu ${L.nama_lengkap},\n\nTerima kasih telah mengunjungi halaman Munira World (${L.landing_page || 'Official Site'}).\nKami melihat Anda tertarik dengan program ${L.paket_pilihan || 'Umrah'}.\n\nApakah ada informasi yang bisa kami bantu jelaskan lebih lanjut terkait ketersediaan Seat atau Fasilitas?\n\nSalam Hangat,\nKonsultan Munira World`;
    waText.value = txt;
    waOverlay.classList.add('active');
}

document.getElementById('waClose')?.addEventListener('click', () => waOverlay.classList.remove('active'));
document.getElementById('waCopy')?.addEventListener('click', () => { navigator.clipboard.writeText(waText.value); alert('Script copied!'); });

const waAttachLink = document.getElementById('waAttachLink');
if (waAttachLink) {
    waAttachLink.addEventListener('click', () => {
        const link = prompt("Masukkan Link Google Drive atau Website:");
        if (link && link.trim() !== '') {
            waText.value += `\n\nBapak/Ibu juga bisa melihat informasi selengkapnya melalui tautan berikut:\n${link}`;
        }
    });
}
const waAttachPdf = document.getElementById('waAttachPdf');
if (waAttachPdf) {
    waAttachPdf.addEventListener('click', () => {
        const link = prompt("Masukkan Link URL Berkas Brosur PDF:");
        if (link && link.trim() !== '') {
            waText.value += `\n\nUntuk rincian paket selengkapnya, Bapak/Ibu dapat meninjau brosur pada tautan berikut:\n${link}`;
        }
    });
}

window.openWaPanel = function (phone, text) {
    let clean = (phone || '').replace(/[^\d]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);

    // Gunakan URL web.whatsapp.com secara langsung untuk iframe WA Web
    let url = `https://web.whatsapp.com/send/?phone=${clean}`;
    if (text) url += `&text=${encodeURIComponent(text)}`;

    document.getElementById('waIframe').src = url;
    document.getElementById('waPanel').classList.add('active');
    document.body.classList.add('wa-panel-open');
}

// Logic untuk WA Panel Toggle
document.getElementById('waToggle')?.addEventListener('click', () => {
    const waPanel = document.getElementById('waPanel');
    if (!waPanel.classList.contains('active')) {
        document.getElementById('waIframe').src = 'https://web.whatsapp.com/';
        waPanel.classList.add('active');
        document.body.classList.add('wa-panel-open');
    } else {
        waPanel.classList.remove('active');
        document.body.classList.remove('wa-panel-open');
    }
});

let currentWaNavUrl = '';

window.openWaPanelFixed = function (phone, text) {
    let clean = (phone || '').replace(/[^\d]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);

    // Simpan url aktif untuk mode popup jika iframe diblokir browser
    let url = `https://web.whatsapp.com/send/?phone=${clean}`;
    if (text) url += `&text=${encodeURIComponent(text)}`;
    currentWaNavUrl = url;

    document.getElementById('waIframe').src = url;
    document.getElementById('waPanel').classList.add('active');
    document.body.classList.add('wa-panel-open');
}

window.openWaPanel = window.openWaPanelFixed;

document.getElementById('waPanelPopup')?.addEventListener('click', () => {
    window.open(currentWaNavUrl || 'https://web.whatsapp.com/', 'WaWebPopup', 'width=800,height=700');
});

document.getElementById('waPanelClose')?.addEventListener('click', () => {
    const p = document.getElementById('waPanel');
    p.classList.remove('active');
    p.style.width = ''; // clear inline style
    document.body.classList.remove('wa-panel-open');
    document.body.style.removeProperty('--wa-panel-width');
    const mainW = document.querySelector('.main-wrapper');
    if (mainW) {
        mainW.style.marginRight = '';
        mainW.style.maxWidth = '';
    }
});

// WA PANEL RESIZER LOGIC
const waPanel = document.getElementById('waPanel');
const waResizer = document.getElementById('waResizer');
let isWaResizing = false;

if (waResizer) {
    waResizer.addEventListener('mousedown', (e) => {
        isWaResizing = true;
        document.body.style.cursor = 'ew-resize';
        // Add an invisible overlay to iframe so mouse doesn't get lost in it
        let iframeMask = document.getElementById('waIframeMask');
        if (!iframeMask) {
            iframeMask = document.createElement('div');
            iframeMask.id = 'waIframeMask';
            iframeMask.style.position = 'absolute';
            iframeMask.style.inset = '0';
            iframeMask.style.zIndex = '999';
            waPanel.appendChild(iframeMask);
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isWaResizing) return;
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 300 && newWidth <= window.innerWidth * 0.8) {
            waPanel.style.width = newWidth + 'px';
            document.body.style.setProperty('--wa-panel-width', newWidth + 'px');
            if (document.body.classList.contains('wa-panel-open')) {
                const mainW = document.querySelector('.main-wrapper');
                if (mainW) {
                    mainW.style.marginRight = newWidth + 'px';
                    mainW.style.maxWidth = `calc(100% - 230px - ${newWidth}px)`;
                }
            }
        }
    });

    document.addEventListener('mouseup', () => {
        if (isWaResizing) {
            isWaResizing = false;
            document.body.style.cursor = 'default';
            const iframeMask = document.getElementById('waIframeMask');
            if (iframeMask) iframeMask.remove();
        }
    });
}

document.getElementById('waSend')?.addEventListener('click', () => {
    window.openWaPanelFixed(activeWhatsApp, waText.value);
    waOverlay.classList.remove('active');
});
window.alertWA = function (num) {
    window.openWaPanel(num, '');
}

// MODAL EDIT LOGIC
var editOverlay = document.getElementById('editOverlay');
var editForm = document.getElementById('editForm');
var editStatusEl = document.getElementById('editStatus');

// Revenue visibility toggle for edit modal
if (editStatusEl) {
    editStatusEl.addEventListener('change', () => {
        const revGroup = document.getElementById('revenueGroup');
        if (['DP', 'Order Complete'].includes(editStatusEl.value)) {
            revGroup.style.display = 'block';
        } else {
            revGroup.style.display = 'none';
        }

        const lostGroup = document.getElementById('lostReasonGroup');
        if (lostGroup) {
            lostGroup.style.display = editStatusEl.value === 'Lost' ? 'block' : 'none';
        }
    });
}

// Revenue toggle for manual order modal
var moStatusEl = document.getElementById('moStatus');
if (moStatusEl) {
    moStatusEl.addEventListener('change', () => {
        const g = document.getElementById('moRevenueGroup');
        g.style.display = ['DP', 'Order Complete'].includes(moStatusEl.value) ? 'block' : 'none';
    });
}

// Inline revenue toggle
window.toggleInlineRevenue = function (id) {
    attachRpFormatter(document.getElementById('rev-' + id));
    const sel = document.getElementById('selStatus-' + id);
    const row = document.getElementById('revRow-' + id);
    if (sel && row) {
        row.style.display = ['DP', 'Order Complete'].includes(sel.value) ? 'flex' : 'none';
    }
    const lostRow = document.getElementById('lostReasonRow-' + id);
    if (sel && lostRow) {
        lostRow.style.display = sel.value === 'Lost' ? 'flex' : 'none';
    }
    markSaveBtn(id);
}

// Programs cache for name lookup
var programsListCache = [];
async function loadProgramsList() {
    try {
        const res = await fetch(`${API_URL}/programs`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        if (data.success) programsListCache = data.programs || [];
    } catch (e) { /* silent */ }
}

function getProgramName(progId) {
    if (!progId) return '-';
    const p = programsListCache.find(x => String(x.id || x.id) === String(progId));
    if (p) return p.nama_program;
    // Still loading? show abbreviated ID
    return '⏳ Memuat...';
}

function getProgramSummaryHtml(L) {
    const progId = L.program_id;
    if (!progId) return '';
    const p = programsListCache.find(x => String(x.id || x.id) === String(progId));
    if (!p) return '';

    // Dates
    const dates = (p.departure_dates || []);
    const datesHtml = dates.length > 0
        ? dates.map(d => `<span style="background:var(--brand-light); color:var(--brand); border-radius:4px; padding:2px 6px; font-size:0.7rem; margin-right:4px; margin-bottom:4px; display:inline-block;">${d.label || 'Tgl'}: ${d.start ? d.start.replace(/-/g, '/').substring(2) : ''} — ${d.end ? d.end.replace(/-/g, '/').substring(2) : ''}</span>`).join('')
        : '<span style="color:var(--text-secondary); font-size:0.7rem;">Tidak ada jadwal</span>';

    // Packages — rendered as clickable tile cards
    const pkgs = (p.packages || []).filter(x => x.price > 0);
    const minPrice = pkgs.length > 0 ? Math.min(...pkgs.map(x => x.price)) : 0;
    const priceStr = minPrice ? `Mulai ${formatRpShort(minPrice)}` : 'Harga belum diatur';

    return `
        <div style="margin-top:6px; padding:10px 12px; background:var(--bg-app); border:1px solid var(--border); border-radius:8px; font-size:0.75rem;">
            <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px; display:flex; align-items:center; justify-content:space-between;">
                <span><i class="fas fa-cube" style="color:var(--brand); margin-right:4px;"></i> ${p.nama_program}</span>
                <span style="color:#F59E0B; font-weight:700;">${priceStr}</span>
            </div>
            <div style="color:var(--text-secondary); line-height:1.4;">${p.deskripsi ? p.deskripsi : ''}</div>
            <div style="margin-top:6px;">${datesHtml}</div>
        </div>
    `;
}

// Helper — convert hex/named color to rgb triplet for rgba() usage
function hexToRgb(hex) {
    const map = {
        '#A78BFA': '167,139,250', '#FBBF24': '251,191,36', '#94A3B8': '148,163,184',
        '#C47B3A': '196,123,58', '#EC4899': '236,72,153', '#34D399': '52,211,153',
        'var(--brand)': '91,158,244'
    };
    return map[hex] || '91,158,244';
}

function populateProgramSelects(selectedId) {
    const selectors = document.querySelectorAll('#editProgram, #moProgram');
    selectors.forEach(sel => {
        const currentVal = sel.value || selectedId || '';
        const first = sel.querySelector('option:first-child');
        sel.innerHTML = '';
        const opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = '— Belum dipilih —';
        sel.appendChild(opt0);
        programsListCache.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.nama_program;
            if (p.id === currentVal) opt.selected = true;
            sel.appendChild(opt);
        });
    });
}

window.openEditModal = async function (id, status, notes, revenue, programId) {
    await loadProgramsList();
    document.getElementById('editId').value = id;
    document.getElementById('editStatus').value = status;
    document.getElementById('editCatatan').value = notes || '';

    // Revenue toggle
    const revEl = document.getElementById('editRevenue');
    attachRpFormatter(revEl);
    setRpInput(revEl, revenue);
    document.getElementById('revenueGroup').style.display = ['DP', 'Order Complete'].includes(status) ? 'block' : 'none';

    // Lost reason toggle
    const lostGroup = document.getElementById('lostReasonGroup');
    if (lostGroup) {
        lostGroup.style.display = status === 'Lost' ? 'block' : 'none';
        document.getElementById('editLostReason').value = ''; // reset everytime modal opens
    }

    populateProgramSelects(programId);
    if (programId) document.getElementById('editProgram').value = programId;
    editOverlay.classList.add('active');
}
document.getElementById('editClose')?.addEventListener('click', () => editOverlay.classList.remove('active'));

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const status = document.getElementById('editStatus').value;
        const rawNotes = document.getElementById('editCatatan').value;
        const revenue = parseRpInput(document.getElementById('editRevenue').value);
        const program_id = document.getElementById('editProgram').value;

        let finalNotes = rawNotes;
        if (status === 'Lost') {
            const reasonDrop = document.getElementById('editLostReason');
            const reason = reasonDrop ? reasonDrop.value : '';
            if (reason) {
                if (!finalNotes.includes('[Lost:')) {
                    finalNotes = `[Lost: ${reason}] ` + finalNotes;
                }
            } else if (!finalNotes && reason === '') {
                // Peringatan opsional
            }
        }

        // VALIDASI: DP / Order Complete WAJIB ada Revenue
        if (['DP', 'Order Complete'].includes(status)) {
            if (!revenue || revenue <= 0) {
                const revInput = document.getElementById('editRevenue');
                if (revInput) {
                    revInput.style.borderColor = 'var(--danger)';
                    revInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.25)';
                    revInput.focus();
                    setTimeout(() => {
                        revInput.style.borderColor = '';
                        revInput.style.boxShadow = '';
                    }, 3000);
                }
                // Pastikan revenue group visible
                document.getElementById('revenueGroup').style.display = 'block';
                showToast('⚠️ Wajib isi Nilai Revenue / Omset sebelum menyimpan status <strong>' + status + '</strong>!', 'error');
                return; // STOP
            }
        }

        try {
            const res = await fetch(`${API_URL}/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify({ status_followup: status, catatan: finalNotes, revenue, program_id })
            });
            const data = await res.json();
            if (data.success) {
                editOverlay.classList.remove('active');
                fetchDashboardData();
            } else {
                alert('Update gagal: ' + data.message);
            }
        } catch (err) {
            alert('Server error.');
        }
    });
}

// LP PREVIEW SIDEBAR LOGIC
const btnLpPreview = document.getElementById('btnLpPreview');
const lpSidePanel = document.getElementById('lpSidePanel');

if (btnLpPreview) {
    btnLpPreview.addEventListener('click', () => {
        if (!lpSidePanel) return;
        if (lpSidePanel.classList.contains('active')) {
            lpSidePanel.classList.remove('active');
            lpSidePanel.style.width = ''; // clear inline just in case
            document.body.classList.remove('wa-panel-open');
            document.body.style.removeProperty('--wa-panel-width');
            const mainW = document.querySelector('.main-wrapper');
            if (mainW) {
                mainW.style.marginRight = '';
                mainW.style.maxWidth = '';
            }
        } else {
            lpSidePanel.classList.add('active');
            document.body.classList.add('wa-panel-open');
        }
    });
}

document.getElementById('lpPanelClose')?.addEventListener('click', () => {
    if (lpSidePanel) {
        lpSidePanel.classList.remove('active');
        lpSidePanel.style.width = ''; // clear inline just in case
    }
    document.body.classList.remove('wa-panel-open');
    document.body.style.removeProperty('--wa-panel-width');
    const mainW = document.querySelector('.main-wrapper');
    if (mainW) {
        mainW.style.marginRight = '';
        mainW.style.maxWidth = '';
    }
    window.resetLpSidebar();
});

document.getElementById('lpPanelNewTab')?.addEventListener('click', () => {
    const iframe = document.getElementById('lpSideIframe');
    if (iframe && iframe.src) window.open(iframe.src, '_blank');
});

window.loadLpInSidebar = function (path, label) {
    const list = document.getElementById('lpSideList');
    const frame = document.getElementById('lpPhoneFrame');
    const iframe = document.getElementById('lpSideIframe');
    const backBtn = document.getElementById('lpBackToList');
    const titleEl = document.getElementById('lpPanelTitle');

    if (list) list.style.display = 'none';
    if (frame) frame.style.display = 'flex';
    if (backBtn) backBtn.style.display = 'inline-flex';
    if (iframe) iframe.src = path;
    if (titleEl) titleEl.textContent = '— ' + label;

    // Make sure panel is open
    if (lpSidePanel && !lpSidePanel.classList.contains('active')) {
        lpSidePanel.classList.add('active');
        document.body.classList.add('wa-panel-open');
    }
};

window.resetLpSidebar = function () {
    const list = document.getElementById('lpSideList');
    const frame = document.getElementById('lpPhoneFrame');
    const iframe = document.getElementById('lpSideIframe');
    const backBtn = document.getElementById('lpBackToList');
    const titleEl = document.getElementById('lpPanelTitle');

    if (list) list.style.display = 'block';
    if (frame) frame.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    if (iframe) iframe.src = '';
    if (titleEl) titleEl.textContent = '';
};

// Keep openPreviewLp pointing to sidebar for backward compat
window.openPreviewLp = function (path) {
    const names = { '/lp-bakti-anak': 'Bakti Anak', '/lp-itikaf-premium': 'Itikaf Premium', '/lp-liburan': 'Liburan Keluarga', '/lp-liburan-short': 'Liburan Short', '/lp-2-long': 'Long Form LP2' };
    window.loadLpInSidebar(path, names[path] || path);
};

// MANUAL ORDER LOGIC
document.getElementById('btnManualOrder')?.addEventListener('click', async () => {
    await loadProgramsList();
    populateProgramSelects('');
    attachRpFormatter(document.getElementById('moRevenue'));
    document.getElementById('manualOrderOverlay').classList.add('active');
});
document.getElementById('manualOrderClose')?.addEventListener('click', () => {
    document.getElementById('manualOrderOverlay').classList.remove('active');
});

document.getElementById('manualOrderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nama_lengkap: document.getElementById('moNama').value.trim(),
        whatsapp_num: document.getElementById('moWA').value.trim(),
        domisili: document.getElementById('moDomisili').value.trim(),
        yang_berangkat: document.getElementById('moBerangkat').value.trim(),
        paket_pilihan: document.getElementById('moPaket').value.trim(),
        kesiapan_paspor: document.getElementById('moPaspor').value,
        status_followup: document.getElementById('moStatus').value,
        revenue: parseRpInput(document.getElementById('moRevenue').value),
        program_id: document.getElementById('moProgram').value,
        catatan: document.getElementById('moCatatan').value.trim()
    };

    try {
        const res = await fetch(`${API_URL}/leads/manual`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('manualOrderOverlay').classList.remove('active');
            document.getElementById('manualOrderForm').reset();
            fetchDashboardData();
            alert('Order berhasil ditambahkan!');
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Server error.');
    }
});

// UTILS
function formatLpName(lpPath) {
    if (!lpPath || lpPath.trim() === '') return 'Organic';
    // Convert 'lp-bakti-anak' -> 'Bakti Anak', '/lp-itikaf/index.html' -> 'Itikaf'
    let name = lpPath.replace(/^\//, '').replace(/\/index.*\.html$/i, '').replace(/^lp-/, '');
    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || lpPath;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    const hr = String(d.getHours()).padStart(2, '0');
    const mn = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yy} ${hr}:${mn}`;
}

function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return 'Older';
}

// INLINE TABLE LOGIC & ACCORDION
window.toggleAccordion = function (id) {
    const row = document.getElementById('acc-' + id);
    if (row) row.classList.toggle('expanded');
}

// Helper: generate <option> list for package dropdown
function getPkgDropdownOptions(programId, selectedPaket) {
    if (!programId) return '<option value="">— Pilih Paket —</option>';
    const prog = programsListCache.find(x => String(x.id || x.id) === String(programId));
    if (!prog) return '<option value="">— Pilih Paket —</option>';
    const pkgs = (prog.packages || []).filter(x => x.price > 0);
    if (!pkgs.length) return '<option value="">Tidak ada paket tersedia</option>';

    const tierEmoji = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', VIP: '👑', Reguler: '✅', Regular: '✅', Standard: '✅' };
    const roomLabel = { quad: 'Quad (4 orang)', double: 'Double (2 orang)', triple: 'Triple (3 orang)' };
    const isDollar = Math.min(...pkgs.map(x => x.price)) < 100000;

    // Group by tier for optgroup
    const tiers = [...new Set(pkgs.map(p => p.tier))];
    let html = '<option value="">— Pilih Paket —</option>';
    tiers.forEach(tier => {
        const tierPkgs = pkgs.filter(p => p.tier === tier);
        const emoji = tierEmoji[tier] || '📦';
        html += `<optgroup label="${emoji} ${tier}">`;
        tierPkgs.forEach(pkg => {
            const pkgKey = `${pkg.tier} - ${pkg.room_type}`;
            const priceFormatted = isDollar
                ? `$${Number(pkg.price).toLocaleString('en-US')}`
                : `Rp ${Number(pkg.price).toLocaleString('id-ID')}`;
            const label = `${roomLabel[pkg.room_type] || pkg.room_type} — ${priceFormatted}`;
            html += `<option value="${pkgKey}" data-price="${pkg.price}" ${selectedPaket === pkgKey ? 'selected' : ''}>${label}</option>`;
        });
        html += '</optgroup>';
    });
    return html;
}

window.handleProgramChange = function (id) {
    const progSel = document.getElementById('selProg-' + id);
    const summaryDiv = document.getElementById('progSummary-' + id);
    const pkgDropRow = document.getElementById('pkgDropRow-' + id);
    const pkgSel = document.getElementById('selPkg-' + id);

    if (progSel && summaryDiv) {
        // Build fakeL — reset paket_pilihan so nothing is pre-selected
        const fakeL = { id: id, program_id: progSel.value, paket_pilihan: null };
        summaryDiv.innerHTML = progSel.value ? getProgramSummaryHtml(fakeL) : '';

        // Show/hide & populate package dropdown
        if (pkgDropRow && pkgSel) {
            if (progSel.value) {
                pkgSel.innerHTML = getPkgDropdownOptions(progSel.value, null);
                pkgDropRow.style.display = 'flex';
            } else {
                pkgDropRow.style.display = 'none';
                pkgSel.innerHTML = '<option value="">— Pilih Paket —</option>';
            }
        }

        // Reset revenue row if program was cleared
        if (!progSel.value) {
            const selStatus = document.getElementById('selStatus-' + id);
            const revRow = document.getElementById('revRow-' + id);
            if (revRow && selStatus) {
                revRow.style.display = ['DP', 'Order Complete'].includes(selStatus.value) ? 'flex' : 'none';
            }
        }
        markSaveBtn(id);
    }
}

// Called when package dropdown is changed
window.handlePkgDropdownChange = function (leadId) {
    const pkgSel = document.getElementById('selPkg-' + leadId);
    if (!pkgSel) return;
    const selectedOption = pkgSel.options[pkgSel.selectedIndex];
    const price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price')) : 0;
    const pkgKey = pkgSel.value;

    // Auto-fill revenue
    if (price > 0) {
        const revInput = document.getElementById('rev-' + leadId);
        if (revInput) {
            setRpInput(revInput, price);
        }
        const revRow = document.getElementById('revRow-' + leadId);
        if (revRow) revRow.style.display = 'flex';
    }
    markSaveBtn(leadId);
}


function getTierColor(tier) {
    const map = {
        'Platinum': '#A78BFA', 'Gold': '#FBBF24', 'Silver': '#94A3B8',
        'Bronze': '#C47B3A', 'VIP': '#EC4899', 'Reguler': '#34D399',
        'Regular': '#34D399', 'Standard': '#34D399'
    };
    return map[tier] || 'var(--brand)';
}

window.updateLeadStatus = async function (id) {
    const status = document.getElementById('selStatus-' + id).value;
    const notesInput = document.getElementById('note-' + id);
    let notes = notesInput.value.trim();
    const revInput = document.getElementById('rev-' + id);
    const revenue = revInput ? parseRpInput(revInput.value) : undefined;

    // VALIDASI: DP / Order Complete WAJIB ada Revenue
    if (['DP', 'Order Complete'].includes(status)) {
        const revVal = revenue || 0;
        if (revVal <= 0) {
            // Highlight input
            if (revInput) {
                revInput.style.borderColor = 'var(--danger)';
                revInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.25)';
                revInput.focus();
                setTimeout(() => {
                    revInput.style.borderColor = '';
                    revInput.style.boxShadow = '';
                }, 3000);
            }
            // Pastikan revRow terlihat
            const revRow = document.getElementById('revRow-' + id);
            if (revRow) revRow.style.display = 'flex';

            showToast('⚠️ Wajib isi Nilai Revenue / Omset sebelum menyimpan status <strong>' + status + '</strong>!', 'error');
            return; // STOP — tidak jadi save
        }
    }

    if (status === 'Lost') {
        const reasonDrop = document.getElementById('selLostReason-' + id);
        const reason = reasonDrop ? reasonDrop.value : '';
        if (reason && !notes.includes('[Lost:')) {
            notes = `[Lost: ${reason}] ` + notes;
        }
    }

    // Optional: show loading state on button
    const btn = document.getElementById('saveBtn-' + id);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    try {
        const payload = { status_followup: status };
        if (notes) payload.catatan = notes;
        if (revenue !== undefined) payload.revenue = revenue;
        const progSel = document.getElementById('selProg-' + id);
        if (progSel && progSel.value !== undefined) payload.program_id = progSel.value;
        const pkgSel = document.getElementById('selPkg-' + id);
        if (pkgSel && pkgSel.value) payload.paket_pilihan = pkgSel.value;

        const res = await fetch(`${API_URL}/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            notesInput.value = '';

            // UI Feedback: Button turns green
            if (btn) {
                btn.style.background = '#16a34a';
                btn.style.borderColor = '#16a34a';
                btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
                btn.dataset.saved = 'true';
            }

            // Auto-close accordion after short delay, then silently refresh dashboard data
            setTimeout(() => {
                const accRow = document.getElementById('acc-' + id);
                if (accRow) {
                    accRow.classList.remove('expanded');
                }
                fetchDashboardData();
            }, 800);

        } else {
            alert('Update gagal: ' + data.message);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-save"></i> Save';
            }
        }
    } catch (err) {
        alert('Server error saving data.');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> Save';
        }
    }
}


window.sendWAtpl = function (leadStr, type) {
    const L = JSON.parse(decodeURIComponent(leadStr));
    let clean = L.whatsapp_num.replace(/[^\d]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);

    activeWhatsApp = clean; // store for WA Editor Modal

    const linkInput = document.getElementById('waLink-' + L.id).value.trim();
    const prefixInput = document.getElementById('userPrefix-' + L.id);
    const userPrefix = (prefixInput && prefixInput.value) ? prefixInput.value : 'Bapak/Ibu';
    let attachmentText = linkInput ? `\n\n${userPrefix} juga bisa melihat brosur/informasi lebih lengkap melalui tautan Drive berikut:\n${linkInput}` : '';

    const csNameInput = document.getElementById('csName-' + L.id);
    const myName = (csNameInput && csNameInput.value.trim() !== '') ? csNameInput.value.trim() : 'Konsultan Munira World';

    const progSel = document.getElementById('selProg-' + L.id);
    let progName = 'Program Umrah';
    if (progSel && progSel.value) {
        progName = progSel.options[progSel.selectedIndex].text;
    } else if (L.program_id) {
        progName = getProgramName(L.program_id) || 'Program Umrah';
    }

    const pkgSel = document.getElementById('selPkg-' + L.id);
    let pkgValue = '';
    if (pkgSel && pkgSel.value) {
        pkgValue = pkgSel.value;
    } else if (L.paket_pilihan) {
        pkgValue = L.paket_pilihan;
    }

    const pkgDetail = pkgValue ? `(Paket ${pkgValue})` : '';
    const ketertarikanDetail = `${progName} ${pkgDetail}`.trim();

    let template = '';
    if (type === 1) {
        template = `Assalamu'alaikum ${userPrefix} ${L.nama_lengkap || ''}, perkenalkan saya ${myName}. Terkait ketertarikan Anda pada ${ketertarikanDetail}, apakah ada informasi brosur atau jadwal yang bisa kami kirimkan?`;
    } else if (type === 2) {
        template = `Assalamu'alaikum ${userPrefix} ${L.nama_lengkap || ''}, perkenalkan saya ${myName}. Terkait pendaftaran ${ketertarikanDetail} dan kesiapan ${L.kesiapan_paspor === 'Belum ada' ? 'pembuatan paspor baru' : 'paspor Anda'}, tim kami siap membantu mendampingi. Apakah ada waktu luang untuk berdiskusi?`;
    } else if (type === 3) {
        template = `Assalamu'alaikum ${userPrefix} ${L.nama_lengkap || ''}, saya ${myName}. Sekadar menyapa dan mengingatkan untuk rencana ibadahnya di ${ketertarikanDetail}. Kuota kami bulan ini semakin terbatas, kabari kami bila berminat untuk lock seat ya.`;
    }

    const txt = template + attachmentText;

    // Instead of sending immediately, preview it via WA Modal
    waText.value = txt;
    waOverlay.classList.add('active');
}

// ============================================================
// SAVE BUTTON PINK/GREEN LOGIC (Lead Detail)
// ============================================================
window.markSaveBtn = function (leadId) {
    const btn = document.getElementById('saveBtn-' + leadId);
    if (!btn || btn.dataset.saved === 'true') return;
    btn.style.background = '#EC4899';
    btn.style.borderColor = '#EC4899';
};

// Status select change also should mark pink
document.addEventListener('change', function (e) {
    if (e.target && e.target.matches('[id^="status-"]')) {
        const leadId = e.target.id.replace('status-', '');
        window.markSaveBtn(leadId);
    }
});

// Removed old wrapper for updateLeadStatus

// ============================================================
// SMART COPY (Khusus Super Admin)
// ============================================================
var smartCopyActiveLead = null;

window.openSmartCopyModal = function (leadStr) {
    if (currentUserData?.role !== 'super_admin') {
        alert('Fitur ini eksklusif hanya untuk Role Super Admin.');
        return;
    }
    smartCopyActiveLead = JSON.parse(decodeURIComponent(leadStr));
    document.getElementById('smartCopyOverlay').classList.add('active');
};

document.getElementById('smartCopyClose')?.addEventListener('click', () => {
    document.getElementById('smartCopyOverlay').classList.remove('active');
    smartCopyActiveLead = null;
});

window.doSmartCopy = function (format) {
    if (!smartCopyActiveLead) return;
    const L = smartCopyActiveLead;
    let textToCopy = '';

    if (format === 'name') {
        textToCopy = L.nama_lengkap || '-';
    } else if (format === 'full') {
        const pkgName = L.paket_pilihan || 'N/A';
        const pName = L.program_id ? getProgramName(L.program_id) : '-';
        textToCopy = `Nama: ${L.nama_lengkap || '-'}\nWA: ${L.whatsapp_num}\nProgram: ${pName}\nPaket: ${pkgName} (${L.yang_berangkat || '1 Pax'})\nAlamat/Domisili: ${L.domisili || '-'}\nJam Isi: ${formatDate(L.created_at)}\nStatus: ${L.status_followup}`;
    }

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Data berhasil disalin!');
            document.getElementById('smartCopyOverlay').classList.remove('active');
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            prompt("Gagal auto-copy, silakan salin teks di bawah ini:", textToCopy);
        });
    }
};

// ============================================================
// SET DEFAULT LP
// ============================================================
window.setDefaultLP = async function (folderEncoded) {
    const folder = decodeURIComponent(folderEncoded);
    if (!confirm(`Jadikan "${folder}" sebagai Landing Page default?`)) return;
    try {
        const res = await fetch(`${API_URL}/pages/${encodeURIComponent(folder)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ is_default: true })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`LP "${folder}" dijadikan Default ⭐`);
            fetchPages();
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (e) { alert('Server error.'); }
};

// ============================================================
// FORM BUILDER MODULE
// ============================================================
var formsList = [];
var formEditId = null;
var fbFields = [];
var fbWARotator = [];

var pagesListForForm = []; // cache pages for form builder display

async function fetchFormBuilder() {
    try {
        const [formsRes, pagesRes] = await Promise.all([
            fetch(`${API_URL}/forms`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
            fetch(`${API_URL}/pages`, { headers: { 'Authorization': `Bearer ${authToken}` } })
        ]);
        const formsData = await formsRes.json();
        const pagesData = await pagesRes.json();
        formsList = formsData.data || [];
        pagesListForForm = pagesData.data || [];
        renderFormBuilderList();
    } catch (e) { console.error('Error fetching forms:', e); }
}

function renderFormBuilderList() {
    const container = document.getElementById('formBuilderList');
    const empty = document.getElementById('formBuilderEmpty');
    if (!container) return;
    if (!formsList.length) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    // Build map: formId -> linked LP folders
    const formToLps = {};
    pagesListForForm.forEach(pg => {
        if (pg.linked_form_id) {
            if (!formToLps[pg.linked_form_id]) formToLps[pg.linked_form_id] = [];
            formToLps[pg.linked_form_id].push(pg.folder || pg.id);
        }
    });

    container.innerHTML = formsList.map(f => {
        const fieldCount = f.fields ? f.fields.length : 0;
        const isShort = fieldCount <= 3;
        const formTypeBadge = isShort
            ? `<span style="font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px; background:rgba(34,211,238,0.15); color:#22D3EE; margin-left:6px; letter-spacing:0.5px;">⚡ Short Form</span>`
            : `<span style="font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px; background:rgba(139,92,246,0.15); color:#8B5CF6; margin-left:6px; letter-spacing:0.5px;">📋 Long Form</span>`;

        const linkedLps = formToLps[f.id] || [];
        const lpBadges = linkedLps.length
            ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:10px;">
                <span style="font-size:0.62rem; color:var(--text-secondary);">🔗 LP:</span>
                ${linkedLps.map(lp => `<span style="font-size:0.62rem; padding:2px 8px; border-radius:50px; background:rgba(251,191,36,0.1); color:#FBBF24; border:1px solid rgba(251,191,36,0.2);">${lp}</span>`).join('')}
               </div>`
            : `<div style="font-size:0.62rem; color:var(--text-secondary); margin-bottom:10px; opacity:0.6;">⚪ Belum dikaitkan ke LP</div>`;

        return `
        <div style="background:var(--bg-surface); border:1px solid ${f.is_active ? 'var(--border)' : 'rgba(100,116,139,0.3)'}; border-radius:var(--radius-lg); padding:20px; transition:all 0.2s; opacity:${f.is_active ? '1' : '0.6'};"
             onmouseenter="this.style.borderColor='#8B5CF6'; this.style.transform='translateY(-2px)'"
             onmouseleave="this.style.borderColor='${f.is_active ? 'var(--border)' : 'rgba(100,116,139,0.3)'}'; this.style.transform='none'">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin-bottom:4px;">
                        <span style="font-weight:700; font-size:1rem;">${f.name}</span>
                        ${formTypeBadge}
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${fieldCount} field • ${f.wa_rotator ? f.wa_rotator.length : 0} nomor WA</div>
                </div>
                <span style="font-size:0.65rem; font-weight:700; padding:2px 10px; border-radius:50px; background:${f.is_active ? 'rgba(22,163,74,0.15)' : 'rgba(100,116,139,0.15)'}; color:${f.is_active ? '#16a34a' : '#64748b'}; flex-shrink:0; margin-left:8px;">${f.is_active ? 'Aktif' : 'Nonaktif'}</span>
            </div>
            ${lpBadges}
            ${f.success_message ? `<div style="font-size:0.75rem; color:var(--text-secondary); background:rgba(16,185,129,0.07); border-left:2px solid #10B981; padding:6px 10px; border-radius:0 4px 4px 0; margin-bottom:12px; line-height:1.4;">"${f.success_message.substring(0, 80)}${f.success_message.length > 80 ? '...' : ''}"</div>` : ''}
            ${f.wa_rotator && f.wa_rotator.length ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px;">
                ${f.wa_rotator.map(w => `<span style="font-size:0.65rem; padding:2px 8px; border-radius:50px; background:rgba(37,211,102,0.1); color:#25D366; border:1px solid rgba(37,211,102,0.2);"><i class="fab fa-whatsapp"></i> ${w.name || w.wa_number}</span>`).join('')}
            </div>` : ''}
            <div style="display:flex; gap:8px;">
                <button class="btn btn-outline btn-mini" style="flex:1;" onclick="openFormModal('${f.id}')"><i class="fas fa-pen" style="font-size:0.7rem;"></i> Edit</button>
                <button class="btn btn-mini" style="color:var(--danger);" onclick="deleteForm('${f.id}', '${(f.name || '').replace(/'/g, '')}')"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>
            </div>
        </div>
    `}).join('');
}

function renderFbFields() {
    const container = document.getElementById('fbFieldsContainer');
    const empty = document.getElementById('fbFieldsEmpty');
    if (!container) return;
    if (!fbFields.length) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';
    container.innerHTML = fbFields.map((f, idx) => `
        <div style="background:var(--bg-app); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px 14px; display:grid; grid-template-columns:auto 1fr 1fr auto; gap:8px; align-items:center;">
            <span style="color:var(--text-secondary);">⠿</span>
            <select class="select-base" onchange="fbFieldUpdate(${idx},'type',this.value)" style="font-size:0.8rem; padding:4px;">
                ${['text', 'tel', 'email', 'select', 'textarea', 'radio', 'checkbox'].map(t => `<option value="${t}" ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
            <input type="text" value="${f.label || ''}" placeholder="Label field..." class="select-base" style="font-size:0.8rem; padding:4px;" oninput="fbFieldUpdate(${idx},'label',this.value)">
            <button onclick="fbRemoveField(${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:1rem; padding:0;">✕</button>
            ${['select', 'radio'].includes(f.type) ? `
            <span></span>
            <div style="grid-column:2/-1;">
                <input type="text" value="${(f.options || []).join(', ')}" placeholder="Opsi dipisah koma: Pria, Wanita" class="select-base" style="width:100%; font-size:0.78rem; padding:4px;"
                    oninput="fbFieldUpdate(${idx},'options',this.value.split(',').map(s=>s.trim()))">
            </div>` : ''}
            <span></span>
            <label style="grid-column:2/-1; font-size:0.75rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
                <input type="checkbox" ${f.required ? 'checked' : ''} onchange="fbFieldUpdate(${idx},'required',this.checked)"> Wajib diisi
            </label>
        </div>
    `).join('');
}

window.fbFieldUpdate = function (idx, key, val) { fbFields[idx][key] = val; };
window.fbRemoveField = function (idx) { fbFields.splice(idx, 1); renderFbFields(); };

function renderFbWA() {
    const container = document.getElementById('fbWAContainer');
    const empty = document.getElementById('fbWAEmpty');
    if (!container) return;
    if (!fbWARotator.length) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';
    container.innerHTML = fbWARotator.map((w, idx) => `
        <div style="display:grid; grid-template-columns:1fr 1fr 80px auto; gap:8px; align-items:center; background:var(--bg-app); border:1px solid rgba(236,72,153,0.2); border-radius:var(--radius-md); padding:10px 12px;">
            <input type="text" value="${w.name || ''}" placeholder="Nama CS..." class="select-base" style="font-size:0.8rem; padding:4px;" oninput="fbWAUpdate(${idx},'name',this.value)">
            <input type="text" value="${w.wa_number || ''}" placeholder="628xxx..." class="select-base" style="font-size:0.8rem; padding:4px;" oninput="fbWAUpdate(${idx},'wa_number',this.value)">
            <div style="display:flex; align-items:center; gap:4px; font-size:0.75rem;">
                <label style="white-space:nowrap;">Bobot:</label>
                <input type="number" value="${w.weight || 1}" min="1" max="10" class="select-base" style="width:46px; font-size:0.8rem; padding:4px;" oninput="fbWAUpdate(${idx},'weight',+this.value)">
            </div>
            <div style="display:flex; gap:6px; align-items:center; justify-content:flex-end;">
                <label style="font-size:0.72rem; display:flex; gap:4px; align-items:center; cursor:pointer; white-space:nowrap;">
                    <input type="checkbox" ${w.is_active !== false ? 'checked' : ''} onchange="fbWAUpdate(${idx},'is_active',this.checked)" style="accent-color:#25D366;"> Aktif
                </label>
                <button onclick="fbRemoveWA(${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer; padding:0;">✕</button>
            </div>
        </div>
    `).join('');
}

window.fbWAUpdate = function (idx, key, val) { fbWARotator[idx][key] = val; };
window.fbRemoveWA = function (idx) { fbWARotator.splice(idx, 1); renderFbWA(); };

window.openFormModal = async function (editId = null) {
    formEditId = editId;
    fbFields = [];
    fbWARotator = [];

    const overlay = document.getElementById('formBuilderOverlay');
    const title = document.getElementById('formBuilderModalTitle');
    document.getElementById('formBuilderForm').reset();
    document.getElementById('fbId').value = '';

    if (editId) {
        title.innerHTML = '<i class="fas fa-wpforms" style="color:#8B5CF6; margin-right:8px;"></i>Edit Form';
        const form = formsList.find(f => f.id === editId);
        if (form) {
            document.getElementById('fbName').value = form.name || '';
            document.getElementById('fbActive').value = form.is_active !== false ? 'true' : 'false';
            document.getElementById('fbSuccessMessage').value = form.success_message || '';
            document.getElementById('fbSuccessRedirect').value = form.success_redirect_url || '';
            document.getElementById('fbRotatorMode').value = form.rotator_mode || 'round_robin';
            fbFields = JSON.parse(JSON.stringify(form.fields || []));
            fbWARotator = JSON.parse(JSON.stringify(form.wa_rotator || []));
        }
    } else {
        title.innerHTML = '<i class="fas fa-wpforms" style="color:#8B5CF6; margin-right:8px;"></i>Buat Form Baru';
    }

    renderFbFields();
    renderFbWA();
    overlay.classList.add('active');
};

window.closeFormModal = function () {
    document.getElementById('formBuilderOverlay').classList.remove('active');
    formEditId = null;
};

document.getElementById('formBuilderClose')?.addEventListener('click', closeFormModal);
document.getElementById('fbCancelBtn')?.addEventListener('click', closeFormModal);
document.getElementById('formBuilderOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeFormModal();
});

document.getElementById('fbAddField')?.addEventListener('click', () => {
    fbFields.push({ type: 'text', label: '', name: 'field_' + Date.now(), required: false, options: [] });
    renderFbFields();
});

document.getElementById('fbAddWA')?.addEventListener('click', () => {
    fbWARotator.push({ name: '', wa_number: '', is_active: true, weight: 1 });
    renderFbWA();
});

document.getElementById('formBuilderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('fbName').value.trim(),
        is_active: document.getElementById('fbActive').value === 'true',
        success_message: document.getElementById('fbSuccessMessage').value.trim() || 'Terima kasih! Tim kami akan segera menghubungi Anda.',
        success_redirect_url: document.getElementById('fbSuccessRedirect').value.trim(),
        rotator_mode: document.getElementById('fbRotatorMode').value,
        fields: fbFields.map((f, i) => ({ ...f, name: f.name || ('field_' + i), order: i })),
        wa_rotator: fbWARotator,
    };

    if (!payload.name) { alert('Nama form wajib diisi'); return; }

    const submitBtn = document.querySelector('#formBuilderForm [type=submit]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
        const url = formEditId ? `${API_URL}/forms/${formEditId}` : `${API_URL}/forms`;
        const method = formEditId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            closeFormModal();
            fetchFormBuilder();
            showToast(formEditId ? 'Form diperbarui ✅' : 'Form baru dibuat ✅');
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Server error.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Form';
    }
});

document.getElementById('btnCreateForm')?.addEventListener('click', () => openFormModal(null));

window.deleteForm = async function (id, name) {
    if (!confirm(`Hapus form "${name}"? LP yang terhubung akan kehilangan formnya.`)) return;
    try {
        const res = await fetch(`${API_URL}/forms/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
            showToast('Form dihapus');
            fetchFormBuilder();
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (e) { alert('Server error.'); }
};

// ============================================================
// FORM BUILDER TAB SWITCHING + LP PREVIEW
// ============================================================

window.formBuilderTab = function (tab) {
    const listPanel = document.getElementById('fbPanelList');
    const previewPanel = document.getElementById('fbPanelPreview');
    const tabList = document.getElementById('fbTabList');
    const tabPreview = document.getElementById('fbTabPreview');
    if (!listPanel || !previewPanel) return;

    if (tab === 'preview') {
        listPanel.style.display = 'none';
        previewPanel.style.display = 'block';
        if (tabList) { tabList.style.color = ''; tabList.style.borderColor = ''; }
        if (tabPreview) { tabPreview.style.color = '#8B5CF6'; tabPreview.style.borderColor = '#8B5CF6'; }
        refreshFormPreviewPanel();
    } else {
        previewPanel.style.display = 'none';
        listPanel.style.display = 'block';
        if (tabList) { tabList.style.color = '#8B5CF6'; tabList.style.borderColor = '#8B5CF6'; }
        if (tabPreview) { tabPreview.style.color = ''; tabPreview.style.borderColor = ''; }
    }
};

async function refreshFormPreviewPanel() {
    // Fetch forms and pages to populate LP integration status
    try {
        const [formsRes, pagesRes] = await Promise.all([
            fetch(`${API_URL}/forms`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
            fetch(`${API_URL}/pages`, { headers: { 'Authorization': `Bearer ${authToken}` } })
        ]);
        const formsData = await formsRes.json();
        const pagesData = await pagesRes.json();

        const forms = formsData.data || [];
        const pages = pagesData.data || [];

        // Populate dropdowns for LP form link selectors
        const shortSel = document.getElementById('lp2ShortFormSelect');
        const longSel = document.getElementById('lp2LongFormSelect');

        [shortSel, longSel].forEach(sel => {
            if (!sel) return;
            const cur = sel.value;
            sel.innerHTML = '<option value="">— Pilih form —</option>';
            forms.forEach(f => {
                const fieldCount = f.fields ? f.fields.length : 0;
                const type = fieldCount <= 3 ? '⚡ Short' : '📋 Long';
                const opt = document.createElement('option');
                opt.value = f.id;
                opt.textContent = `${type} · ${f.name}`;
                sel.appendChild(opt);
            });
            if (cur) sel.value = cur;
        });

        // Find LP pages
        const lpShort = pages.find(p => (p.folder || '').includes('lp-liburan-short'));
        const lpLong = pages.find(p => (p.folder || '').includes('lp-2-long'));

        // Update short LP status
        const lpShortStatus = document.getElementById('lp2ShortStatus');
        const shortFormLpName = document.getElementById('shortFormLpName');
        const shortFormInjectId = document.getElementById('shortFormInjectId');
        if (lpShort) {
            if (lpShort.linked_form_id) {
                const linkedForm = forms.find(f => f.id === lpShort.linked_form_id);
                if (lpShortStatus) { lpShortStatus.textContent = '✅ Terhubung'; lpShortStatus.style.background = 'rgba(22,163,74,0.15)'; lpShortStatus.style.color = '#16a34a'; }
                if (shortFormLpName) shortFormLpName.textContent = linkedForm ? linkedForm.name : lpShort.linked_form_id;
                if (shortFormInjectId) shortFormInjectId.textContent = lpShort.linked_form_id.substring(0, 16) + '...';
                if (shortSel) shortSel.value = lpShort.linked_form_id;
            } else {
                if (lpShortStatus) { lpShortStatus.textContent = '⚪ Belum terhubung'; lpShortStatus.style.background = 'rgba(100,116,139,0.15)'; lpShortStatus.style.color = '#64748b'; }
                if (shortFormLpName) shortFormLpName.textContent = 'Belum ada';
                if (shortFormInjectId) shortFormInjectId.textContent = '(belum diset)';
            }
        } else {
            if (lpShortStatus) { lpShortStatus.textContent = '❓ LP tidak ditemukan'; lpShortStatus.style.background = 'rgba(239,68,68,0.15)'; lpShortStatus.style.color = '#ef4444'; }
        }

        // Update long LP status
        const lpLongStatus = document.getElementById('lp2LongStatus');
        const longFormLpName = document.getElementById('longFormLpName');
        const longFormInjectId = document.getElementById('longFormInjectId');
        if (lpLong) {
            if (lpLong.linked_form_id) {
                const linkedForm = forms.find(f => f.id === lpLong.linked_form_id);
                if (lpLongStatus) { lpLongStatus.textContent = '✅ Terhubung'; lpLongStatus.style.background = 'rgba(22,163,74,0.15)'; lpLongStatus.style.color = '#16a34a'; }
                if (longFormLpName) longFormLpName.textContent = linkedForm ? linkedForm.name : lpLong.linked_form_id;
                if (longFormInjectId) longFormInjectId.textContent = lpLong.linked_form_id.substring(0, 16) + '...';
                if (longSel) longSel.value = lpLong.linked_form_id;
            } else {
                if (lpLongStatus) { lpLongStatus.textContent = '⚪ Belum terhubung'; lpLongStatus.style.background = 'rgba(100,116,139,0.15)'; lpLongStatus.style.color = '#64748b'; }
                if (longFormLpName) longFormLpName.textContent = 'Belum ada';
                if (longFormInjectId) longFormInjectId.textContent = '(belum diset)';
            }
        } else {
            if (lpLongStatus) { lpLongStatus.textContent = '❓ LP tidak ditemukan'; lpLongStatus.style.background = 'rgba(239,68,68,0.15)'; lpLongStatus.style.color = '#ef4444'; }
        }
    } catch (e) {
        console.error('refreshFormPreviewPanel error:', e);
    }
}

// Update the linked_form_id for a given LP page folder
window.updateLpFormLink = async function (folder, formId) {
    try {
        const res = await fetch(`${API_URL}/pages/${encodeURIComponent(folder)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ linked_form_id: formId || null })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Form berhasil dikaitkan ke LP "${folder}" ✅`);
            refreshFormPreviewPanel();
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (e) {
        alert('Server error saat mengkaitkan form.');
    }
};

window.copyInjectCode = function () {
    const pre = document.getElementById('injectCodeSnippet');
    if (!pre) return;
    const text = pre.innerText || pre.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Kode inject disalin! 📋');
    }).catch(() => {
        prompt('Salin kode ini:', text);
    });
};


async function fetchDistribution() {
    const container = document.getElementById('distributionList');
    const empty = document.getElementById('distributionEmpty');
    if (!container) return;

    try {
        const res = await fetch(`${API_URL}/forms`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        const forms = (data.data || []).filter(f => f.wa_rotator && f.wa_rotator.length > 0);

        if (!forms.length) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }
        if (empty) empty.style.display = 'none';

        const modeLabel = { round_robin: '🔄 Round Robin', weighted: '⚖️ Weighted', random: '🎲 Random' };

        container.innerHTML = forms.map(f => `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden;">
                <div style="padding:16px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:700; font-size:1rem;">${f.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${modeLabel[f.rotator_mode] || f.rotator_mode} • ${f.wa_rotator.filter(w => w.is_active).length} nomor aktif dari ${f.wa_rotator.length} total</div>
                    </div>
                    <button class="btn btn-outline btn-mini" onclick="openFormModal('${f.id}')"><i class="fas fa-edit"></i> Edit Rotator</button>
                </div>
                <div style="padding:16px 20px;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:12px;">
                        ${f.wa_rotator.map((w, i) => `
                            <div style="display:flex; align-items:center; gap:12px; padding:12px 14px; background:${w.is_active ? 'rgba(37,211,102,0.06)' : 'var(--bg-app)'}; border:1px solid ${w.is_active ? 'rgba(37,211,102,0.2)' : 'var(--border)'}; border-radius:var(--radius-md); opacity:${w.is_active ? '1' : '0.5'};">
                                <div style="width:36px; height:36px; border-radius:10px; background:${w.is_active ? 'rgba(37,211,102,0.15)' : 'var(--bg-surface)'}; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0;">${w.is_active ? '✅' : '❌'}</div>
                                <div style="flex:1; min-width:0;">
                                    <div style="font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${w.name || 'CS ' + (i + 1)}</div>
                                    <div style="font-size:0.75rem; color:var(--text-secondary);">${w.wa_number}</div>
                                    ${f.rotator_mode === 'weighted' ? `<div style="font-size:0.7rem; color:#8B5CF6;">Bobot: ${w.weight || 1}</div>` : ''}
                                </div>
                                <a href="javascript:void(0)" onclick="window.openWaPanel('${(w.wa_number || '').replace(/[^0-9]/g, '')}')" title="Chat via WhatsApp"
                                   style="width:28px; height:28px; background:rgba(37,211,102,0.15); color:#25D366; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none;">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error fetching distribution:', e);
        if (container) container.innerHTML = `<div style="text-align:center; padding:32px; color:var(--danger);">Gagal memuat data distribusi.</div>`;
    }
}

// ============================================================
// COLUMN SETTINGS (Dynamic Layout)
// ============================================================
document.getElementById('btnColSettings')?.addEventListener('click', () => {
    document.getElementById('columnOverlay').classList.add('active');
});
document.getElementById('columnClose')?.addEventListener('click', () => {
    document.getElementById('columnOverlay').classList.remove('active');
});

function applyColumnSettings() {
    let saved = localStorage.getItem('munira_crm_cols');
    if (!saved) return;
    try {
        const hiddenCols = JSON.parse(saved); // array of hidden class indices (1-indexed) e.g., [1, 2, 8]
        let styleStr = '';
        hiddenCols.forEach(idx => {
            styleStr += `table#leadsMainTable th:nth-child(${idx}), table#leadsMainTable td:nth-child(${idx}) { display: none !important; }\n`;
        });

        let styleTag = document.getElementById('dynamicColStyle');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamicColStyle';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = styleStr;

        // Sync UI toggles
        document.querySelectorAll('#columnSettingsChecks input[type="checkbox"]').forEach(chk => {
            if (hiddenCols.includes(parseInt(chk.value))) {
                chk.checked = false; // it is hidden
            } else {
                chk.checked = true;
            }
        });
    } catch (e) { }
}

window.saveColumnSettings = function () {
    const hiddenCols = [];
    document.querySelectorAll('#columnSettingsChecks input[type="checkbox"]').forEach(chk => {
        if (!chk.checked) hiddenCols.push(parseInt(chk.value));
    });
    localStorage.setItem('munira_crm_cols', JSON.stringify(hiddenCols));
    applyColumnSettings();
    document.getElementById('columnOverlay').classList.remove('active');
};

document.addEventListener('DOMContentLoaded', () => {
    applyColumnSettings();
});
