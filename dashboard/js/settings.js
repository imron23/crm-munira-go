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
    } catch (e) { console.error('Settings error:', e); }
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
            fetchSettings();
        } catch (e) { alert('Error saving configurations'); }
    });
}

var mUiHighlightColor = document.getElementById('mUiHighlightColor');
var mUiHighlightColorText = document.getElementById('mUiHighlightColorText');
if (mUiHighlightColor && mUiHighlightColorText) {
    mUiHighlightColor.addEventListener('input', e => mUiHighlightColorText.value = e.target.value);
    mUiHighlightColorText.addEventListener('input', e => mUiHighlightColor.value = e.target.value);
}
