// IMPORT CSV MODULE
// ============================================================
let importParsedData = [];

// Parse CSV text into array of objects
function parseCSV(text) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    // Parse header
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cells = [];
        let inQuote = false, cell = '';
        for (let ch of lines[i]) {
            if (ch === '"') { inQuote = !inQuote; continue; }
            if (ch === ',' && !inQuote) { cells.push(cell.trim()); cell = ''; continue; }
            cell += ch;
        }
        cells.push(cell.trim());
        const row = {};
        headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });
        rows.push(row);
    }
    return rows;
}

// Open Import Modal
document.getElementById('btnImport')?.addEventListener('click', () => {
    importParsedData = [];
    document.getElementById('importFile').value = '';
    document.getElementById('importFileInfo').textContent = '';
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importPreviewTable').innerHTML = '';
    document.getElementById('importResult').style.display = 'none';
    document.getElementById('btnDoImport').disabled = true;
    document.getElementById('importOverlay').classList.add('active');
});

document.getElementById('importClose')?.addEventListener('click', () => {
    document.getElementById('importOverlay').classList.remove('active');
});

// CSV file picker handler
document.getElementById('importFile')?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        document.getElementById('importFileInfo').textContent = '⚠️ Hanya file .csv yang didukung';
        return;
    }
    document.getElementById('importFileInfo').textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const reader = new FileReader();
    reader.onload = (e) => {
        importParsedData = parseCSV(e.target.result);
        if (!importParsedData.length) {
            document.getElementById('importFileInfo').textContent += ' — Tidak ada data valid ditemukan!';
            document.getElementById('btnDoImport').disabled = true;
            return;
        }
        document.getElementById('importFileInfo').textContent += ` — ${importParsedData.length} baris data ditemukan`;
        document.getElementById('btnDoImport').disabled = false;

        // Preview (first 5 rows)
        const preview = importParsedData.slice(0, 5);
        const headers = Object.keys(preview[0]);
        const previewHtml = `
            <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                <thead>
                    <tr style="background:var(--bg-app);">
                        ${headers.map(h => `<th style="padding:6px 8px; text-align:left; color:var(--text-secondary); white-space:nowrap;">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${preview.map(row => `
                        <tr style="border-top:1px solid var(--border);">
                            ${headers.map(h => `<td style="padding:6px 8px; color:var(--text-primary); white-space:nowrap;">${row[h] || '-'}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        document.getElementById('importPreviewTable').innerHTML = previewHtml;
        document.getElementById('importPreview').style.display = 'block';
    };
    reader.readAsText(file);
});

// Download template CSV
window.downloadImportTemplate = async function () {
    try {
        const res = await fetch(`${API_URL}/leads/template`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_import_leads_munira.csv';
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Gagal download template.');
    }
};

// Execute import
document.getElementById('btnDoImport')?.addEventListener('click', async () => {
    if (!importParsedData.length) return;
    const btn = document.getElementById('btnDoImport');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengimport...';

    try {
        const res = await fetch(`${API_URL}/leads/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ leads: importParsedData })
        });
        const data = await res.json();
        const resultEl = document.getElementById('importResult');
        resultEl.style.display = 'block';
        if (data.success) {
            resultEl.style.background = 'rgba(16,185,129,0.1)';
            resultEl.style.border = '1px solid rgba(16,185,129,0.3)';
            resultEl.style.color = '#10B981';
            resultEl.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px;"></i>${data.message}
                ${data.errors && data.errors.length ? `<div style="margin-top:6px; font-size:0.75rem; color:var(--danger);">${data.errors.join('<br>')}</div>` : ''}`;
            showToast(`Import: ${data.imported} lead berhasil ditambahkan ✅`);
            fetchDashboardData();
        } else {
            resultEl.style.background = 'rgba(239,68,68,0.1)';
            resultEl.style.border = '1px solid rgba(239,68,68,0.3)';
            resultEl.style.color = '#EF4444';
            resultEl.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right:8px;"></i>${data.message}`;
        }
    } catch (e) {
        const resultEl = document.getElementById('importResult');
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<i class="fas fa-times-circle"></i> Server error, coba lagi.';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-import"></i> Mulai Import';
    }
});
