// ======================= ADVANCED ANALYTICS FUNCTIONS =======================

function drawGoalTracker(leadsArray) {
    const goalRev = window.monthlyRevenueGoal || 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Sum revenue for Order Complete/DP in current month
    let achieved = 0;
    leadsArray.forEach(L => {
        if (!L.created_at) return;
        const d = new Date(L.created_at);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
                achieved += (L.revenue || 0);
            }
        }
    });

    const goalEl = document.getElementById('goalRevenueText');
    const barEl = document.getElementById('goalProgressBar');
    const pctEl = document.getElementById('goalPercentageText');

    if (!goalEl || !barEl || !pctEl) return;

    if (goalRev > 0) {
        let pct = (achieved / goalRev) * 100;
        pctEl.textContent = `${pct.toFixed(1)}% Achieved`;
        pct = pct > 100 ? 100 : pct;
        barEl.style.width = pct + '%';
        goalEl.textContent = formatRpKPI(achieved) + ' / ' + formatRpKPI(goalRev);
    } else {
        pctEl.textContent = `Set Target Revenue di Pengaturan`;
        barEl.style.width = '0%';
        goalEl.textContent = formatRpKPI(achieved) + ' / --';
    }
}

function drawStagnantLeads(leadsArray) {
    const tbody = document.getElementById('stagnantLeadsBody');
    if (!tbody) return;

    const now = new Date();
    const stagnants = [];

    leadsArray.forEach(L => {
        // Only count active leads
        const activeStatuses = ['New Data', 'Contacted', 'Proses FU', 'Kirim PPL/Dokumen', 'DP'];
        if (!activeStatuses.includes(L.status_followup)) return;

        // Check history
        if (L.status_history && L.status_history.length > 0) {
            const lastLog = L.status_history[L.status_history.length - 1];
            const updated = new Date(lastLog.changed_at);
            const diffTime = Math.abs(now - updated);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 3) {
                stagnants.push({ name: L.nama_lengkap, status: L.status_followup, days: diffDays });
            }
        }
    });

    // Sort descending by days
    stagnants.sort((a, b) => b.days - a.days);

    tbody.innerHTML = '';
    if (stagnants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); padding:16px;">Tidak ada stagnant lead</td></tr>';
        return;
    }

    // Show top 5
    stagnants.slice(0, 5).forEach(s => {
        let badgeColor = '#3B82F6';
        if (s.days > 7) badgeColor = '#EF4444';
        else if (s.days > 4) badgeColor = '#F59E0B';

        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${s.name}</td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${s.status}</span></td>
                <td><span style="color:${badgeColor}; font-weight:700;">${s.days} Hari</span></td>
            </tr>
        `;
    });
}

function drawSourceChart(leadsArray) {
    const ctx = document.getElementById('sourceChart');
    if (!ctx) return;

    let organic = 0;
    let ads = 0;

    leadsArray.forEach(L => {
        const source = (L.utm_source || '').toLowerCase();
        const medium = (L.utm_medium || '').toLowerCase();

        if (source.includes('cpc') || source.includes('ads') || medium.includes('cpc') || medium.includes('cpa') || medium.includes('paid')) {
            ads++;
        } else {
            organic++;
        }
    });

    if (chartSource) chartSource.destroy();
    chartSource = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Organic / Other', 'Paid Ads'],
            datasets: [{
                data: [organic, ads],
                backgroundColor: ['#10B981', '#EC4899'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#8896AB' } } }
        }
    });
}

function drawWinRatePackageChart(leadsArray) {
    const ctx = document.getElementById('winRatePackageChart');
    if (!ctx) return;

    const pkgStats = {};
    leadsArray.forEach(L => {
        let p = L.paket_pilihan && L.paket_pilihan.trim() !== '' ? L.paket_pilihan : 'Lainnya';
        if (!pkgStats[p]) pkgStats[p] = { total: 0, won: 0 };
        pkgStats[p].total++;
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
            pkgStats[p].won++;
        }
    });

    const arr = Object.keys(pkgStats).map(p => {
        const total = pkgStats[p].total;
        const won = pkgStats[p].won;
        const rate = total > 0 ? (won / total * 100) : 0;
        return { name: p, total, rate };
    }).filter(p => p.total > 0).sort((a, b) => b.total - a.total).slice(0, 5); // top 5 packages

    if (chartWinRatePkg) chartWinRatePkg.destroy();
    chartWinRatePkg = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arr.map(a => a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name),
            datasets: [{
                label: 'Win Rate (%)',
                data: arr.map(a => a.rate.toFixed(1)),
                backgroundColor: '#10B981',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%', color: '#8896AB' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#8896AB', font: { size: 10 } }, grid: { display: false } }
            }
        }
    });
}

function drawLostReasonChart(leadsArray) {
    const ctx = document.getElementById('lostReasonChart');
    if (!ctx) return;

    const reasons = {};
    const lostLeads = leadsArray.filter(L => L.status_followup === 'Lost');
    lostLeads.forEach(L => {
        let note = (L.catatan || '').toLowerCase();
        let cat = 'Lainnya';
        if (note.includes('mahal') || note.includes('harga') || note.includes('budget')) cat = 'Harga / Budget';
        else if (note.includes('competitor') || note.includes('pesaing') || note.includes('travel lain')) cat = 'Pilih Travel Lain';
        else if (note.includes('tidak respon') || note.includes('no respon') || note.includes('ghost')) cat = 'Tidak Respon';
        else if (note.includes('jadwal') || note.includes('tanggal')) cat = 'Jadwal Tidak Cocok';
        else if (note.includes('batal') || note.includes('tunda')) cat = 'Menunda Keberangkatan';

        reasons[cat] = (reasons[cat] || 0) + 1;
    });

    const arr = Object.entries(reasons).sort((a, b) => b[1] - a[1]);

    if (chartLostReason) chartLostReason.destroy();
    chartLostReason = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: arr.map(a => a[0]),
            datasets: [{
                data: arr.map(a => a[1]),
                backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#8B5CF6', '#64748B', '#a8a29e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#8896AB', font: { size: 10 } } } }
        }
    });
}

function drawHourlyChart(leadsArray) {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;

    const hourlyLeads = Array(24).fill(0);
    const hourlyWon = Array(24).fill(0);

    leadsArray.forEach(L => {
        if (!L.created_at) return;
        const date = new Date(L.created_at);
        const hour = date.getHours();
        hourlyLeads[hour]++;
        if (L.status_followup === 'DP' || L.status_followup === 'Order Complete') {
            hourlyWon[hour]++;
        }
    });

    if (chartHourly) chartHourly.destroy();
    chartHourly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00'),
            datasets: [
                {
                    label: 'Leads Masuk',
                    data: hourlyLeads,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Konversi (Closing)',
                    data: hourlyWon,
                    borderColor: '#10B981',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { color: '#8896AB' } } },
            scales: {
                y: { ticks: { color: '#8896AB' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#8896AB', maxTicksLimit: 12 }, grid: { display: false } }
            }
        }
    });
}

function drawSpeedToLeadChart(leadsArray) {
    const ctx = document.getElementById('speedToLeadChart');
    if (!ctx) return;

    // Categories: < 15m, 15m-1h, 1h-4h, > 4h
    let speeds = {
        'Cepat (<15m)': { total: 0, won: 0 },
        'Normal (15m-1j)': { total: 0, won: 0 },
        'Lambat (1j-4j)': { total: 0, won: 0 },
        'Sangat Lambat (>4j)': { total: 0, won: 0 },
        'Belum Contacted': { total: 0, won: 0 }
    };

    leadsArray.forEach(L => {
        let isWon = (L.status_followup === 'DP' || L.status_followup === 'Order Complete');
        if (!L.status_history || L.status_history.length < 2) {
            if (L.status_followup === 'New Data') {
                speeds['Belum Contacted'].total++;
            }
            return;
        }

        // Find the "New Data" time and the first time it changed status
        const createdMs = new Date(L.created_at || L.status_history[0].changed_at).getTime();
        let contactedMs = null;
        for (let i = 1; i < L.status_history.length; i++) {
            if (L.status_history[i].status !== 'New Data') {
                contactedMs = new Date(L.status_history[i].changed_at).getTime();
                break;
            }
        }

        if (contactedMs) {
            const diffMin = (contactedMs - createdMs) / (1000 * 60);
            let cat = '';
            if (diffMin <= 15) cat = 'Cepat (<15m)';
            else if (diffMin <= 60) cat = 'Normal (15m-1j)';
            else if (diffMin <= 240) cat = 'Lambat (1j-4j)';
            else cat = 'Sangat Lambat (>4j)';

            speeds[cat].total++;
            if (isWon) speeds[cat].won++;
        }
    });

    const labels = ['Cepat (<15m)', 'Normal (15m-1j)', 'Lambat (1j-4j)', 'Sangat Lambat (>4j)'];
    const rates = labels.map(l => {
        let stat = speeds[l];
        return stat.total > 0 ? (stat.won / stat.total * 100) : 0;
    });

    // Total bubbles
    const totals = labels.map(l => speeds[l].total);

    if (chartSpeedRate) chartSpeedRate.destroy();

    // Bubble chart visual to show volume
    chartSpeedRate = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Win Rate (%)',
                data: rates.map(r => r.toFixed(1)),
                backgroundColor: ['#2eab59', '#3B82F6', '#F59E0B', '#EF4444'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterLabel: function (context) {
                            return 'Total Leads: ' + totals[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: { min: 0, max: 100, ticks: { callback: v => v + '%', color: '#8896AB' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#8896AB', font: { size: 10 } }, grid: { display: false } }
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
        let matchQ = (L.nama_lengkap || '').toLowerCase().includes(searchVal) ||
            String(L.user_id || L.id || '').toLowerCase().includes(searchVal) ||
            (L.whatsapp_num || '').includes(searchVal) ||
            (L.paket_pilihan || '').toLowerCase().includes(searchVal) ||
            (L.assigned_to_name || '').toLowerCase().includes(searchVal);
        return matchS && matchCS && matchQ;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
        let valA = a[window.currentSortCol] !== undefined && a[window.currentSortCol] !== null ? a[window.currentSortCol] : '';
        let valB = b[window.currentSortCol] !== undefined && b[window.currentSortCol] !== null ? b[window.currentSortCol] : '';

        if (window.currentSortCol === 'created_at') {
            valA = new Date(valA).getTime() || 0;
            valB = new Date(valB).getTime() || 0;
        } else if (typeof valA === 'string' || typeof valB === 'string') {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if (valA < valB) return window.currentSortDir === 'asc' ? -1 : 1;
        if (valA > valB) return window.currentSortDir === 'asc' ? 1 : -1;
        return 0;
    });

    if (filtered.length === 0) {
        body.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:32px; color:var(--text-secondary);">Tidak ada data leads ditemukan.</td></tr>`;
        const pf = document.getElementById('pageInfo');
        if (pf) pf.textContent = `Showing 0 of 0`;
        return;
    }

    // Pagination Logic
    const pageSizeEl = document.getElementById('pageSize');
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
        let statCls = (L.status_followup || '').toLowerCase().replace(/\s+/g, '');
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
                <span
                    style="color:var(--brand); font-weight:700; cursor:pointer; font-size:0.82rem; letter-spacing:0.3px;"
                    title="Klik untuk Smart Copy info lead"
                    onclick="smartCopyLead('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"
                    onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration=''">
                    ${L.user_id || L.id}
                </span>
            </td>
            <td>
                ${L.domisili || '-'}
            </td>
            <td>
                <span>${formatDate(L.created_at)}</span><br>
                <small style="color:var(--text-secondary)">${timeAgo(L.created_at)}</small>
            </td>
            <td>
                <div style="display:flex; align-items:center;">
                    <strong style="cursor:pointer;" title="Klik untuk Smart Copy" onclick="smartCopyLead('${encodeURIComponent(JSON.stringify(L)).replace(/'/g, "%27")}')"
                        onmouseover="this.style.color='var(--brand)'" onmouseout="this.style.color=''">${L.nama_lengkap || '-'} ${L.is_restored ? '<i class="fas fa-pen" style="color:#EC4899; font-size:0.75rem; margin-left:4px;" title="Dipulihkan dari Recycle Bin"></i>' : ''}</strong>
                    <button class="btn-mini" style="border:none; padding:2px 5px; font-size:0.75rem; margin-left:5px; color:var(--brand); background:transparent; cursor:pointer;" 
                        title="Copy: Nama + No HP"
                        onclick="copyNameWa('${(L.nama_lengkap || '').replace(/'/g, '&#39;')}', '${L.whatsapp_num || ''}', this)">
                        <i class="far fa-copy"></i>
                    </button>
                </div>
                <a href="#" class="wa-direct" onclick="alertWA('${L.whatsapp_num || ''}'); return false;" style="color:var(--success); font-weight:600; text-decoration:none; display:inline-block; margin-top:2px;">${L.whatsapp_num || '-'}</a>
            </td>
            <td>
                ${L.paket_pilihan || 'N/A'}<br>
                <small style="color:var(--text-secondary)">${L.yang_berangkat || '1 Pax'}</small>
            </td>
            <td>
                ${(() => {
                const progName = L.program_id ? getProgramName(L.program_id) : null;
                const rev = L.revenue || 0;
                const isDollar = rev > 0 && rev < 100000;
                const revBadge = rev > 0
                    ? (isDollar
                        ? `<span style="color:#FBBF24;font-size:0.65rem;font-weight:700;">$${Number(rev).toLocaleString('en-US')}</span>`
                        : `<span style="color:#10B981;font-size:0.65rem;font-weight:700;">Rp ${formatRpShort(rev)}</span>`)
                    : '';
                const hasProg = progName && progName !== '-';
                if (!hasProg && !revBadge) return `<span style="color:var(--text-secondary);font-size:0.75rem;">—</span>`;
                return `<div style="display:flex;flex-direction:column;gap:2px;">
                        <span style="font-size:0.76rem;font-weight:600;color:${hasProg ? 'var(--text-primary)' : 'var(--text-secondary)'};line-height:1.3;">${hasProg ? progName : '—'}</span>
                        ${(hasProg && L.paket_pilihan) ? `<span style="font-size:0.62rem;color:var(--brand);background:rgba(91,158,244,0.1);padding:1px 5px;border-radius:50px;width:fit-content;">${L.paket_pilihan}</span>` : ''}
                        ${revBadge}
                    </div>`;
            })()}
            </td>

            <td>
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:26px; height:26px; border-radius:50%; background:${csColor}22; border:1.5px solid ${csColor}; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; color:${csColor}; flex-shrink:0;">${csInitial}</div>
                    <span style="font-size:0.8rem; font-weight:600;">${csName}</span>
                </div>
            </td>
            <td>
                <span style="font-weight:600; font-size:0.85rem;">${formatLpName(L.landing_page)}</span><br>
                <small style="color:var(--text-secondary); text-transform:uppercase;">${L.utm_source || 'organic'}</small>
            </td>
            <td>
                <span style="font-weight:600; font-size:0.85rem;">${L.form_source || 'Default'}</span>
            </td>
            <td>
                <span class="status st-${statCls}">${L.status_followup}</span>
                ${L.catatan ? `<div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${L.catatan.substring(0, 25)}...</div>` : ''}
            </td>
             <td style="text-align:right;">
                <div class="act-row" style="justify-content:flex-end;">
                    <button class="btn-mini btn-outline" onclick="toggleAccordion('${L.id}')"><i class="fas fa-chevron-down"></i> Detail</button>
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
            <td colspan="10" class="accordion-content" style="padding: 20px 24px !important; background: var(--bg-surface);">
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
            allLeads = allLeads.filter(L => L.id !== id && L._id !== id);
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

