// ============================================================
// TEAM MANAGEMENT
// ============================================================
let teamEditId = null;

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
                        <button class="btn btn-outline btn-mini" style="flex:1;" onclick="openTeamModal('${member._id}')"><i class="fas fa-pen" style="font-size:0.7rem;"></i> Edit</button>
                        ${member.username !== (currentUserData?.username) ? `<button class="btn btn-mini" style="color:var(--danger);" onclick="deleteTeamMember('${member._id}', '${member.full_name || member.username}')"><i class="fas fa-trash" style="font-size:0.7rem;"></i></button>` : ''}
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
            const member = data.data.find(m => m._id === editId);
            if (member) {
                document.getElementById('tmId').value = member._id;
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

