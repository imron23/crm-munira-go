/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  AI LEAD SCORING ENGINE — Munira CRM                ║
 * ║  Rule-based intelligence untuk rekomendasi CS       ║
 * ╚══════════════════════════════════════════════════════╝
 */

/**
 * Hitung skor lead 0-100 berdasarkan data yang tersedia.
 * Return: { score, grade, color, factors, recommendation, nextAction, urgency }
 */
window.scoreLeadAI = function (L) {
    let score = 0;
    const factors = [];

    // ─── 1. STATUS FOLLOWUP (max 30 poin) ─────────────────
    const statusScores = {
        'Order Complete': 30,
        'DP': 25,
        'Proses FU': 15,
        'Contacted': 10,
        'New Data': 5,
        'Lost': 0,
        'Pembatalan': 0,
        'Pengembalian': 0
    };
    const statusPts = statusScores[L.status_followup] ?? 5;
    score += statusPts;
    if (statusPts >= 15) factors.push({ icon: '✅', text: `Status "${L.status_followup}" menunjukkan ketertarikan tinggi` });
    else if (statusPts > 0) factors.push({ icon: '⚡', text: `Status "${L.status_followup}" — perlu follow-up aktif` });

    // ─── 2. KESIAPAN PASPOR (max 15 poin) ─────────────────
    const pasporVal = (L.kesiapan_paspor || '').toLowerCase();
    if (pasporVal.includes('sudah ada') || pasporVal.includes('already') || pasporVal.includes('punya')) {
        score += 15;
        factors.push({ icon: '📗', text: 'Paspor SUDAH ADA → siap booking kapan saja' });
    } else if (pasporVal.includes('proses') || pasporVal.includes('sedang')) {
        score += 8;
        factors.push({ icon: '📙', text: 'Paspor dalam proses → follow-up setelah paspor jadi' });
    } else if (pasporVal.includes('belum') || pasporVal.includes('tidak')) {
        score += 2;
        factors.push({ icon: '📕', text: 'Paspor belum ada → edukasi urgensi paspor terlebih dahulu' });
    }

    // ─── 3. JUMLAH JAMAAH (max 10 poin) ───────────────────
    const yangBerangkat = (L.yang_berangkat || '').toLowerCase();
    if (yangBerangkat.includes('keluarga') || yangBerangkat.includes('4') || yangBerangkat.includes('5') || yangBerangkat.includes('6')) {
        score += 10;
        factors.push({ icon: '👨‍👩‍👧‍👦', text: 'Berangkat KELUARGA → potensi nilai transaksi besar' });
    } else if (yangBerangkat.includes('3')) {
        score += 7;
        factors.push({ icon: '👥', text: 'Berangkat 3 orang → potensi baik' });
    } else if (yangBerangkat.includes('2')) {
        score += 5;
        factors.push({ icon: '👫', text: 'Berangkat 2 orang → potensi sedang' });
    } else if (yangBerangkat.includes('1') || yangBerangkat.includes('sendiri')) {
        score += 3;
        factors.push({ icon: '🧑', text: 'Berangkat sendiri → tetap potensi' });
    }

    // ─── 4. PAKET PILIHAN (max 10 poin) ───────────────────
    const paket = (L.paket_pilihan || '').toLowerCase();
    if (paket.includes('vip') || paket.includes('premium') || paket.includes('furoda')) {
        score += 10;
        factors.push({ icon: '💎', text: 'Paket VIP/Premium → calon jamaah high-value' });
    } else if (paket.includes('plus') || paket.includes('turki') || paket.includes('dubai')) {
        score += 7;
        factors.push({ icon: '🌟', text: `Paket "${L.paket_pilihan}" → minat paket unggulan` });
    } else if (paket.includes('reguler') || paket.includes('regular')) {
        score += 4;
        factors.push({ icon: '📦', text: 'Paket reguler → bisa upsell ke paket yang lebih baik' });
    } else if (paket) {
        score += 3;
        factors.push({ icon: '📋', text: `Paket: ${L.paket_pilihan}` });
    }

    // ─── 5. RENCANA KEBERANGKATAN (max 10 poin) ──────────
    const rencana = (L.rencana_umrah || '').toLowerCase();
    const now = new Date();
    const month = now.getMonth() + 1;
    if (rencana.includes('tahun ini') || rencana.includes(now.getFullYear().toString())) {
        score += 10;
        factors.push({ icon: '🗓️', text: 'Rencana berangkat TAHUN INI → urgensi sangat tinggi!' });
    } else if (rencana.includes('bulan ini') || rencana.includes('segera') || rencana.includes('asap')) {
        score += 10;
        factors.push({ icon: '🔥', text: 'Rencana SEGERA → prioritas utama!' });
    } else if (rencana.includes('tahun depan') || rencana.includes((now.getFullYear() + 1).toString())) {
        score += 5;
        factors.push({ icon: '📅', text: 'Rencana tahun depan → nurture leads' });
    } else if (rencana) {
        score += 3;
        factors.push({ icon: '🕐', text: `Rencana: "${L.rencana_umrah}"` });
    }

    // ─── 6. RESPONS TIME / STAGNASI (max 10 poin / penalti) ─
    const lastUpdate = L.updated_at ? new Date(L.updated_at) : new Date(L.created_at);
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / 86400000;
    const history = L.status_history || [];
    const statusChanges = history.length;

    if (daysSinceUpdate <= 1) {
        score += 10;
        factors.push({ icon: '⚡', text: 'Fresh lead — diupdate hari ini/kemarin' });
    } else if (daysSinceUpdate <= 3) {
        score += 7;
        factors.push({ icon: '🟢', text: `Diupdate ${Math.floor(daysSinceUpdate)} hari lalu` });
    } else if (daysSinceUpdate <= 7) {
        score += 3;
        factors.push({ icon: '🟡', text: `Mulai stagnan (${Math.floor(daysSinceUpdate)} hari tanpa aktivitas)` });
    } else if (daysSinceUpdate > 14) {
        score = Math.max(0, score - 10);
        factors.push({ icon: '🔴', text: `STAGNASI PARAH: ${Math.floor(daysSinceUpdate)} hari tanpa update!` });
    }

    // ─── 7. SUMBER IKLAN (max 5 poin) ─────────────────────
    const source = (L.utm_source || '').toLowerCase();
    if (source.includes('facebook') || source.includes('fb')) {
        score += 4;
    } else if (source.includes('instagram') || source.includes('ig')) {
        score += 4;
    } else if (source.includes('google')) {
        score += 5;
        factors.push({ icon: '🔍', text: 'Lead dari Google → intent/niat pencarian tinggi' });
    } else if (source.includes('tiktok')) {
        score += 3;
    } else if (!source || source.includes('organic')) {
        score += 3;
    }

    // ─── 8. CATATAN / INDIKASI KETERTARIKAN ───────────────
    const catatan = (L.catatan || '').toLowerCase();
    const positiveKeywords = ['serius', 'siap', 'mau', 'bisa', 'fix', 'deal', 'transfer', 'dp', 'bayar', 'oke', 'ok', 'setuju', 'berminat', 'tertarik', 'pasti'];
    const negativeKeywords = ['tidak', 'belum', 'batal', 'nanti', 'pikir', 'mahal', 'cancel', 'ghost', 'tidak bisa'];
    const positiveHits = positiveKeywords.filter(k => catatan.includes(k));
    const negativeHits = negativeKeywords.filter(k => catatan.includes(k));
    if (positiveHits.length > 0) {
        score += Math.min(5, positiveHits.length * 2);
        factors.push({ icon: '💰', text: `Catatan menunjukkan sinyal POSITIF: "${positiveHits.join(', ')}"` });
    }
    if (negativeHits.length > 0) {
        score = Math.max(0, score - negativeHits.length * 3);
        factors.push({ icon: '⚠️', text: `Catatan ada sinyal negatif: "${negativeHits.join(', ')}"` });
    }

    // ─── FINAL SCORE ───────────────────────────────────────
    score = Math.min(100, Math.max(0, Math.round(score)));

    // ─── GRADE ─────────────────────────────────────────────
    let grade, color, gradeBg, emoji;
    if (score >= 80) {
        grade = 'HOT'; color = '#EF4444'; gradeBg = 'rgba(239,68,68,0.12)'; emoji = '🔥';
    } else if (score >= 60) {
        grade = 'WARM'; color = '#F97316'; gradeBg = 'rgba(249,115,22,0.12)'; emoji = '🌡️';
    } else if (score >= 40) {
        grade = 'COOL'; color = '#3B82F6'; gradeBg = 'rgba(59,130,246,0.12)'; emoji = '💧';
    } else {
        grade = 'COLD'; color = '#64748B'; gradeBg = 'rgba(100,116,139,0.12)'; emoji = '🧊';
    }

    // ─── RECOMMENDATION LOGIC ──────────────────────────────
    let recommendation = '';
    let nextAction = '';
    let urgency = 'normal'; // normal | high | urgent

    const st = L.status_followup;

    if (st === 'Order Complete' || st === 'DP') {
        recommendation = 'Jamaah sudah closing! Pastikan semua dokumen lengkap, jadwalkan briefing keberangkatan, dan minta testimoni/referral.';
        nextAction = '📋 Kirim checklist dokumen · 🎉 Minta testimoni · 👥 Minta referral teman/keluarga';
        urgency = 'normal';
    } else if (st === 'Lost') {
        const lostReason = (L.lost_reason || catatan).toLowerCase();
        if (lostReason.includes('budget') || lostReason.includes('mahal')) {
            recommendation = 'Lead hilang karena budget. Tawarkan paket cicilan atau program early bird 3-6 bulan ke depan. Simpan nomor untuk follow-up promosi.';
            nextAction = '💳 Tawarkan cicilan/installment · 📩 Tambahkan ke list promosi · ⏰ Follow-up 3 bulan lagi';
        } else if (lostReason.includes('kompetitor') || lostReason.includes('travel lain')) {
            recommendation = 'Lead memilih travel lain. Kirim pesan perpisahan yang hangat dan ikhlas — buka peluang referral di masa depan. Simpan relasi.';
            nextAction = '💌 Kirim pesan perpisahan hangat · 📱 Simpan di daftar warmup future';
        } else if (lostReason.includes('ghost') || lostReason.includes('respon')) {
            recommendation = 'Lead tidak merespons. Coba 1-2x lagi dengan template pesan berbeda. Jika masih tidak respons, masukkan ke list "long game" untuk follow-up 1 bulan.';
            nextAction = '📲 Coba template WA alternatif · 📅 Jadwalkan follow-up 30 hari lagi';
        } else {
            recommendation = 'Lead statusnya Lost. Pelajari penyebabnya dan simpan insight ini untuk perbaikan pitch ke depan.';
            nextAction = '📊 Catat alasan lose · 🗂️ Arsipkan dengan tag alasan';
        }
        urgency = 'normal';
    } else if (score >= 70) {
        recommendation = `Lead HOT! Paspor ${pasporVal.includes('sudah') ? 'sudah ada' : 'perlu disiapkan'}. Jadwalkan closing call HARI INI. Tawarkan paket terbaik sesuai minat (${L.paket_pilihan || 'sesuaikan'}). Gunakan sense of urgency: kuota & harga terbatas!`;
        nextAction = '☎️ Telepon/video call SEGERA · 💎 Presentasikan paket HOT · 📝 Kirim link booking';
        urgency = 'urgent';
    } else if (score >= 50) {
        recommendation = `Lead WARM. Sudah ada ketertarikan, belum closing. ${pasporVal.includes('belum') ? 'Bantu arahkan proses paspor sambil jaga hubungan. ' : ''}Kirim konten edukatif (video Mekkah/Madinah, testimonial jamaah), dan jadwalkan reminder follow-up 2-3 hari lagi.`;
        nextAction = '📩 Kirim konten edukatif · 🎥 Share video/testimoni · 📅 Reminder FU 2-3 hari lagi';
        urgency = 'high';
    } else if (score >= 30) {
        recommendation = `Lead masih COOL. Perlu warming up. Kirim template WA perkenalan hangat, tanyakan kabar dan apakah ada pertanyaan soal umrah. Jangan push closing dulu, fokus bangun kepercayaan.`;
        nextAction = '💬 Sapa dengan template WA "Kabar" · 🤝 Bangun kepercayaan · 🗓️ Follow-up pasif 1x seminggu';
        urgency = 'normal';
    } else {
        recommendation = `Lead COLD. ${daysSinceUpdate > 14 ? `Sudah ${Math.floor(daysSinceUpdate)} hari tidak ada aktivitas! ` : ''}Data minim, respons negatif, atau informasi tidak lengkap. Coba 1x lagi dengan pesan fresh, jika tidak respons, jadikan lead "archived" dan hemat energi untuk lead HOT lain.`;
        nextAction = '📩 Kirim 1 pesan terakhir · 🗃️ Pertimbangkan arsip jika tidak respons';
        urgency = 'low';
    }

    return { score, grade, color, gradeBg, emoji, factors, recommendation, nextAction, urgency, daysSinceUpdate: Math.floor(daysSinceUpdate) };
};

