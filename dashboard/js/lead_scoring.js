// ============================================================
// AI / ML-LITE LEAD SCORING & RECOMMENDATION ENGINE
// ============================================================

/**
 * Menganalisa sebuah Lead berdasarkan data variabel-variabel yang tersedia dan historical log.
 * Mengembalikan objek berisi:
 * - score: Nilai bobot (0 - 100) merepresentasikan potensinya (Hot, Warm, Cold)
 * - label: "🔥 Hot Lead", "🌟 Warm Lead", "❄️ Cold Lead", "🛑 Stagnant", "🚨 Critical Risk"
 * - color: Kode warna untuk UI (Hex)
 * - recommendation: Rekomendasi teks / actionable insight untuk CS
 * - reasons: Array alasan mengapa skor tersebut didapatkan.
 */
function analyzeLead(lead) {
    let score = 50; // Base score
    const reasons = [];
    let recommendation = "";

    // 1. Tipe Paket (High Ticket vs Low Ticket)
    const paket = (lead.paket_pilihan || '').toLowerCase();
    if (paket.includes('plus') || paket.includes('premium') || paket.includes('vip') || paket.includes('dubai') || paket.includes('mesir') || paket.includes('turki') || paket.includes('aqsa')) {
        score += 15;
        reasons.push("Mencari paket premium/kombinasi (High Value).");
    } else if (paket.includes('hemat') || paket.includes('promo')) {
        score -= 5;
        reasons.push("Mencari paket promo (Sensitif terhadap harga).");
    }

    // 2. Jumlah Pax (Rombongan / Grup)
    const paxStr = (lead.yang_berangkat || '').toLowerCase();
    const paxMatch = paxStr.match(/\d+/);
    let pax = 1;
    if (paxMatch) {
        pax = parseInt(paxMatch[0]);
    } else if (paxStr.includes('berdua') || paxStr.includes('pasangan') || paxStr.includes('suami istri')) {
        pax = 2;
    } else if (paxStr.includes('keluarga') || paxStr.includes('rombongan')) {
        pax = 4;
    }

    if (pax > 1 && pax < 5) {
        score += 10;
        reasons.push(`Berangkat rombongan kecil/keluarga (${pax} pax).`);
    } else if (pax >= 5) {
        score += 20;
        reasons.push(`Berangkat grup/rombongan besar (${pax} pax)! Sangat potensial.`);
    }

    // 3. Status Saat Ini dan Usia Lead (Ketepatan Waktu Follow Up)
    const now = new Date();
    const createdAt = new Date(lead.created_at || now);
    const ageInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    // Cari kapan terakhir update
    let lastUpdateAt = createdAt;
    if (lead.status_history && lead.status_history.length > 0) {
        lastUpdateAt = new Date(lead.status_history[lead.status_history.length - 1].changed_at);
    }
    const daysSinceLastUpdate = Math.floor((now - lastUpdateAt) / (1000 * 60 * 60 * 24));

    if (lead.status_followup === 'New Data') {
        if (ageInDays < 1) {
            score += 20;
            reasons.push("Data sangat segar (< 24 jam). Response secepatnya untuk winning rate tertinggi!");
            recommendation = "Call atau sapa via WhatsApp SEKARANG. Konversi paling tinggi terjadi di 15 menit pertama.";
        } else if (ageInDays >= 1 && ageInDays <= 3) {
            score -= 10;
            reasons.push("Data mulai basi (New Data belum disentuh > 1 hari).");
            recommendation = "Segera hubungi, lead ini mulai melupakan brand Anda / mungkin sudah dihubungi travel kompetitor.";
        } else {
            score -= 25;
            reasons.push(`Lead terabaikan selama ${ageInDays} hari lebih.`);
            recommendation = "Data sudah dingin (cold). Kirimkan pesan promo jaring-jaring atau sapaan halus 'Maaf baru merespon...'.";
        }
    } else if (lead.status_followup === 'Contacted') {
        if (daysSinceLastUpdate >= 2) {
            score -= 15;
            reasons.push("Berhenti di tahap 'Contacted' terlalu lama.");
            recommendation = "Coba follow up kedua: tanyakan kendalanya, tawarkan e-brosur, atau pancing dengan urgensi diskon terbatas.";
        } else {
            score += 5;
            reasons.push("Sudah dikontak. Menunggu balasan hangat.");
            recommendation = "Jaga ritme percakapan. Jangan terlalu agresif, bangun relasi yang baik (Consultative Selling).";
        }
    } else if (lead.status_followup === 'Proses FU') {
        score += 10;
        reasons.push("Lead sedang dalam proses komunikasi aktif.");
        if (daysSinceLastUpdate > 4) {
            score -= 20;
            reasons.push("Interaksi menggantung / ghosting (> 4 hari).");
            recommendation = "Tampaknya prospect ghosting. Pancing dengan kalimat: 'Apakah Bapak/Ibu berniat menunda keberangkatan?' (Takeaway close methodology).";
        } else {
            recommendation = "Gali keberatan utamanya (budget/jadwal?). Ajak telepon / tawarkan pertemuan jika berlokasi dekat.";
        }
    } else if (lead.status_followup === 'Kirim PPL/Dokumen') {
        score += 25;
        reasons.push("Sudah di tahap pengurusan dokumen.");
        recommendation = "Fokus untuk memandu pengumpulan kelengkapan dokumen (Paspor/KK/dll) dan dorong edukasi pembayaran bertahap/DP.";
    } else if (lead.status_followup === 'DP') {
        score = 95;
        reasons.push("Sudah DP!");
        recommendation = "Lead sudah terikat. Service excellent sangat penting! Follow up dengan update teknis dan jadwal pelunasan.";
    } else if (lead.status_followup === 'Order Complete') {
        score = 100;
        reasons.push("Deal / Order Complete.");
        recommendation = "Pertahankan hubungan pasca-closing untuk potensi Referensi / Repeat Order grup nantinya.";
    } else if (lead.status_followup === 'Lost' || lead.status_followup === 'Invalid' || lead.status_followup === 'Pembatalan' || lead.status_followup === 'Pengembalian') {
        score = 0;
        reasons.push("Lead berstatus Gagal/Hilang/Batal.");
        recommendation = "Jangan dihapus. Masukkan ke daftar 'Recycle / Retargeting Campaign' untuk ditawari promo di bulan-bulan sepi (Low Season).";
    }

    // 4. Analisa Sumber (Ads vs Organic)
    const source = (lead.utm_source || '').toLowerCase();
    if (source.includes('cpc') || source.includes('ads') || source.includes('meta')) {
        // Ads usually implies higher intent but faster drop-off
        reasons.push("Datang dari Iklan Berbayar. Biaya akuisisi tinggi.");
    } else if (source.includes('organic') || source.includes('referral') || source.includes('word of mouth')) {
        score += 5;
        reasons.push("Datang secara organik / channel gratis. Trust factor cenderung lebih tinggi sejak awal.");
    }

    // Koreksi akhir skor agar rentang ada di 0-100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Klasifikasi Label Berdasarkan Score (Abaikan logika label jika sudah DP/Complete/Lost)
    let label = "☁️ Unscored";
    let color = "#94A3B8";

    if (lead.status_followup === 'Lost' || lead.status_followup === 'Invalid' || lead.status_followup === 'Pembatalan' || lead.status_followup === 'Pengembalian') {
        label = "🛑 Dead / Lost";
        color = "#EF4444";
    } else if (lead.status_followup === 'Order Complete' || lead.status_followup === 'DP') {
        label = "🎯 Closed Won";
        color = "#10B981";
    } else {
        if (score >= 80) {
            label = "🔥 Very Hot / High Intent";
            color = "#EF4444";
        } else if (score >= 60) {
            label = "🌟 Warm Lead";
            color = "#F59E0B";
        } else if (score >= 40) {
            label = "❄️ Cold Lead";
            color = "#3B82F6";
        } else {
            label = "⚠️ Menggantung / Stagnant";
            color = "#64748B";
        }
    }

    return {
        score: score,
        label: label,
        color: color,
        recommendation: recommendation,
        reasons: reasons,
        pax: pax
    };
}

// Attach to window so it's accessible globally
window.analyzeLead = analyzeLead;
