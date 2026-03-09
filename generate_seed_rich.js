const fs = require('fs');

const statuses = ['New Data', 'Contacted', 'Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost'];

const notesByStatus = {
    'New Data': [
        "Data baru masuk dari FB Ads Landing Page Liburan.",
        "Lead masuk organik via pencarian Google.",
        "Mendaftar dari IG Ads paket Umroh Plus Turki."
    ],
    'Contacted': [
        "Sudah ditelepon tapi tidak diangkat, sudah saya kirimkan template sapaan awal ke WA. Belum dibaca.",
        "Ditelepon dan tersambung. Bapaknya sedang sibuk, minta dihubungi lagi besok jam 10 pagi.",
        "Sudah kirimkan e-brosur ke WhatsApp, centang dua biru tapi belum ada balasan.",
        "Dihubungi via WA, merespon 'siap' namun belum membaca detail paket yang dikirim.",
        "Sudah ditelepon, ibu ini sangat antusias menanyakan paket untuk keberangkatan awal tahun depan."
    ],
    'Proses FU': [
        "Lagi saya bantu hitungkan rincian budget untuk 4 orang rombongan keluarga. Menunggu konfirmasi dari suami.",
        "Sedang membandingkan dengan penawaran travel sebelah. Saya berikan simulasi cicilan tanpa bunga.",
        "Tertarik dengan paket Plus Dubai. Masih bingung apakah mau ambil kamar Quad atau Double. Sudah diberi penjelasan beda fasilitas.",
        "Paspor belum ada sama sekali. Sudah saya arahkan mendaftar antrian M-Paspor online dan siap saya bantu pandu.",
        "CS sedang mengedukasi paket VIP Furoda karena budget mereka memadai. Mengirimkan video testimoni keberangkatan grup VIP kemarin.",
        "Berjanji ingin transfer tapi masih menunggu pencairan dana dari kantornya."
    ],
    'Kirim PPL/Dokumen': [
        "Form aplikasi pendaftaran sudah diisi lengkap. Sedang menunggu KTP dan KK jamaah.",
        "Scan paspor dan buku vaksin sudah masuk ke kotak masuk email. Sedang divalidasi.",
        "Semua kelengkapan dokumen telah diterima, saya minta jamaah untuk segera melunasi uang muka pendaftaran.",
        "Dokumen beres. Tinggal menunggu bukti transfer untuk diinput ke dalam sistem manifest."
    ],
    'DP': [
        "Alhamdulillah, DP Rp 5.000.000 sudah ditransfer atas nama ibu tersebut. Kuitansi sudah diterbitkan.",
        "DP sudah masuk via Virtual Account. Sisa pelunasan dijanjikan akhir bulan depan setelah panen.",
        "Telah menyerahkan uang tunai ke kantor sebagai DP, kuitansi fisik sudah diberikan. Seat sudah diamankan."
    ],
    'Order Complete': [
        "Pelunasan komplit! Rp 32.500.000 sudah masuk. Proses cetak ID Card jamaah sedang berjalan.",
        "Tanda terima pelunasan sudah keluar. Tinggal tunggu jadwal pengiriman koper dan perlengkapan dari gudang.",
        "Semua persiapan selesai. Jamaah fix berangkat di rombongan 15 Oktober. Terus menjaga silaturahmi untuk info manasik."
    ],
    'Lost': [
        "Budget jauh dari yang diharapkan (minta diskon ekstrem). Lost.",
        "Ternyata sudah membayar DP di travel kompetitor karena CS kompetitor lebih cepat merespon.",
        "Ghosting total, di-WA tidak dibalas, ditelepon direject. Setelah ditelaah, mungkin cuma nomor fiktif/ingin iseng.",
        "Gagal berangkat karena sakit keras/alasan keluarga mendadak."
    ]
};

function getRandomNote(status) {
    const list = notesByStatus[status] || ["Update status manual"];
    return list[Math.floor(Math.random() * list.length)];
}

let sql = '';

for (let i = 0; i < 200; i++) {
    const rand = Math.random();
    let finalStatus = 'New Data';
    if (rand < 0.25) finalStatus = 'Order Complete';      // 25% complete
    else if (rand < 0.35) finalStatus = 'DP';             // 10% DP
    else if (rand < 0.65) finalStatus = 'Lost';           // 30% lost
    else if (rand < 0.85) finalStatus = 'Proses FU';      // 20% proses fu
    else finalStatus = 'Contacted';                       // 15% contacted

    let currentStatusIndex = statuses.indexOf(finalStatus);
    if (currentStatusIndex === -1) currentStatusIndex = 0;

    let history = [];
    let dateStr = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).getTime();

    // Always start with new data
    history.push({
        status: 'New Data',
        changed_by: 'system',
        changed_by_name: 'System Otoriter',
        catatan: getRandomNote('New Data'),
        changed_at: new Date(dateStr).toISOString()
    });

    // Step through the paths
    const path = [];
    if (finalStatus !== 'New Data') {
        path.push('Contacted');
        if (['Proses FU', 'Kirim PPL/Dokumen', 'DP', 'Order Complete', 'Lost'].includes(finalStatus)) {
            path.push('Proses FU');
            if (Math.random() > 0.4) {
                path.push('Proses FU'); // Multiple FU
            }
        }
        if (['Kirim PPL/Dokumen', 'DP', 'Order Complete'].includes(finalStatus)) {
            if (Math.random() > 0.3) path.push('Kirim PPL/Dokumen');
        }
        if (['DP', 'Order Complete'].includes(finalStatus)) {
            path.push('DP');
        }
        if (finalStatus === 'Order Complete') path.push('Order Complete');
        if (finalStatus === 'Lost') path.push('Lost');
    }

    // Assign admin name
    const admins = ["Andi Surya", "Nisa Kamil", "Agus Setiawan", "Rini Indah"];
    const adminName = admins[Math.floor(Math.random() * admins.length)];

    for (let j = 0; j < path.length; j++) {
        dateStr = dateStr + Math.floor(Math.random() * 48) * 3600000 + 1000000; // Add 0-48 hours
        history.push({
            status: path[j],
            changed_by: 'admin1',
            changed_by_name: adminName,
            catatan: getRandomNote(path[j]),
            changed_at: new Date(dateStr).toISOString()
        });
    }

    const historyJson = JSON.stringify(history).replace(/'/g, "''");

    const finalLeadStatus = history[history.length - 1].status;
    const finalCatatan = history[history.length - 1].catatan.replace(/'/g, "''");

    // Convert current ms time to ISO string
    const finalDate = new Date(dateStr).toISOString();

    sql += `
WITH CTE_${i} AS (
    SELECT id FROM leads ORDER BY created_at ASC OFFSET ${i} LIMIT 1
)
UPDATE leads SET 
    status_followup = '${finalLeadStatus}',
    status_history = '${historyJson}'::jsonb,
    catatan = '${finalCatatan}',
    updated_at = '${finalDate}'
FROM CTE_${i}
WHERE leads.id = CTE_${i}.id;
`;

}

fs.writeFileSync('update_200.sql', sql);
console.log("SQL successfully written to update_200.sql");
