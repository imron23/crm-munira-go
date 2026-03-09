// ============================================================
// WA TEMPLATE BUILDER & UTILS
// ============================================================

window.openTplBuilderModal = function () {
    var tplBuilderOverlay = document.getElementById('tplBuilderOverlay');
    if (!tplBuilderOverlay) return;
    tplBuilderOverlay.classList.add('active');

    // Auto-fill configuration
    const savedCsName = localStorage.getItem('cs_nickname') || '';
    const savedUserPrefix = localStorage.getItem('user_prefix') || '';
    const gcn = document.getElementById('globalCsName');
    const gup = document.getElementById('globalUserPrefix');
    if (gcn) gcn.value = savedCsName;
    if (gup) gup.value = savedUserPrefix;

    renderCustomTplList();
}

document.addEventListener('DOMContentLoaded', () => {
    const tplBuilderOverlay = document.getElementById('tplBuilderOverlay');
    const closeBtn = document.getElementById('tplBuilderClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (tplBuilderOverlay) tplBuilderOverlay.classList.remove('active');
            if (typeof fetchDashboardData === 'function') fetchDashboardData();
        });
    }
});


window.updateGlobalCsName = function (val) {
    localStorage.setItem('cs_nickname', val);
    document.querySelectorAll('.cs-name-input').forEach(el => el.value = val);
    if (document.getElementById('tplCustomPreview') && document.getElementById('tplCustomPreview').style.display === 'block') {
        previewTplBuilder();
    }
}

window.updateGlobalUserPrefix = function (val) {
    localStorage.setItem('user_prefix', val);
    document.querySelectorAll('.user-prefix-input').forEach(el => el.value = val);
    if (document.getElementById('tplCustomPreview') && document.getElementById('tplCustomPreview').style.display === 'block') {
        previewTplBuilder();
    }
}

function getSavedTpls() {
    try {
        return JSON.parse(localStorage.getItem('custom_wa_tpls') || '[]');
    } catch { return []; }
}

function saveTpls(arr) {
    localStorage.setItem('custom_wa_tpls', JSON.stringify(arr));
}

window.getCustomWaTplButtonsHtml = function (L) {
    const tpls = getSavedTpls();
    return tpls.map(tpl => `
        <button class="btn-outline btn-mini" style="padding:8px; justify-content:center; border-color:#EC4899; color:#EC4899;" onclick="sendCustomWAtpl('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}', '${tpl.id}')"><i class="fas fa-magic"></i> ${tpl.name}</button>
    `).join('');
}

window.sendCustomWAtpl = function (leadStr, tplId) {
    const L = JSON.parse(decodeURIComponent(leadStr));
    let clean = L.whatsapp_num.replace(/[^\d]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);
    activeWhatsApp = clean;

    const tpl = getSavedTpls().find(x => x.id === tplId);
    if (!tpl) return;

    let txt = tpl.template;

    // Resolve Vars
    const prefixInput = document.getElementById('userPrefix-' + L.id);
    const userPrefix = (prefixInput && prefixInput.value) ? prefixInput.value : 'Bapak/Ibu';
    const csNameInput = document.getElementById('csName-' + L.id);
    const myName = (csNameInput && csNameInput.value.trim() !== '') ? csNameInput.value.trim() : 'Konsultan Munira World';

    const progSel = document.getElementById('selProg-' + L.id);
    let progName = 'Program Umrah';
    if (progSel && progSel.value) { progName = progSel.options[progSel.selectedIndex].text; }
    else if (L.program_id) { progName = getProgramName(L.program_id) || 'Program Umrah'; }

    const pkgSel = document.getElementById('selPkg-' + L.id);
    let pkgValue = '';
    if (pkgSel && pkgSel.value) { pkgValue = pkgSel.value; }
    else if (L.paket_pilihan) { pkgValue = L.paket_pilihan; }

    const pkgDetail = pkgValue ? `(Paket ${pkgValue})` : '';
    const ketertarikanDetail = `${progName} ${pkgDetail}`.trim();
    const nominalTagihan = L.revenue ? Number(L.revenue).toLocaleString('id-ID') : '0';

    txt = txt.replace(/\\[sapaan\\]/gi, userPrefix);
    txt = txt.replace(/\\[nama\\]/gi, L.nama_lengkap || '');
    txt = txt.replace(/\\[namacs\\]/gi, myName);
    txt = txt.replace(/\\[detailprogram\\]/gi, ketertarikanDetail);
    txt = txt.replace(/\\[nominal\\]/gi, 'Rp ' + nominalTagihan);
    txt = txt.replace(/\\[domisili\\]/gi, L.domisili || '-');
    txt = txt.replace(/\\[paspor\\]/gi, L.kesiapan_paspor || '-');

    const linkInput = document.getElementById('waLink-' + L.id);
    if (linkInput && linkInput.value.trim()) {
        txt += `\n\nUntuk informasi lebih lengkap, ${userPrefix} juga bisa mengakses tautan berikut:\n${linkInput.value.trim()}`;
    }

    const waText = document.getElementById('waText');
    const waPanel = document.getElementById('waPanel');
    if (waText && waPanel) {
        waText.value = txt;
        waPanel.classList.add('active');
        document.body.classList.add('wa-panel-open');
    }
}

