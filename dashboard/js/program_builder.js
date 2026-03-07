// ============================================================
// PROGRAM BUILDER
// ============================================================

const TIERS = ['bronze', 'silver', 'gold'];
const ROOMS = ['quad', 'double', 'triple'];

const pbOverlay = document.getElementById('pbOverlay');
const pbForm = document.getElementById('pbForm');

function pbOpenOverlay() {
    if (pbOverlay) {
        pbOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function pbCloseOverlay() {
    if (pbOverlay) {
        pbOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

document.getElementById('pbClose')?.addEventListener('click', pbCloseOverlay);
document.getElementById('pbCancelBtn')?.addEventListener('click', pbCloseOverlay);
pbOverlay?.addEventListener('click', (e) => { if (e.target === pbOverlay) pbCloseOverlay(); });

// Departure date rows
function pbAddDateRow(val = { label: '', start: '', end: '' }) {
    const c = document.getElementById('pbDatesContainer');
    if (!c) return;
    const div = document.createElement('div');
    div.className = 'pb-date-row';
    div.style.cssText = 'display:grid; grid-template-columns:2fr 1fr 1fr auto; gap:8px; align-items:center;';
    div.innerHTML = `
        <input type="text" placeholder="Label (mis: Maret 2026, Ramadhan Waw...)" value="${val.label || ''}"
            class="select-base pb-date-label" style="width:100%; font-size:0.8rem;">
        <input type="date" value="${val.start || ''}" class="select-base pb-date-start" style="width:100%; font-size:0.8rem;">
        <input type="date" value="${val.end || ''}" class="select-base pb-date-end" style="width:100%; font-size:0.8rem;">
        <button type="button" style="background:var(--danger-light); color:var(--danger); border:none; border-radius:8px; width:32px; height:32px; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="this.parentElement.remove()">
            <i class="fas fa-trash" style="font-size:0.7rem;"></i>
        </button>`;
    c.appendChild(div);
}

document.getElementById('pbAddDate')?.addEventListener('click', () => pbAddDateRow());

function pbGetDates() {
    const rows = document.querySelectorAll('#pbDatesContainer .pb-date-row');
    return Array.from(rows).map(r => ({
        label: r.querySelector('.pb-date-label').value.trim(),
        start: r.querySelector('.pb-date-start').value,
        end: r.querySelector('.pb-date-end').value
    })).filter(d => d.label || d.start);
}

function pbGetPackages() {
    const pkgs = [];
    TIERS.forEach(t => ROOMS.forEach(r => {
        const val = typeof parseRpInput === 'function' ? parseRpInput(document.getElementById(`price-${t}-${r}`)?.value) : parseInt((document.getElementById(`price-${t}-${r}`)?.value || '').replace(/\\D/g, '')) || 0;
        pkgs.push({ tier: t, room_type: r, price: val });
    }));
    return pkgs;
}

function pbResetForm() {
    document.getElementById('pbId').value = '';
    document.getElementById('pbModalTitle').textContent = 'Buat Program Baru';
    document.getElementById('pbNama').value = '';
    document.getElementById('pbPoster').value = '';
    document.getElementById('pbDeskripsi').value = '';
    document.getElementById('pbLanding').value = '';
    document.getElementById('pbOrder').value = '0';
    document.getElementById('pbActive').value = '1';
    document.getElementById('pbDatesContainer').innerHTML = '';
    TIERS.forEach(t => ROOMS.forEach(r => {
        const el = document.getElementById(`price-${t}-${r}`);
        if (el) {
            el.value = '';
            if (typeof attachRpFormatter === 'function') attachRpFormatter(el);
        }
    }));
}

function pbFillForm(p) {
    document.getElementById('pbId').value = p.id;
    document.getElementById('pbModalTitle').textContent = 'Edit Program';
    document.getElementById('pbNama').value = p.nama_program || '';
    document.getElementById('pbPoster').value = p.poster_url || '';
    document.getElementById('pbDeskripsi').value = p.deskripsi || '';
    document.getElementById('pbLanding').value = p.landing_url || '';
    document.getElementById('pbOrder').value = p.sort_order ?? 0;
    document.getElementById('pbActive').value = p.is_active ? '1' : '0';
    document.getElementById('pbDatesContainer').innerHTML = '';
    (p.departure_dates || []).forEach(d => pbAddDateRow(d));
    TIERS.forEach(t => ROOMS.forEach(r => {
        const pkg = (p.packages || []).find(x => x.tier === t && x.room_type === r);
        const el = document.getElementById(`price-${t}-${r}`);
        if (el) {
            if (typeof attachRpFormatter === 'function') attachRpFormatter(el);
            if (typeof setRpInput === 'function') setRpInput(el, pkg ? pkg.price : 0);
            else el.value = pkg ? pkg.price : 0;
        }
    }));
}

function pbFormatRp(n) {
    if (!n || n === 0) return '–';
    if (typeof formatRpShort === 'function') return 'Rp ' + formatRpShort(n);
    return 'Rp ' + n.toLocaleString('id-ID');
}

function pbRenderCard(p) {
    const isActive = p.is_active;
    const dates = (p.departure_dates || []);
    const pkgs = (p.packages || []);

    const datesHtml = dates.length > 0
        ? dates.map(d => `<span style="display:inline-block; background:var(--brand-light); color:var(--brand); border-radius:20px; padding:3px 10px; font-size:0.72rem; margin:2px;">${d.label || ''} ${d.start ? d.start.replace(/-/g, '/').substring(2) : ''} - ${d.end ? d.end.replace(/-/g, '/').substring(2) : ''}</span>`).join('')
        : '<span style="color:var(--text-secondary); font-size:0.78rem;">Belum ada jadwal</span>';

    const priceRows = ROOMS.map(room => {
        const cells = TIERS.map(tier => {
            const pkg = pkgs.find(x => x.tier === tier && x.room_type === room);
            const price = pkg ? pkg.price : 0;
            return `<td style="text-align:center; padding:6px 10px; font-size:0.8rem; font-weight:${price ? '600' : '400'}; color:${price ? 'var(--text-primary)' : 'var(--text-secondary)'};">${pbFormatRp(price)}</td>`;
        }).join('');
        return `<tr><td style="padding:6px 10px; font-size:0.8rem; font-weight:600; color:var(--text-secondary);">${room.charAt(0).toUpperCase() + room.slice(1)}</td>${cells}</tr>`;
    }).join('');

    const poster = p.poster_url
        ? `<img src="${p.poster_url}" alt="Poster" style="width:80px; height:80px; object-fit:cover; border-radius:10px; flex-shrink:0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div style="display:none; width:80px; height:80px; border-radius:10px; background:var(--brand-light); align-items:center; justify-content:center; flex-shrink:0;"><i class="fas fa-image" style="color:var(--brand); font-size:1.5rem; opacity:0.5;"></i></div>`
        : `<div style="width:80px; height:80px; border-radius:10px; background:var(--brand-light); display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fas fa-image" style="color:var(--brand); font-size:1.5rem; opacity:0.5;"></i></div>`;

    const leadsCount = (typeof allLeads !== 'undefined') ? allLeads.filter(l => l.program_id === p.id).length : 0;

    return `
    <div style="background:var(--bg-card); backdrop-filter:var(--glass-blur); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; transition:box-shadow 0.2s;">
        <div style="display:flex; gap:16px; align-items:flex-start;">
            ${poster}
            <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                    <div>
                        <h3 style="font-size:1rem; font-weight:700; margin-bottom:2px;">${p.nama_program} ${p.is_restored ? '<i class="fas fa-pen" style="color:#EC4899; font-size:0.75rem; margin-left:4px;" title="Dipulihkan dari Recycle Bin"></i>' : ''}</h3>
                        <span style="font-size:0.75rem; background:${isActive ? 'var(--success-light)' : 'var(--danger-light)'}; color:${isActive ? 'var(--success)' : 'var(--danger)'}; border-radius:20px; padding:2px 10px;">${isActive ? '🟢 Aktif' : '🔴 Nonaktif'}</span>
                    </div>
                    <div style="display:flex; gap:8px; flex-shrink:0;">
                        <button class="btn-mini btn-outline" onclick="pbEditProgram('${p.id}')"><i class="fas fa-pen"></i> Edit</button>
                        <button class="btn-mini" style="background:var(--danger-light); color:var(--danger); border:none; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:0.75rem;" onclick="pbDeleteProgram('${p.id}', decodeURIComponent('${encodeURIComponent(p.nama_program).replace(/'/g, "%27")}'))"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                ${p.deskripsi ? `<p style="font-size:0.8rem; color:var(--text-secondary); margin-top:6px;">${p.deskripsi}</p>` : ''}

                <div style="margin-top:10px; margin-bottom:8px;">
                    <small style="color:var(--text-secondary); font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:1px;">📅 Tanggal Keberangkatan</small><br>
                    <div style="margin-top:4px;">${datesHtml}</div>
                </div>
            </div>
        </div>

        <!-- Pricing Matrix -->
        <div style="margin-top:14px; border-top:1px solid var(--border); padding-top:12px; overflow-x:auto;">
            <small style="color:var(--text-secondary); font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">💰 Harga Paket</small>
            <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
                <thead>
                    <tr style="background:rgba(0,0,0,0.2);">
                        <th style="padding:6px 10px; text-align:left; color:var(--text-secondary); font-size:0.72rem;">Kamar</th>
                        <th style="padding:6px 10px; text-align:center; color:#CD7F32; font-size:0.72rem;">🥉 Bronze</th>
                        <th style="padding:6px 10px; text-align:center; color:#C0C0C0; font-size:0.72rem;">🥈 Silver</th>
                        <th style="padding:6px 10px; text-align:center; color:#FFD700; font-size:0.72rem;">🥇 Gold</th>
                    </tr>
                </thead>
                <tbody>${priceRows}</tbody>
            </table>
        </div>

        <!-- Lead count badge -->
        <div style="margin-top:10px; border-top:1px solid var(--border); padding-top:8px;">
            <small style="color:var(--text-secondary); font-size:0.75rem;"><i class="fas fa-users" style="margin-right:4px;"></i>${leadsCount} lead terdaftar ke program ini</small>
            ${p.landing_url ? `<a href="${p.landing_url}" target="_blank" style="margin-left:12px; font-size:0.75rem; color:var(--brand);"><i class="fas fa-external-link-alt"></i> Landing Page</a>` : ''}
        </div>
    </div>`;
}

window.fetchProgramBuilder = async function () {
    try {
        const res = await fetch(`${API_URL}/programs`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        if (!data.success) return;

        // Also update programsListCache for dropdowns
        if (typeof programsListCache !== 'undefined') programsListCache = data.programs || [];

        const list = document.getElementById('programBuilderList');
        const empty = document.getElementById('programBuilderEmpty');
        if (!list || !empty) return;

        if (!data.programs.length) {
            list.innerHTML = '';
            empty.style.display = 'block';
        } else {
            empty.style.display = 'none';
            list.innerHTML = data.programs.map(p => pbRenderCard(p)).join('');
        }
    } catch (e) {
        console.error('fetchProgramBuilder error:', e);
    }
}

document.getElementById('btnCreateProgram')?.addEventListener('click', () => {
    pbResetForm();
    pbOpenOverlay();
});

window.pbEditProgram = async function (id) {
    try {
        const res = await fetch(`${API_URL}/programs/${id}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const data = await res.json();
        if (data.success) {
            pbFillForm(data.program);
            pbOpenOverlay();
        }
    } catch (e) { console.error(e); }
};

window.pbDeleteProgram = async function (id, name) {
    if (!confirm(`Hapus program "${name}"? Semua lead yang terhubung ke program ini akan tetap ada.`)) return;
    try {
        const res = await fetch(`${API_URL}/programs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) fetchProgramBuilder();
        else alert('Gagal hapus: ' + data.message);
    } catch (e) { alert('Error menghapus program.'); }
};

pbForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pbId').value;
    const payload = {
        nama_program: document.getElementById('pbNama').value.trim(),
        poster_url: document.getElementById('pbPoster').value.trim(),
        deskripsi: document.getElementById('pbDeskripsi').value.trim(),
        landing_url: document.getElementById('pbLanding').value.trim(),
        sort_order: parseInt(document.getElementById('pbOrder').value) || 0,
        is_active: document.getElementById('pbActive').value === '1',
        departure_dates: pbGetDates(),
        packages: pbGetPackages()
    };
    if (!payload.nama_program) { alert('Nama program wajib diisi'); return; }

    const submitBtn = pbForm.querySelector('[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';

    try {
        const url = id ? `${API_URL}/programs/${id}` : `${API_URL}/programs`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            pbCloseOverlay();
            fetchProgramBuilder();
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Server error.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Program';
    }
});
