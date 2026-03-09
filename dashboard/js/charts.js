// Chart Instance Trackers
var chartTrend = null;
var chartPkg = null;
var chartLostReason = null;
var chartRevenueGauge = null;
var chartTimeOfDay = null;
var chartSpeedToLead = null;

// Monthly Revenue Target saved in localStorage
var monthlyRevenueTarget = parseInt(localStorage.getItem('munira_rev_target') || '2000000000');

window.updateTargetOmset = function () {
    const input = document.getElementById('targetOmsetInput');
    if (!input) return;
    const raw = input.value.replace(/[^0-9]/g, '');
    if (raw) {
        monthlyRevenueTarget = parseInt(raw);
        localStorage.setItem('munira_rev_target', monthlyRevenueTarget);
        // Re-draw with last known revenue
        drawRevenueGauge(window._lastTotalRevRp || 0);
        input.value = '';
    }
};

function drawRevenueGauge(totalRevRp) {
    window._lastTotalRevRp = totalRevRp;
    const ctx = document.getElementById('revenueGaugeChart');
    if (!ctx) return;
    if (chartRevenueGauge) chartRevenueGauge.destroy();

    const target = monthlyRevenueTarget;
    const achieved = Math.min(totalRevRp, target);
    const remaining = Math.max(target - totalRevRp, 0);
    const pct = target > 0 ? Math.min((totalRevRp / target) * 100, 100) : 0;

    // Update text labels
    const curEl = document.getElementById('gaugeCurrentVal');
    const tgtEl = document.getElementById('gaugeTargetVal');
    if (curEl) curEl.textContent = 'Rp ' + totalRevRp.toLocaleString('id-ID');
    if (tgtEl) tgtEl.textContent = `Target: Rp ${target.toLocaleString('id-ID')} (${pct.toFixed(1)}%)`;

    const color = pct >= 100 ? '#10B981' : pct >= 70 ? '#F59E0B' : pct >= 40 ? '#3B82F6' : '#EF4444';

    chartRevenueGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [achieved, remaining],
                backgroundColor: [color, 'rgba(148,163,184,0.1)'],
                borderWidth: 0,
                borderRadius: 6,
                circumference: 270,
                rotation: -135,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '78%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { duration: 1000 }
        }
    });
}

function drawTimeOfDayChart(leadsArray) {
    const ctx = document.getElementById('timeOfDayChart');
    if (!ctx) return;
    if (chartTimeOfDay) chartTimeOfDay.destroy();

    // Hitung lead masuk dan closing per jam
    const hourLeads = new Array(24).fill(0);
    const hourClosing = new Array(24).fill(0);
    leadsArray.forEach(L => {
        if (!L.created_at) return;
        const h = new Date(L.created_at).getHours();
        hourLeads[h]++;
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') {
            hourClosing[h]++;
        }
    });

    const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    chartTimeOfDay = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Lead Masuk',
                    data: hourLeads,
                    backgroundColor: 'rgba(139,92,246,0.5)',
                    borderColor: '#8B5CF6',
                    borderWidth: 1,
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'Closing',
                    data: hourClosing,
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    borderWidth: 2,
                    borderRadius: 4,
                    type: 'line',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#10B981',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: 'var(--text-secondary)', boxWidth: 12, padding: 16 } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)', font: { size: 10 }, maxRotation: 45, autoSkip: true, maxTicksLimit: 12 } },
                y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: 'var(--text-secondary)', precision: 0 } }
            }
        }
    });
}

function drawSpeedToLeadChart(leadsArray) {
    const ctx = document.getElementById('speedToLeadChart');
    if (!ctx) return;
    if (chartSpeedToLead) chartSpeedToLead.destroy();

    // Bucket leads berdasarkan response time
    const buckets = [
        { label: '< 5 Menit', max: 5, leads: [], closed: 0 },
        { label: '5–30 Menit', max: 30, leads: [], closed: 0 },
        { label: '30m–2 Jam', max: 120, leads: [], closed: 0 },
        { label: '2–6 Jam', max: 360, leads: [], closed: 0 },
        { label: '> 6 Jam', max: Infinity, leads: [], closed: 0 },
    ];

    leadsArray.forEach(L => {
        if (!L.status_history || L.status_history.length === 0 || !L.created_at) return;
        const firstFU = L.status_history.find(h => h.status !== 'New Data');
        if (!firstFU) return;
        const responseMin = (new Date(firstFU.changed_at) - new Date(L.created_at)) / 60000;
        if (responseMin <= 0) return;

        const bucket = buckets.find(b => responseMin <= b.max);
        if (!bucket) return;
        bucket.leads.push(L);
        if (L.status_followup === 'Order Complete' || L.status_followup === 'DP') bucket.closed++;
    });

    const labels = buckets.map(b => b.label);
    const cvrData = buckets.map(b => b.leads.length > 0 ? parseFloat(((b.closed / b.leads.length) * 100).toFixed(1)) : 0);
    const countData = buckets.map(b => b.leads.length);

    chartSpeedToLead = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Win Rate (%)',
                    data: cvrData,
                    backgroundColor: cvrData.map(v => v >= 30 ? 'rgba(16,185,129,0.8)' : v >= 15 ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.75)'),
                    borderRadius: 6,
                    borderWidth: 0,
                    yAxisID: 'yCVR',
                    order: 1
                },
                {
                    label: 'Jumlah Lead',
                    data: countData,
                    type: 'line',
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99,102,241,0.1)',
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#6366F1',
                    fill: true,
                    yAxisID: 'yCount',
                    order: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: 'var(--text-secondary)', boxWidth: 12, padding: 16 } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ctx.dataset.label === 'Win Rate (%)' ? `Win Rate: ${ctx.raw}%` : `Lead: ${ctx.raw}`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)', font: { size: 11 } } },
                yCVR: { beginAtZero: true, max: 100, position: 'left', ticks: { color: '#10B981', callback: v => v + '%' }, grid: { color: 'rgba(148,163,184,0.08)' } },
                yCount: { beginAtZero: true, position: 'right', ticks: { color: '#6366F1', precision: 0 }, grid: { display: false } }
            }
        }
    });
}

function drawLostReasonChart(reasonMap) {
    const ctx = document.getElementById('lostReasonChart');
    if (!ctx) return;

    if (chartLostReason) chartLostReason.destroy();

    const labels = Object.keys(reasonMap);
    const data = Object.values(reasonMap);

    if (labels.length === 0) {
        // Dummy datanya kosong
        labels.push('Belum ada data');
        data.push(1);
        ctx.getContext('2d').globalAlpha = 0.2;
    } else {
        ctx.getContext('2d').globalAlpha = 1.0;
    }

    chartLostReason = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#8B5CF6', '#64748B'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: "'Inter', sans-serif" } } }
            }
        }
    });
}

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

    const statusOrder = ['New Data', 'Contacted', 'Proses FU', 'DP', 'Order Complete', 'Lost'];
    const statusColors = ['#2563ea', '#9333EA', '#3B82F6', '#F59E0B', '#16a34a', '#DC2626'];
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