window.insertTplVar = function (tag) {
    const ta = document.getElementById('tplCustomText');
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const v = ta.value;
    ta.value = v.substring(0, start) + tag + v.substring(end);
    ta.selectionStart = ta.selectionEnd = start + tag.length;
    ta.focus();
}

window.previewTplBuilder = function () {
    const ta = document.getElementById('tplCustomText');
    if (!ta) return;
    const raw = ta.value;
    let txt = raw;

    const demoCsName = document.getElementById('globalCsName').value.trim() || 'Teh Nisa';
    const demoSapaan = document.getElementById('globalUserPrefix').value.trim() || 'Bapak/Ibu';

    txt = txt.replace(/\\[sapaan\\]/gi, demoSapaan);
    txt = txt.replace(/\\[nama\\]/gi, 'Budi Santoso');
    txt = txt.replace(/\\[namacs\\]/gi, demoCsName);
    txt = txt.replace(/\\[detailprogram\\]/gi, 'Umrah Ramadhan (Paket Gold)');
    txt = txt.replace(/\\[nominal\\]/gi, 'Rp 35.000.000');
    txt = txt.replace(/\\[domisili\\]/gi, 'Jakarta Selatan');
    txt = txt.replace(/\\[paspor\\]/gi, 'Sudah Punya');

    document.getElementById('tplCustomPreviewText').innerHTML = txt.replace(/\\n/g, '<br>');
    document.getElementById('tplCustomPreview').style.display = 'block';
}

document.getElementById('btnSaveCustomTpl')?.addEventListener('click', () => {
    const name = document.getElementById('tplCustomName').value.trim();
    const txt = document.getElementById('tplCustomText').value.trim();
    const editId = document.getElementById('tplCustomEditId').value;

    if (!name || !txt) {
        alert('Nama dan Isi template wajib diisi!'); return;
    }

    const tpls = getSavedTpls();
    if (editId) {
        const idx = tpls.findIndex(x => x.id === editId);
        if (idx > -1) {
            tpls[idx].name = name;
            tpls[idx].template = txt;
        }
    } else {
        tpls.push({ id: 'tpl_' + Date.now(), name, template: txt });
    }

    saveTpls(tpls);
    document.getElementById('tplCustomName').value = '';
    document.getElementById('tplCustomText').value = '';
    document.getElementById('tplCustomEditId').value = '';
    document.getElementById('tplCustomPreview').style.display = 'none';

    renderCustomTplList();
});

window.editCustomTpl = function (id) {
    const tpls = getSavedTpls();
    const tpl = tpls.find(x => x.id === id);
    if (tpl) {
        document.getElementById('tplCustomName').value = tpl.name;
        document.getElementById('tplCustomText').value = tpl.template;
        document.getElementById('tplCustomEditId').value = tpl.id;
        document.getElementById('tplCustomPreview').style.display = 'none';
    }
}

window.deleteCustomTpl = function (id) {
    if (!confirm('Hapus template ini?')) return;
    let tpls = getSavedTpls();
    const tplToDelete = tpls.find(x => x.id === id);
    if (tplToDelete) {
        tplToDelete.deleted_at = new Date().toISOString();
        let deletedTpls = JSON.parse(localStorage.getItem('deleted_custom_wa_tpls') || '[]');
        deletedTpls.push(tplToDelete);
        localStorage.setItem('deleted_custom_wa_tpls', JSON.stringify(deletedTpls));
    }

    tpls = tpls.filter(x => x.id !== id);
    saveTpls(tpls);
    renderCustomTplList();
}

function renderCustomTplList() {
    const customTplListEl = document.getElementById('customTplList');
    if (!customTplListEl) return;
    const tpls = getSavedTpls();
    if (tpls.length === 0) {
        customTplListEl.innerHTML = '<div style="color:var(--text-secondary); font-size:0.85rem; padding:10px;">Belum ada template khusus yang tersimpan.</div>';
        return;
    }
    customTplListEl.innerHTML = tpls.map(tpl => `
        <div style="background:var(--bg-app); border:1px solid var(--border); padding:10px 14px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1; margin-right: 12px; overflow:hidden;">
                <div style="font-weight:600; font-size:0.9rem;">${tpl.name}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tpl.template}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn-outline btn-mini" onclick="editCustomTpl('${tpl.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-outline btn-mini" onclick="deleteCustomTpl('${tpl.id}')" style="color:#ef4444; border-color:#fca5a5;"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}
