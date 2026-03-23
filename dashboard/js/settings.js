// ==================== SETTINGS JS ====================
// Tab Management + CAPI Config + Analytics + Display

// ---- Tab switching ----
window.switchSettingsTab = function (tab) {
    // Hide all panels
    document.querySelectorAll('.settings-panel').forEach(function (p) { p.style.display = 'none'; });
    // Deactivate all tabs
    document.querySelectorAll('.settings-tab').forEach(function (t) {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'var(--text-secondary)';
    });

    // Show selected
    var panelMap = { capi: 'panelCapi', analytics: 'panelAnalytics', display: 'panelDisplay' };
    var tabMap = { capi: 'tabCapi', analytics: 'tabAnalytics', display: 'tabDisplay' };
    var panel = document.getElementById(panelMap[tab]);
    var tabBtn = document.getElementById(tabMap[tab]);
    if (panel) panel.style.display = 'block';
    if (tabBtn) {
        tabBtn.classList.add('active');
        tabBtn.style.borderBottomColor = 'var(--brand)';
        tabBtn.style.color = 'var(--text-primary)';
    }
};
// Init first tab active style
(function () {
    var t = document.getElementById('tabCapi');
    if (t) { t.style.borderBottomColor = 'var(--brand)'; t.style.color = 'var(--text-primary)'; }
})();

// ---- CAPI Token Visibility ----
window.toggleCapiTokenVisibility = function () {
    var inp = document.getElementById('mCapiToken');
    var eye = document.getElementById('capiTokenEye');
    if (!inp) return;
    if (inp.type === 'password') {
        inp.type = 'text';
        if (eye) { eye.classList.remove('fa-eye'); eye.classList.add('fa-eye-slash'); }
    } else {
        inp.type = 'password';
        if (eye) { eye.classList.remove('fa-eye-slash'); eye.classList.add('fa-eye'); }
    }
};

// ---- Update CAPI Status Banner ----
function updateCapiStatus() {
    var pixelId = (document.getElementById('mFbPixel')?.value || '').trim();
    var token = (document.getElementById('mCapiToken')?.value || '').trim();
    var banner = document.getElementById('capiStatusBanner');
    var icon = document.getElementById('capiStatusIcon');
    var title = document.getElementById('capiStatusTitle');
    var desc = document.getElementById('capiStatusDesc');
    if (!banner) return;

    if (pixelId && token) {
        banner.style.background = 'rgba(16,185,129,0.1)';
        banner.style.borderColor = 'rgba(16,185,129,0.3)';
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#10B981';
        title.textContent = 'CAPI Aktif';
        desc.textContent = 'Server-side tracking terkonfigurasi. Lead events akan dikirim ke Meta secara langsung.';
    } else if (pixelId || token) {
        banner.style.background = 'rgba(245,158,11,0.1)';
        banner.style.borderColor = 'rgba(245,158,11,0.3)';
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#F59E0B';
        title.textContent = 'Konfigurasi Tidak Lengkap';
        desc.textContent = pixelId ? 'Access Token belum diisi.' : 'Pixel ID belum diisi.';
    } else {
        banner.style.background = 'rgba(239,68,68,0.1)';
        banner.style.borderColor = 'rgba(239,68,68,0.2)';
        icon.className = 'fas fa-exclamation-triangle';
        icon.style.color = '#EF4444';
        title.textContent = 'CAPI Belum Dikonfigurasi';
        desc.textContent = 'Isi Pixel ID dan Access Token untuk mengaktifkan server-side tracking.';
    }
}

// Listen for input changes to update status
['mFbPixel', 'mCapiToken'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCapiStatus);
});

