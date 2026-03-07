// FORM BUILDER MODULE
// ============================================================
let formsList = [];
let formEditId = null;
let fbFields = [];
let fbWARotator = [];

let pagesListForForm = []; // cache pages for form builder display

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
            formToLps[pg.linked_form_id].push(pg.folder || pg._id);
        }
    });

    container.innerHTML = formsList.map(f => {
        const fieldCount = f.fields ? f.fields.length : 0;
        const isShort = fieldCount <= 3;
        const formTypeBadge = isShort
            ? `<span style="font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px; background:rgba(34,211,238,0.15); color:#22D3EE; margin-left:6px; letter-spacing:0.5px;">⚡ Short Form</span>`
            : `<span style="font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:50px; background:rgba(139,92,246,0.15); color:#8B5CF6; margin-left:6px; letter-spacing:0.5px;">📋 Long Form</span>`;

        const linkedLps = formToLps[f._id] || [];
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
                <button class="btn btn-outline btn-mini" style="flex:1;" onclick="openFormModal('${f._id}')"><i class="fas fa-pen" style="font-size:0.7rem;"></i> Edit</button>
                <button class="btn btn-mini" style="color:var(--danger);" onclick="deleteForm('${f._id}', '${(f.name || '').replace(/'/g, '')}')"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>
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
        const form = formsList.find(f => f._id === editId);
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
                opt.value = f._id;
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
                const linkedForm = forms.find(f => f._id === lpShort.linked_form_id);
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
                const linkedForm = forms.find(f => f._id === lpLong.linked_form_id);
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
                    <button class="btn btn-outline btn-mini" onclick="openFormModal('${f._id}')"><i class="fas fa-edit"></i> Edit Rotator</button>
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
