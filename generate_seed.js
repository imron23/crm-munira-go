const fs = require('fs');

const statuses = ['New Data', 'Contacted', 'Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost'];

const notesByStatus = {
    'New Data': ["Lead baru masuk dari FB Ads", "Lead terdaftar organik", "Lead dari Google Ads"],
    'Contacted': [
        "Sudah dihubungi, belum nyambung", "Ditelepon tidak diangkat, sudah WA", "Baru dikirim template sapaan",
        "Diangkat, masih tanya brosur", "Sudah kirim e-brosur, nunggu respon"
    ],
    'Proses FU': [
        "CS sedang mengedukasi paket plus", "Calon jamaah minta diskon, dinego", "Menunggu konfirmasi istri/suami",
        "Sangat berminat, tapi paspor belum jadi", "Lagi hitung budget keluarga (4 orang)", "Janji telepon lagi lusa"
    ],
    'Kirim PPL/Dokumen': [
        "Minta dikirimkan list dokumen", "KTP dan KK sudah masuk, menunggu paspor", "Bantu pengurusan paspor minggu depan",
        "Sudah isi form pendaftaran lengkap"
    ],
    'DP': [
        "Telah membayar DP Rp 5jt via transfer BCA", "DP masuk, kuitansi sudah diterbitkan",
        "Sisa pelunasan bulan depan", "Sudah DP, kursi sudah diamankan"
    ],
    'Order Complete': [
        "Pelunasan komplit", "Semua dokumen paspor & vaksin lengkap. Menunggu briefing.", "Jamaah siap berangkat"
    ],
    'Lost': [
        "Budget tidak masuk / kemahalan", "Ternyata sudah booking travel lain", "Ghosting tidak balas lagi", "Gagal karena sakit"
    ]
};

function getRandomNote(status) {
    const list = notesByStatus[status] || ["Update status"];
    return list[Math.floor(Math.random() * list.length)];
}

let sql = '';

for (let i = 0; i < 200; i++) {
    // Generate random transition path
    // Let's decide a final status
    const isWin = Math.random() < 0.2; // 20% order complete
    const isDP = Math.random() < 0.1; // 10% DP
    const isLost = Math.random() < 0.3; // 30% lost
    const isContacted = Math.random() < 0.2; // 20% contacted
    const isProses = Math.random() < 0.2; // 20% proses fu

    let finalStatus = 'New Data';
    if (isWin) finalStatus = 'Order Complete';
    else if (isDP) finalStatus = 'DP';
    else if (isLost) finalStatus = 'Lost';
    else if (isProses) finalStatus = 'Proses FU';
    else if (isContacted) finalStatus = 'Contacted';

    let currentStatusIndex = statuses.indexOf(finalStatus);
    if(currentStatusIndex === -1) currentStatusIndex = 0;

    let history = [];
    let date = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000); // Up to 30 days ago
    
    // Always start with new data
    history.push({
        status: 'New Data',
        changed_by: 'system',
        changed_by_name: 'System',
        catatan: getRandomNote('New Data'),
        changed_at: date.toISOString()
    });

    // Step through the paths
    const path = [];
    if (finalStatus !== 'New Data') {
        path.push('Contacted');
        if (['Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost'].includes(finalStatus)) {
            path.push('Proses FU');
            // sometimes they go back and forth
            if(Math.random() > 0.5) {
                path.push('Proses FU');
            }
        }
        if (['Kirim PPL/Dokumen', 'DP', 'Order Complete'].includes(finalStatus)) {
            if(Math.random() > 0.4) path.push('Kirim PPL/Dokumen');
        }
        if (['DP', 'Order Complete'].includes(finalStatus)) {
            path.push('DP');
        }
        if (finalStatus === 'Order Complete') path.push('Order Complete');
        if (finalStatus === 'Lost') path.push('Lost');
    }

    for (let j = 0; j < path.length; j++) {
        date = new Date(date.getTime() + Math.floor(Math.random() * 48) * 3600000); // Add 0-48 hours
        history.push({
            status: path[j],
            changed_by: 'admin',
            changed_by_name: 'Admin',
            catatan: getRandomNote(path[j]),
            changed_at: date.toISOString()
        });
    }

    const historyJson = JSON.stringify(history).replace(/'/g, "''");
    
    // Randomize the ID assumption? Actually, better to query IDs or just use subqueries
    // Since we need to update existing 200 leads, we can just fetch their IDs and pair them, or generate an update based on row number
    
    // Instead of raw ID, we can do CTE with row number
    const finalLeadStatus = history[history.length - 1].status;
    const finalCatatan = history[history.length - 1].catatan.replace(/'/g, "''");
    
    sql += `
    WITH CTE AS (
        SELECT id FROM leads
        ORDER BY id
        OFFSET ${i} LIMIT 1
    )
    UPDATE leads SET 
        status_followup = '${finalLeadStatus}',
        status_history = '${historyJson}'::jsonb,
        catatan = '${finalCatatan}',
        updated_at = '${date.toISOString()}'
    FROM CTE
    WHERE leads.id = CTE.id;
    `;
}

fs.writeFileSync('update_200.sql', sql);
console.log("SQL generated!");