// ---- Test CAPI Connection ----
window.testCapiConnection = async function () {
    var resultEl = document.getElementById('capiTestResult');
    if (resultEl) resultEl.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:4px;"></i> Menguji koneksi...';

    try {
        var res = await fetch(API_URL + '/track/meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_name: 'Lead',
                event_time: Math.floor(Date.now() / 1000),
                event_id: 'test_' + Date.now(),
                event_source_url: window.location.href,
                user_data: { phone: '0000000000' },
                custom_data: { lead_name: 'Test CAPI Connection', form_source: 'dashboard-test' }
            })
        });
        var data = await res.json();

        if (data.success && !data.skipped) {
            resultEl.innerHTML = '<i class="fas fa-check-circle" style="color:#10B981; margin-right:4px;"></i> Koneksi berhasil! Event terkirim.';
        } else if (data.skipped) {
            resultEl.innerHTML = '<i class="fas fa-info-circle" style="color:#F59E0B; margin-right:4px;"></i> CAPI belum dikonfigurasi di server (.env).';
        } else {
            resultEl.innerHTML = '<i class="fas fa-times-circle" style="color:#EF4444; margin-right:4px;"></i> Gagal: ' + (data.error || 'Unknown error');
        }
    } catch (e) {
        resultEl.innerHTML = '<i class="fas fa-times-circle" style="color:#EF4444; margin-right:4px;"></i> Server error.';
    }
};

// ---- Fetch settings from backend ----
var marketingForm = document.getElementById('marketingForm');

async function fetchSettings() {
    try {
        var res = await fetch(API_URL + '/settings/admin', { headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (data.success && data.data) {
            var d = data.data;
            document.getElementById('mFbPixel').value = d.meta_pixel_id || '';
            document.getElementById('mGa4').value = d.ga4_id || '';
            document.getElementById('mTgToken').value = d.tg_bot_token || '';
            document.getElementById('mTgChat').value = d.tg_chat_id || '';

            // CAPI fields
            if (document.getElementById('mCapiToken')) {
                document.getElementById('mCapiToken').value = d.capi_access_token || '';
            }
            if (document.getElementById('mCapiTestCode')) {
                document.getElementById('mCapiTestCode').value = d.capi_test_code || '';
            }
            if (document.getElementById('mGtm')) {
                document.getElementById('mGtm').value = d.gtm_id || '';
            }

            // Highlight settings
            window.uiHighlightColor = d.ui_highlight_color || '#16A34A';
            window.uiHighlightStyle = d.ui_highlight_style || 'solid';
            window.uiHighlightCount = d.ui_highlight_count || 5;

            if (document.getElementById('mUiHighlightColor')) {
                document.getElementById('mUiHighlightColor').value = window.uiHighlightColor;
                document.getElementById('mUiHighlightColorText').value = window.uiHighlightColor;
                document.getElementById('mUiHighlightStyle').value = window.uiHighlightStyle;
                document.getElementById('mUiHighlightCount').value = window.uiHighlightCount;
            }

            if (currentUserData && currentUserData.role === 'super_admin') {
                var sAdminPanel = document.getElementById('superAdminSettings');
                if (sAdminPanel) sAdminPanel.style.display = 'block';
            }

            // Update CAPI status banner
            updateCapiStatus();
        }
    } catch (e) { console.error('Settings error:', e); }
}

// ---- Save settings ----
if (marketingForm) {
    marketingForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var payload = {
            meta_pixel_id: document.getElementById('mFbPixel').value,
            ga4_id: document.getElementById('mGa4').value,
            tg_bot_token: document.getElementById('mTgToken').value,
            tg_chat_id: document.getElementById('mTgChat').value,
            capi_access_token: (document.getElementById('mCapiToken') || {}).value || '',
            capi_test_code: (document.getElementById('mCapiTestCode') || {}).value || '',
            gtm_id: (document.getElementById('mGtm') || {}).value || '',
            ui_highlight_color: document.getElementById('mUiHighlightColor').value,
            ui_highlight_style: document.getElementById('mUiHighlightStyle').value,
            ui_highlight_count: document.getElementById('mUiHighlightCount').value
        };
        try {
            var res = await fetch(API_URL + '/settings/admin', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify(payload)
            });
            var data = await res.json();
            showToast(data.message || 'Pengaturan berhasil disimpan ✅');
            fetchSettings();
        } catch (e) {
            showToast('Error saving configurations', 'error');
        }
    });
}

// ---- Color Sync ----
var mUiHighlightColor = document.getElementById('mUiHighlightColor');
var mUiHighlightColorText = document.getElementById('mUiHighlightColorText');
if (mUiHighlightColor && mUiHighlightColorText) {
    mUiHighlightColor.addEventListener('input', function (e) { mUiHighlightColorText.value = e.target.value; });
    mUiHighlightColorText.addEventListener('input', function (e) { mUiHighlightColor.value = e.target.value; });
}
