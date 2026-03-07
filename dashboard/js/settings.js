// MARKETING HUB & ADVANCED Settings Logic
const marketingForm = document.getElementById('marketingForm');
async function fetchSettings() {
    try {
        const res = await fetch(`${API_URL}/settings`, { headers: { 'Authorization': 'Bearer ' + authToken } });
        const data = await res.json();
        if (data.settings && Array.isArray(data.settings)) {
            const map = {};
            data.settings.forEach(s => map[s.key] = s.value);

            document.getElementById('mFbPixel').value = map.meta_pixel_id || '';
            document.getElementById('mGa4').value = map.ga4_id || '';
            document.getElementById('mTgToken').value = map.tg_bot_token || '';
            document.getElementById('mTgChat').value = map.tg_chat_id || '';
            if (document.getElementById('mRevGoal')) document.getElementById('mRevGoal').value = map.monthly_revenue_goal || '';

            window.uiHighlightColor = map.ui_highlight_color || '#16A34A';
            window.uiHighlightStyle = map.ui_highlight_style || 'solid';
            window.uiHighlightCount = map.ui_highlight_count || 5;
            window.monthlyRevenueGoal = parseInt(map.monthly_revenue_goal) || 0;

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
            monthly_revenue_goal: document.getElementById('mRevGoal') ? document.getElementById('mRevGoal').value : '',
            ui_highlight_color: document.getElementById('mUiHighlightColor').value,
            ui_highlight_style: document.getElementById('mUiHighlightStyle').value,
            ui_highlight_count: document.getElementById('mUiHighlightCount').value
        };
        try {
            // Because our current go backend /api/settings is single key-value save, we iterate and save
            let allGood = true;
            for (const [key, value] of Object.entries(payload)) {
                const res = await fetch(`${API_URL}/settings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    body: JSON.stringify({ key, value: String(value) })
                });
                if (!res.ok) allGood = false;
            }
            if (allGood) alert('Pengaturan berhasil disimpan');
            else alert('Beberapa pengaturan mungkin gagal disimpan');
            fetchSettings();
            fetchDashboardData();
        } catch (e) { alert('Error saving configurations'); }
    });
}

const mUiHighlightColor = document.getElementById('mUiHighlightColor');
const mUiHighlightColorText = document.getElementById('mUiHighlightColorText');
if (mUiHighlightColor && mUiHighlightColorText) {
    mUiHighlightColor.addEventListener('input', e => mUiHighlightColorText.value = e.target.value);
    mUiHighlightColorText.addEventListener('input', e => mUiHighlightColor.value = e.target.value);
}

// ======================================