/**
 * Render panel AI ke dalam accordion lead.
 * Dipanggil oleh renderLeadsTable atau toggleAccordion.
 */
window.renderAIScore = function (L) {
    const ai = scoreLeadAI(L);
    const pct = ai.score;
    const { grade, color, gradeBg, emoji, factors, recommendation, nextAction, urgency, daysSinceUpdate } = ai;

    const urgencyBadge = urgency === 'urgent'
        ? `<span style="background:#EF4444;color:#fff;font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:20px;letter-spacing:0.5px;animation:pulse 1.5s infinite;">URGENT</span>`
        : urgency === 'high'
            ? `<span style="background:#F59E0B;color:#000;font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:20px;">HIGH</span>`
            : '';

    const factorsHtml = factors.slice(0, 5).map(f =>
        `<div style="display:flex;align-items:flex-start;gap:6px;font-size:0.75rem;color:var(--text-primary);padding:3px 0;">
            <span>${f.icon}</span>
            <span>${f.text}</span>
        </div>`
    ).join('');

    return `
    <div style="
        background:${gradeBg};
        border:1px solid ${color}44;
        border-left:3px solid ${color};
        border-radius:var(--radius-md);
        padding:14px 16px;
        position:relative;
        overflow:hidden;
    ">
        <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:${color}08;border-radius:0 0 0 80px;"></div>

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.3rem;">${emoji}</span>
                <div>
                    <div style="font-weight:800;font-size:0.9rem;color:${color};letter-spacing:0.5px;">AI SCORE: ${grade}</div>
                    <div style="font-size:0.65rem;color:var(--text-secondary);">Munira Lead Intelligence</div>
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:2rem;font-weight:900;color:${color};line-height:1;">${pct}</div>
                <div style="font-size:0.65rem;color:var(--text-secondary);">/ 100</div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div style="background:rgba(0,0,0,0.1);border-radius:20px;height:6px;margin-bottom:12px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:20px;transition:width 0.6s ease;"></div>
        </div>

        ${urgencyBadge ? `<div style="margin-bottom:10px;">${urgencyBadge}</div>` : ''}

        <!-- Factors -->
        <div style="margin-bottom:12px;padding:10px;background:rgba(0,0,0,0.08);border-radius:8px;">
            <div style="font-size:0.7rem;font-weight:700;color:${color};margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">⚙️ Faktor Penilaian</div>
            ${factorsHtml || '<div style="font-size:0.75rem;color:var(--text-secondary);">Data lead belum lengkap</div>'}
        </div>

        <!-- Recommendation -->
        <div style="background:rgba(0,0,0,0.08);border-radius:8px;padding:10px;margin-bottom:10px;">
            <div style="font-size:0.7rem;font-weight:700;color:var(--text-secondary);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;">🤖 Rekomendasi CS</div>
            <div style="font-size:0.8rem;color:var(--text-primary);line-height:1.5;">${recommendation}</div>
        </div>

        <!-- Next Action -->
        <div style="border-top:1px dashed ${color}44;padding-top:10px;">
            <div style="font-size:0.7rem;font-weight:700;color:${color};margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">📌 Aksi Berikutnya</div>
            <div style="font-size:0.78rem;color:var(--text-primary);line-height:1.6;">${nextAction}</div>
        </div>

        ${daysSinceUpdate > 7 ? `
        <div style="margin-top:8px;padding:6px 10px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.72rem;color:#EF4444;font-weight:600;">
            ⏰ Tidak ada aktivitas selama ${daysSinceUpdate} hari — segera hubungi!
        </div>` : ''}
    </div>`;
};

// CSS animation for pulse
if (!document.getElementById('ai-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'ai-pulse-style';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.75; transform: scale(0.97); }
        }
    `;
    document.head.appendChild(style);
}
