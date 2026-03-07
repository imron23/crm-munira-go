// ============================================================
// TRASH / RECYCLE BIN
// ============================================================
window.fetchTrash = async function () {
    const tbody = document.getElementById('tblTrashBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Memuat Recycle Bin...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/trash`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        const categoryIcons = {
            leads: '<i class="fas fa-users-viewfinder" style="color:#22D3EE;"></i> Leads',
            programs: '<i class="fas fa-box-open" style="color:#FBBF24;"></i> Program',
            forms: '<i class="fas fa-wpforms" style="color:#F472B6;"></i> Form',
            custom_tpls: '<i class="fab fa-whatsapp" style="color:#25D366;"></i> Template Pesan'
        };

        let localTrash = [];
        try {
            const delTpls = JSON.parse(localStorage.getItem('deleted_custom_wa_tpls') || '[]');
            localTrash = delTpls.map(tpl => ({
                id: tpl.id,
                type: 'custom_tpls',
                label: tpl.name,
                meta: 'Template Pesan Khusus',
                deleted_at: tpl.deleted_at || new Date().toISOString()
            }));
        } catch (e) { }

        const combinedTrash = [...(data.data || []), ...localTrash].sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));

        if (combinedTrash.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-secondary);"><i class="fas fa-box-open" style="font-size:2rem; opacity:0.3; margin-bottom:12px;"></i><br>Recycle Bin kosong</td></tr>';
            return;
        }

        tbody.innerHTML = combinedTrash.map((item, i) => `
            <tr>
                <td><span style="background:var(--bg-surface); padding:4px 8px; border-radius:4px; font-weight:600; font-size:0.8rem;">${categoryIcons[item.type] || item.type}</span></td>
                <td><strong style="color:var(--text-primary); font-size:0.9rem;">${item.label || '-'}</strong></td>
                <td><span style="color:var(--text-secondary); font-size:0.8rem;">${item.meta || '-'}</span></td>
                <td>
                    ${typeof formatDate === 'function' ? formatDate(item.deleted_at) : item.deleted_at}<br>
                    <small style="color:var(--text-secondary);">${typeof timeAgo === 'function' ? timeAgo(item.deleted_at) : ''}</small>
                </td>
                <td style="text-align:right;">
                    <button class="btn-mini btn-outline" style="color:#10B981; border-color:#10B981;" onclick="restoreTrash('${item.type}', '${item.id}')" title="Pulihkan">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--danger);"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data: ${err.message}</td></tr>`;
    }
}

window.restoreTrash = async function (type, id) {
    if (!confirm('Anda yakin ingin memulihkan item ini?')) return;

    if (type === 'custom_tpls') {
        let deletedTpls = JSON.parse(localStorage.getItem('deleted_custom_wa_tpls') || '[]');
        const tplToRestore = deletedTpls.find(x => x.id === id);
        if (tplToRestore) {
            delete tplToRestore.deleted_at;
            let activeTpls = JSON.parse(localStorage.getItem('custom_wa_tpls') || '[]');
            activeTpls.push(tplToRestore);
            localStorage.setItem('custom_wa_tpls', JSON.stringify(activeTpls));

            deletedTpls = deletedTpls.filter(x => x.id !== id);
            localStorage.setItem('deleted_custom_wa_tpls', JSON.stringify(deletedTpls));

            if (typeof showToast === 'function') showToast('✅ Template pesan berhasil dipulihkan');
            fetchTrash();
            if (typeof renderCustomTplList === 'function') renderCustomTplList();
        } else {
            if (typeof showToast === 'function') showToast('❌ Template tidak ditemukan', 'error');
        }
        return;
    }

    try {
        const res = await fetch(`${API_URL}/trash/restore/${type}/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        if (data.success) {
            if (typeof showToast === 'function') showToast('✅ ' + data.message);
            fetchTrash();
            // refreshing other panels silently...
            if (typeof fetchDashboardData === 'function') fetchDashboardData();
            if (typeof loadProgramsList === 'function') loadProgramsList();
        } else {
            if (typeof showToast === 'function') showToast('❌ ' + data.message, 'error');
        }
    } catch (err) {
        if (typeof showToast === 'function') showToast('❌ Server error saat memulihkan', 'error');
    }
}

window.emptyTrash = async function () {
    if (!confirm('PERINGATAN: Aksi ini akan menghapus semua isi Recycle Bin secara PERMANEN. Anda yakin?')) return;

    try {
        localStorage.removeItem('deleted_custom_wa_tpls');
        const res = await fetch(`${API_URL}/trash/empty`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();

        if (data.success) {
            if (typeof showToast === 'function') showToast('🗑️ Recycle bin berhasil dikosongkan!');
            fetchTrash();
        } else {
            if (typeof showToast === 'function') showToast('❌ ' + data.message, 'error');
        }
    } catch (err) {
        if (typeof showToast === 'function') showToast('❌ Server error saat mengosongkan trash', 'error');
    }
}
