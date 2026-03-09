// Chart Instance Trackers
var chartTrend = null;
var chartPkg = null;

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

    const statusOrder = ['New Data', 'Contacted', 'Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost', 'Invalid', 'Pembatalan', 'Pengembalian'];
    const statusColors = ['#2563ea', '#9333EA', '#3B82F6', '#6366F1', '#F59E0B', '#16a34a', '#DC2626', '#9CA3AF', '#EF4444', '#64748B'];
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

// Chart instance trackers for advanced analytics
var chartSource = null;
var chartWinRatePkg = null;
var chartLostReason = null;
var chartHourly = null;
var chartSpeedRate = null;

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

        const res = await fetch(`${API_URL}/leads?status=All&limit=10000`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const payload = await res.json();

        btn.innerHTML = '<i class="fas fa-download"></i> Export';
        btn.disabled = false;

        if (payload.success && payload.data.length > 0) {
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
            const rows = payload.data.map(L => {
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
            showToast(`✅ Export berhasil: ${payload.data.length} leads`);
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

// MODAL WA EDITOR Logic migrated to app.js

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
    const revEl = document.getElementById('editRevenue');
    attachRpFormatter(revEl);
    setRpInput(revEl, revenue);
    document.getElementById('revenueGroup').style.display = ['DP', 'Order Complete'].includes(status) ? 'block' : 'none';
    populateProgramSelects(programId);
    if (programId) document.getElementById('editProgram').value = programId;

    // AI Insight
    const leadObj = allLeads.find(l => String(l.id || l.id) === String(id));
    const insightBox = document.getElementById('aiLeadInsightBox');
    if (leadObj && window.analyzeLead && insightBox) {
        const insight = window.analyzeLead(leadObj);
        insightBox.style.display = 'block';
        document.getElementById('aiLeadScore').innerText = insight.score;
        document.getElementById('aiLeadScore').style.backgroundColor = insight.color;
        document.getElementById('aiLeadLabel').innerText = insight.label;
        document.getElementById('aiLeadLabel').style.color = insight.color;

        let recHtml = insight.recommendation;
        if (insight.score >= 80) recHtml = '🔥 ' + recHtml;
        else if (insight.score <= 40) recHtml = '❄️ ' + recHtml;
        else recHtml = '💡 ' + recHtml;

        document.getElementById('aiLeadRecommendation').innerHTML = recHtml;
        document.getElementById('aiLeadReasons').innerHTML = insight.reasons.map(r => `<li>${r}</li>`).join('');
    } else if (insightBox) {
        insightBox.style.display = 'none';
    }

    editOverlay.classList.add('active');
}
document.getElementById('editClose').addEventListener('click', () => editOverlay.classList.remove('active'));

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const status = document.getElementById('editStatus').value;
        const notes = document.getElementById('editCatatan').value;
        const revenue = parseRpInput(document.getElementById('editRevenue').value);
        const program_id = document.getElementById('editProgram').value;

        try {
            const res = await fetch(`${API_URL}/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify({ status_followup: status, catatan: notes, revenue, program_id })
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
    const notes = notesInput.value.trim();
    const revInput = document.getElementById('rev-' + id);
    const revenue = revInput ? parseRpInput(revInput.value) : undefined;

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
    const waPanel = document.getElementById('waPanel');
    if (waPanel) {
        waPanel.classList.add('active');
        document.body.classList.add('wa-panel-open');
    }
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
