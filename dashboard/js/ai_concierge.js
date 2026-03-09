/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AI SENIOR CONCIERGE — Munira CRM                               ║
 * ║  Pembuat pesan follow-up WhatsApp yang personal & empatik       ║
 * ║  3 Tone: Spiritual | Solusi | Urgency                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────────
// HELPER: Determine sapaan by age or name heuristic
// ─────────────────────────────────────────────────
function _concierge_getSapaan(namaLengkap, usia) {
    const age = parseInt(usia) || 0;
    const name = (namaLengkap || '').trim().split(' ')[0];

    // Coba tebak gender dari nama depan (heuristic sederhana)
    const femaleMarkers = ['siti', 'nur', 'rina', 'wati', 'dewi', 'sri', 'yuli', 'ani', 'fifi', 'nisa', 'layla', 'zahra', 'aisyah', 'fatimah', 'rahma', 'indah', 'putri', 'rini', 'lina', 'tini', 'mira', 'fitri'];
    const firstNameLower = name.toLowerCase();
    const isFemale = femaleMarkers.some(m => firstNameLower.includes(m));

    if (age > 0 && age < 35) {
        return isFemale ? `Mbak ${name}` : `Mas ${name}`;
    } else if (age >= 35 && age <= 55) {
        return isFemale ? `Ibu ${name}` : `Bapak ${name}`;
    } else if (age > 55) {
        return isFemale ? `Ibu ${name}` : `Bapak ${name}`;
    }

    // Fallback: gunakan guessTitleFromName jika tersedia
    if (typeof window.guessTitleFromName === 'function') {
        return `${window.guessTitleFromName(namaLengkap)} ${name}`;
    }
    return `Bapak/Ibu ${name}`;
}

// ─────────────────────────────────────────────────
// HELPER: Describe family group
// ─────────────────────────────────────────────────
function _concierge_getKeluargaText(yangBerangkat, jamaahUsiaDetail) {
    if (!yangBerangkat) return null;

    // Coba parse dari jamaahUsiaDetail jika ada
    let detail = '';
    try {
        const jud = typeof jamaahUsiaDetail === 'string'
            ? JSON.parse(jamaahUsiaDetail)
            : jamaahUsiaDetail;
        if (jud && Array.isArray(jud) && jud.length > 0) {
            const roles = jud.map(j => j.hubungan || j.role || j.label || '').filter(Boolean);
            if (roles.length > 0) {
                detail = roles.join(', ');
            }
        }
    } catch (e) { /* skip */ }

    const raw = yangBerangkat.toLowerCase();
    const num = parseInt(raw.match(/\d+/)?.[0]) || 0;

    if (detail) return `rombongan ${detail}`;
    if (raw.includes('sendiri')) return 'sendiri';
    if (num >= 4) return `sekeluarga (${num} orang)`;
    if (num === 3) return 'bertiga (keluarga kecil)';
    if (num === 2) return 'berdua';
    if (raw.includes('keluarga')) return 'sekeluarga';
    if (raw.includes('istri') || raw.includes('suami')) return 'bersama pasangan';
    return yangBerangkat;
}

// ─────────────────────────────────────────────────
// HELPER: Format rencana keberangkatan
// ─────────────────────────────────────────────────
function _concierge_getRencanaText(rencanaUmrah) {
    if (!rencanaUmrah) return 'dalam waktu dekat';
    const r = rencanaUmrah.toLowerCase();
    if (r.includes('tahun ini') || r.includes('2025') || r.includes('2026')) return `tahun ini (${rencanaUmrah})`;
    if (r.includes('segera') || r.includes('asap')) return 'secepatnya';
    if (r.includes('ramadan') || r.includes('ramadhan')) return 'di bulan Ramadhan';
    if (r.includes('tahun depan')) return 'tahun depan';
    return rencanaUmrah;
}

// ─────────────────────────────────────────────────
// HELPER: Paspor context
// ─────────────────────────────────────────────────
function _concierge_getPasporContext(kesiapanPaspor) {
    const p = (kesiapanPaspor || '').toLowerCase();
    if (p.includes('sudah') || p.includes('punya') || p.includes('ada')) {
        return { status: 'sudah', text: 'Alhamdulillah paspor sudah siap 🌟', action: null };
    } else if (p.includes('proses') || p.includes('sedang')) {
        return { status: 'proses', text: 'paspor masih dalam proses', action: 'Tim kami siap membantu memantau proses paspor hingga selesai.' };
    } else if (p.includes('belum') || p.includes('tidak')) {
        return { status: 'belum', text: 'paspor belum disiapkan', action: 'Jangan khawatir, tim kami bisa mendampingi proses pembuatan paspor dari awal hingga selesai.' };
    }
    return { status: 'unknown', text: '', action: null };
}

// ─────────────────────────────────────────────────
// HELPER: Pain point dari harapan
// ─────────────────────────────────────────────────
function _concierge_getHarapanText(fasilitasUtama) {
    if (!fasilitasUtama) return null;
    const h = fasilitasUtama.toLowerCase();
    if (h.includes('hotel') || h.includes('dekat')) return { pain: 'kemudahan akses ke Masjidil Haram', solution: 'Hotel kami berjarak sangat dekat dari Masjidil Haram, sehingga ibadah menjadi lebih khusyuk dan tidak menguras tenaga.' };
    if (h.includes('harga') || h.includes('murah') || h.includes('cicil') || h.includes('biaya')) return { pain: 'keterjangkauan biaya', solution: 'Kami menyediakan opsi cicilan fleksibel yang bisa disesuaikan dengan kemampuan finansial, tanpa biaya tersembunyi.' };
    if (h.includes('muthawwif') || h.includes('pembimbing')) return { pain: 'bimbingan ibadah yang berkualitas', solution: 'Tim muthawwif kami berpengalaman dan selalu mendampingi jamaah 24 jam selama di Tanah Suci.' };
    if (h.includes('nyaman') || h.includes('fasilitas')) return { pain: 'kenyamanan perjalanan', solution: 'Seluruh fasilitas kami dirancang untuk memberikan kenyamanan maksimal, dari transportasi, akomodasi, hingga konsumsi.' };
    if (h.includes('grup') || h.includes('rombongan') || h.includes('keluarga')) return { pain: 'perjalanan bersama keluarga', solution: 'Kami menyediakan paket keluarga dengan fasilitas khusus sehingga seluruh anggota keluarga bisa beribadah dengan nyaman.' };
    return { pain: fasilitasUtama, solution: 'Tim kami siap mewujudkan harapan tersebut sebaik-baiknya.' };
}

// ─────────────────────────────────────────────────
// HELPER: Analyze funnel stage
// ─────────────────────────────────────────────────
function _concierge_getStageContext(statusFollowUp, catatan, statusHistory) {
    const st = statusFollowUp || 'New Data';
    const note = (catatan || '').toLowerCase();
    const lastHistory = (statusHistory || []).slice(-1)[0];
    const lastNote = lastHistory ? (lastHistory.catatan || '') : '';

    if (st === 'New Data') return { stage: 'new', intro: 'Alhamdulillah, kami baru saja menerima informasi dari', continuity: '' };
    if (st === 'Contacted') return { stage: 'followup', intro: 'Menyambung komunikasi kita sebelumnya,', continuity: lastNote ? `mengenai ${lastNote.substring(0, 50)}` : '' };
    if (st === 'Proses FU') return { stage: 'followup', intro: 'Dalam rangka melanjutkan diskusi kita,', continuity: '' };
    if (st === 'Kirim PPL/Dokumen') return { stage: 'followup', intro: 'Setelah dokumen yang kami kirimkan,', continuity: '' };
    if (st === 'DP') return { stage: 'dp', intro: 'Alhamdulillah, selamat bergabung! Setelah down payment diterima,', continuity: '' };
    if (st === 'Order Complete') return { stage: 'complete', intro: 'Persiapan keberangkatan semakin dekat,', continuity: '' };
    if (st === 'Pembatalan' || st === 'Lost') return { stage: 'reengagement', intro: 'Kami memahami setiap keputusan,', continuity: '' };
    return { stage: 'followup', intro: 'Menyambung komunikasi kita,', continuity: '' };
}

// ─────────────────────────────────────────────────
// CORE ENGINE: Generate 3 Tone Messages
// ─────────────────────────────────────────────────
window.generateConciergeMessages = function (L, csName) {
    const nama = L.nama_lengkap || 'Calon Jamaah';
    const sapaan = _concierge_getSapaan(nama, L.usia || 0);
    const csNickname = csName || localStorage.getItem('cs_nickname') || 'Konsultan Munira World';
    const keluarga = _concierge_getKeluargaText(L.yang_berangkat, L.jamaah_usia_detail);
    const rencana = _concierge_getRencanaText(L.rencana_umrah);
    const paspor = _concierge_getPasporContext(L.kesiapan_paspor);
    const harapan = _concierge_getHarapanText(L.fasilitas_utama);
    const paket = L.paket_pilihan || 'Umrah';
    const domisili = L.domisili || '';
    const stageCtx = _concierge_getStageContext(L.status_followup, L.catatan, L.status_history);

    // Keluarga sentence
    const keluargaSentence = keluarga && keluarga !== 'sendiri'
        ? `Rencana keberangkatan ${sapaan} ${keluarga} insya Allah ${rencana} — sungguh niat yang mulia.`
        : `Rencana keberangkatan ${sapaan} insya Allah ${rencana}.`;

    // Paspor paragraph
    const pasporParagraph = paspor.action
        ? `Terkait persiapan, kami lihat ${paspor.text}. ${paspor.action}`
        : paspor.text ? `${paspor.text}.` : '';

    // ── TONE A: SPIRITUAL & HEART-TOUCHING ──
    let toneA = '';
    if (stageCtx.stage === 'new') {
        toneA = `Assalamu'alaikum warahmatullahi wabarakatuh, ${sapaan} 🌙

Alhamdulillah, kami sangat bahagia menerima kabar niat mulia ${sapaan} untuk menuju Baitullah${domisili ? ` dari ${domisili}` : ''}.

${keluargaSentence}

Di balik setiap langkah menuju Ka'bah, tersimpan doa dan pengorbanan yang luar biasa. Munira World hadir bukan sekadar sebagai biro perjalanan, tapi sebagai teman perjalanan spiritual yang akan mendampingi ${sapaan} dari persiapan hingga kepulangan.

${pasporParagraph}

Semoga Allah subhanahu wa ta'ala memudahkan setiap langkah persiapan ${sapaan}. Apakah ada hal yang ingin ${sapaan} tanyakan atau sampaikan kepada kami?

Wassalamu'alaikum,
_${csNickname}_`;

    } else if (stageCtx.stage === 'dp') {
        toneA = `Assalamu'alaikum warahmatullahi wabarakatuh, ${sapaan} 🌙

Alhamdulillah, selamat! Langkah pertama ${sapaan} menuju Baitullah telah resmi dimulai. Semoga ini menjadi awal yang penuh keberkahan.

Kami di Munira World akan senantiasa mendampingi ${sapaan} hingga momen pelukan di Masjidil Haram tiba. Insya Allah, perjalanan ini akan menjadi kenangan terindah dalam hidup ${sapaan}.

Untuk langkah selanjutnya, tim kami akan segera menghubungi ${sapaan} mengenai kelengkapan dokumen. Mohon untuk bersiap, ya 😊

Semoga Allah meridhoi setiap niat dan persiapan kita. Aamiin ya Rabbal 'alamin.

Wassalamu'alaikum,
_${csNickname}_`;

    } else if (stageCtx.stage === 'reengagement') {
        toneA = `Assalamu'alaikum warahmatullahi wabarakatuh, ${sapaan} 🌙

Kami dari Munira World ingin menyapa ${sapaan} dengan penuh ketulusan. Kami memahami bahwa setiap keputusan membutuhkan waktu dan pertimbangan yang matang.

Rindu kepada Baitullah itu fitrah. Dan kami yakin, di hati ${sapaan} masih ada kerinduan yang sama untuk hadir di sana.

Jika suatu saat ${sapaan} siap kembali berdiskusi, kami selalu ada. Tidak ada paksaan, hanya ketulusan untuk membantu perjalanan spiritual terindah dalam hidup.

Semoga Allah selalu menjaga ${sapaan} dan keluarga. 🤲

Wassalamu'alaikum,
_${csNickname}_`;

    } else {
        toneA = `Assalamu'alaikum warahmatullahi wabarakatuh, ${sapaan} 🌙

Semoga ${sapaan} dan keluarga selalu dalam lindungan Allah subhanahu wa ta'ala. Aamiin.

Kami dari Munira World kembali hadir dengan penuh ketulusan, menyambung perjalanan diskusi kita${domisili ? ` di ${domisili}` : ''}.

${keluargaSentence}

Kerinduan kepada Baitullah adalah panggilan yang tak ternilai harganya. Kami di sini bukan sekadar membantu logistik perjalanan, tapi menjadi teman setia yang akan mendampingi setiap langkah ibadah ${sapaan}.

${pasporParagraph}

${harapan ? `Kami sangat memperhatikan harapan ${sapaan} mengenai ${harapan.pain}. ${harapan.solution}` : ''}

Adakah pertanyaan atau kekhawatiran yang ingin ${sapaan} sampaikan? Kami siap mendengarkan dan membantu 😊

Wassalamu'alaikum,
_${csNickname}_`;
    }

    // ── TONE B: SOLUTION & SERVICE ORIENTED ──
    let toneB = '';
    if (stageCtx.stage === 'new') {
        toneB = `Assalamu'alaikum, ${sapaan} 👋

Terima kasih sudah mendaftar di program *${paket}* Munira World${domisili ? ` dari ${domisili}` : ''}!

${keluargaSentence}

Berikut informasi awal yang perlu ${sapaan} ketahui:

📋 *Status Paspor:* ${paspor.text || 'Belum dikonfirmasi'}
${paspor.action ? `✅ ${paspor.action}` : ''}

${harapan ? `🌟 *Fasilitas Unggulan:* ${harapan.solution}` : ''}

🗓️ *Rencana Keberangkatan:* ${rencana}

Tim kami siap mendampingi ${sapaan} dari persiapan dokumen, paspor, visa, hingga keberangkatan dan kepulangan. _Full service, no worries!_

Apakah ada dokumen atau informasi yang bisa kami bantu siapkan sekarang?

Salam hangat,
_${csNickname}_`;

    } else if (stageCtx.stage === 'followup') {
        toneB = `Assalamu'alaikum, ${sapaan} 📋

Menyambung komunikasi kita sebelumnya — kami dari tim Munira World ingin memastikan semua kebutuhan ${sapaan} sudah terpenuhi.

${pasporParagraph}

${harapan ? `🎯 *Solusi untuk ${sapaan}:*\n${harapan.solution}` : ''}

💼 *Paket yang diminati:* ${paket}
👥 *Peserta:* ${keluarga || 'Belum dikonfirmasi'}
📅 *Target keberangkatan:* ${rencana}

Tim kami bisa membantu proses ini dari A sampai Z — paspor, visa, manasik, hingga akomodasi. ${sapaan} cukup bersiap lahir dan batin untuk ibadah yang khusyuk.

Ada hal spesifik yang perlu kami jelaskan atau bantu persiapkan hari ini?

Salam hangat,
_${csNickname}_`;

    } else if (stageCtx.stage === 'dp') {
        toneB = `Assalamu'alaikum, ${sapaan} 🎉

*Alhamdulillah, selamat bergabung dengan keluarga besar jamaah Munira World!*

Berikut langkah selanjutnya yang perlu ${sapaan} siapkan:

📄 *Dokumen yang diperlukan:*
• Fotokopi KTP & Kartu Keluarga
• Fotokopi Paspor (jika sudah ada)
• Foto background putih 4x6
• Buku nikah (jika berangkat bersama keluarga)

📲 Tim kami akan menghubungi ${sapaan} dalam 1x24 jam untuk konfirmasi jadwal dan pengiriman dokumen.

Apakah ada pertanyaan yang bisa kami bantu jelaskan?

Salam,
_${csNickname}_`;

    } else if (stageCtx.stage === 'complete') {
        toneB = `Assalamu'alaikum, ${sapaan} ✈️

Persiapan keberangkatan ${sapaan} semakin dekat! Kami ingin memastikan semua sudah siap.

📋 *Checklist Pra-Keberangkatan:*
✅ Dokumen perjalanan (paspor, visa) — sudah di tangan
✅ Manasik umrah — jadwal segera diinformasikan
✅ Perlengkapan ihram — cek ukuran
✅ Kesehatan & vaksinasi meningitis

🕋 Insya Allah, perjalanan ${sapaan} akan penuh keberkahan.

Ada yang ingin dikonfirmasi atau ditanyakan?

Salam,
_${csNickname}_`;

    } else {
        toneB = `Assalamu'alaikum, ${sapaan} 📋

Kami dari Munira World ingin memastikan semua kebutuhan dan pertanyaan ${sapaan} sudah terjawab.

${pasporParagraph ? `📌 ${pasporParagraph}` : ''}
${harapan ? `✨ *Fasilitas sesuai harapan ${sapaan}:* ${harapan.solution}` : ''}

Paket *${paket}* yang ${sapaan} minati mencakup layanan full-service dengan pendampingan profesional dari tim kami.

Ada dokumen atau informasi yang bisa kami bantu hari ini?

Salam,
_${csNickname}_`;
    }

    // ── TONE C: GENTLE REMINDER (URGENCY) ──
    const now = new Date();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonth = monthNames[now.getMonth()];
    const nextMonth = monthNames[(now.getMonth() + 1) % 12];

    let toneC = '';
    if (stageCtx.stage === 'reengagement') {
        toneC = `Assalamu'alaikum, ${sapaan} 🌙

Semoga ${sapaan} dan keluarga selalu sehat dan bahagia.

Kami ingin menyampaikan bahwa *kuota paket ${paket} untuk keberangkatan ${rencana} tinggal beberapa slot saja*. Kami tidak ingin ${sapaan} kehilangan kesempatan emas ini.

Jika ada yang membuat ${sapaan} ragu sebelumnya — entah soal paspor, biaya, atau jadwal — mari kita diskusikan bersama. Insya Allah ada solusinya. 😊

Kuota kami terbatas, dan kami ingin memastikan ${sapaan} mendapatkan tempat terbaik. Apakah ${sapaan} masih berminat?

Salam hangat,
_${csNickname}_`;

    } else {
        toneC = `Assalamu'alaikum, ${sapaan} ⏰

Kami ingin mengingatkan ${sapaan} dengan lembut mengenai rencana berangkat pada *${rencana}*.

🔔 *Update Terkini:*
• Kuota paket *${paket}* untuk keberangkatan ${rencana} *tersisa terbatas*
• Proses pengajuan visa memerlukan waktu minimal 3-4 minggu${paspor.status === 'belum' ? '\n• Paspor perlu segera diproses agar tidak terlewat' : ''}
• Semakin awal mendaftar, semakin banyak pilihan kamar/jadwal

⚡ Untuk memastikan ${sapaan} mendapatkan slot dan harga terbaik, kami sarankan untuk konfirmasi sebelum akhir bulan *${currentMonth}* ini.

Apakah ${sapaan} sudah siap untuk melanjutkan ke langkah berikutnya? Kami siap membantu hari ini! 😊

Wassalamu'alaikum,
_${csNickname}_`;
    }

    return {
        toneA: toneA.trim(),
        toneB: toneB.trim(),
        toneC: toneC.trim(),
        meta: {
            sapaan,
            stage: stageCtx.stage,
            keluarga,
            rencana,
            pasporStatus: paspor.status,
            harapan: harapan?.pain || null
        }
    };
};

// ─────────────────────────────────────────────────
// UI RENDERER: Render AI Concierge Panel inside waPanel
// ─────────────────────────────────────────────────
window.renderConciergePanel = function (L) {
    const container = document.getElementById('aiConciergeBox');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:0.85rem;">
            <i class="fas fa-robot" style="font-size:2rem; margin-bottom:8px; display:block; opacity:0.3;"></i>
            Klik <strong>✨ Generate</strong> untuk membuat 3 variasi pesan follow-up personal.
        </div>
    `;

    // Store lead reference for generation
    container._currentLead = L;
};

window.generateAndShowConcierge = async function () {
    const container = document.getElementById('aiConciergeBox');
    if (!container || !container._currentLead) {
        showToast('Pilih lead terlebih dahulu sebelum generate pesan.', 'error');
        return;
    }

    const L = container._currentLead;
    const csName = localStorage.getItem('cs_nickname') || '';

    // Show loading
    container.innerHTML = `
        <div style="text-align:center; padding:24px; color:var(--text-secondary);">
            <i class="fas fa-spinner fa-spin" style="font-size:1.5rem; margin-bottom:8px; display:block; color:var(--brand);"></i>
            <span style="font-size:0.85rem;">Menganalisis profil jamaah dan membuat pesan (didukung AI)...</span>
        </div>
    `;

    try {
        const response = await fetch('/api/ai/concierge/' + L.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const resData = await response.json();

        if (resData.success && resData.data) {
            _renderConciergeResult(container, resData.data, L);
        } else {
            const fallback = window.generateConciergeMessages(L, csName);
            _renderConciergeResult(container, fallback, L);
        }
    } catch (err) {
        const fallback = window.generateConciergeMessages(L, csName);
        _renderConciergeResult(container, fallback, L);
    }
};

function _renderConciergeResult(container, result, L) {
    const stageLabels = {
        'new': '🆕 New Data',
        'followup': '📞 Follow-up',
        'dp': '🎉 DP / Closing',
        'complete': '✈️ Order Complete',
        'reengagement': '💌 Re-engagement'
    };
    const stageLabel = stageLabels[result.meta.stage] || result.meta.stage;

    let prefIcons = '';
    if (L.preferences) {
        if (L.preferences.pref_small_group) prefIcons += '<span title="Grup Eksklusif">👥</span> ';
        if (L.preferences.pref_audio_guide) prefIcons += '<span title="Audio Guide">🎧</span> ';
        if (L.preferences.pref_handling_bagasi) prefIcons += '<span title="Handling Bagasi">🧳</span> ';
        if (L.preferences.pref_manasik_privat) prefIcons += '<span title="Manasik Privat">📖</span> ';
        if (L.preferences.pref_dokumentasi) prefIcons += '<span title="Dokumentasi">📸</span> ';
    }

    const tones = [
        {
            id: 'toneA',
            icon: '🕌',
            label: 'Menyentuh Hati',
            desc: 'Spiritual & empatik',
            color: '#8B5CF6',
            bg: 'rgba(139,92,246,0.08)',
            border: 'rgba(139,92,246,0.3)',
            text: result.toneA
        },
        {
            id: 'toneB',
            icon: '🛠️',
            label: 'Solusi Teknis',
            desc: 'Informatif & solutif',
            color: '#0891B2',
            bg: 'rgba(8,145,178,0.08)',
            border: 'rgba(8,145,178,0.3)',
            text: result.toneB
        },
        {
            id: 'toneC',
            icon: '⏰',
            label: 'Pengingat Kuota',
            desc: 'Urgency & action',
            color: '#D97706',
            bg: 'rgba(217,119,6,0.08)',
            border: 'rgba(217,119,6,0.3)',
            text: result.toneC
        }
    ];

    // Build tabs HTML
    const tabsHtml = tones.map((t, i) => `
        <button class="concierge-tab-btn${i === 0 ? ' active' : ''}"
            data-tone="${t.id}"
            onclick="switchConciergeTab('${t.id}')"
            style="
                flex:1; padding:8px 4px; border:1px solid ${i === 0 ? t.color : 'var(--border)'};
                border-radius:8px; background:${i === 0 ? t.bg : 'transparent'};
                color:${i === 0 ? t.color : 'var(--text-secondary)'};
                cursor:pointer; font-size:0.7rem; font-weight:600;
                transition:all 0.2s; text-align:center; line-height:1.3;
            "
        >
            <div style="font-size:1rem;">${t.icon}</div>
            ${t.label}
        </button>
    `).join('');

    const panelsHtml = tones.map((t, i) => `
        <div id="concierge-panel-${t.id}" class="concierge-panel" style="display:${i === 0 ? 'flex' : 'none'}; flex-direction:column; gap:8px;">
            <div style="
                font-size:0.68rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase;
                color:${t.color}; display:flex; align-items:center; gap:6px; padding:0 2px;
            ">
                <span>${t.icon}</span> ${t.label} — <span style="font-weight:400; text-transform:none;">${t.desc}</span>
            </div>
            <textarea id="concierge-text-${t.id}"
                style="
                    width:100%; min-height:220px; padding:12px; border:1px solid ${t.border};
                    border-radius:10px; background:rgba(255,255,255,0.97); color:#1a1a2e;
                    font-family:inherit; font-size:0.85rem; line-height:1.6; resize:vertical;
                    outline:none; box-shadow:0 2px 8px rgba(0,0,0,0.06);
                "
            >${t.text}</textarea>
            <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                <button onclick="conciergeUseMessage('${t.id}')"
                    style="
                        padding:7px 14px; background:${t.color}; color:white; border:none;
                        border-radius:8px; cursor:pointer; font-size:0.75rem; font-weight:600;
                        display:flex; align-items:center; gap:5px;
                        transition:filter 0.15s;
                    "
                    onmouseover="this.style.filter='brightness(1.15)'"
                    onmouseout="this.style.filter=''"
                >
                    <i class="fas fa-arrow-right"></i> Pakai Pesan Ini
                </button>
                <button onclick="conciergeCopyText('${t.id}')"
                    style="
                        padding:7px 12px; border:1px solid ${t.border}; background:${t.bg};
                        color:${t.color}; border-radius:8px; cursor:pointer; font-size:0.75rem;
                        font-weight:600; display:flex; align-items:center; gap:5px; transition:all 0.2s;
                    "
                    onmouseover="this.style.opacity='0.8'"
                    onmouseout="this.style.opacity='1'"
                >
                    <i class="far fa-copy"></i> Salin
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <!-- Meta info bar -->
        <div style="
            font-size:0.7rem; color:var(--text-secondary); background:var(--bg-app);
            border-radius:8px; padding:8px 12px; display:flex; gap:12px; flex-wrap:wrap;
            border:1px solid var(--border); margin-bottom:10px;
        ">
            <span>👤 <strong>${result.meta.sapaan}</strong></span>
            <span>📊 Stage: <strong style="color:var(--brand);">${stageLabel}</strong></span>
            ${result.meta.keluarga ? `<span>👥 ${result.meta.keluarga}</span>` : ''}
            ${result.meta.rencana ? `<span>🗓️ ${result.meta.rencana}</span>` : ''}
            ${prefIcons ? `<span>✨ ${prefIcons}</span>` : ''}
        </div>

        <!-- Tabs -->
        <div style="display:flex; gap:6px; margin-bottom:12px;">
            ${tabsHtml}
        </div>

        <!-- Tone Panels -->
        <div id="conciergePanelsWrapper">
            ${panelsHtml}
        </div>

        <!-- Regenerate -->
        <button onclick="generateAndShowConcierge()"
            style="
                width:100%; padding:8px; border:1px dashed var(--border); background:transparent;
                color:var(--text-secondary); border-radius:8px; cursor:pointer; font-size:0.75rem;
                margin-top:8px; transition:all 0.2s;
            "
            onmouseover="this.style.borderColor='var(--brand)'; this.style.color='var(--brand)'"
            onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-secondary)'"
        >
            <i class="fas fa-sync-alt" style="margin-right:4px;"></i> Regenerate Pesan
        </button>
    `;

    // Store reference to tones for tab switching
    container._tones = tones;
}

window.switchConciergeTab = function (toneId) {
    // Hide all panels
    document.querySelectorAll('.concierge-panel').forEach(p => p.style.display = 'none');
    // Show selected
    const panel = document.getElementById('concierge-panel-' + toneId);
    if (panel) panel.style.display = 'flex';

    // Update tab buttons styling
    const container = document.getElementById('aiConciergeBox');
    if (!container || !container._tones) return;

    document.querySelectorAll('.concierge-tab-btn').forEach(btn => {
        const id = btn.getAttribute('data-tone');
        const t = container._tones.find(x => x.id === id);
        if (!t) return;

        if (id === toneId) {
            btn.style.borderColor = t.color;
            btn.style.background = t.bg;
            btn.style.color = t.color;
        } else {
            btn.style.borderColor = 'var(--border)';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-secondary)';
        }
    });
};

window.conciergeUseMessage = function (toneId) {
    const ta = document.getElementById('concierge-text-' + toneId);
    if (!ta) return;
    const waText = document.getElementById('waText');
    if (waText) {
        waText.value = ta.value;
        // Switch back to WA tab
        window.switchWaTab('compose');
        showToast('✅ Pesan dipindahkan ke editor WA!');
    }
};

window.conciergeCopyText = function (toneId) {
    const ta = document.getElementById('concierge-text-' + toneId);
    if (!ta) return;
    navigator.clipboard.writeText(ta.value).then(() => {
        showToast('📋 Pesan disalin!');
    }).catch(() => {
        // Fallback
        ta.select();
        document.execCommand('copy');
        showToast('📋 Pesan disalin!');
    });
};

// ─────────────────────────────────────────────────
// TAB SWITCHER: Between 'compose' and 'concierge'
// ─────────────────────────────────────────────────
window.switchWaTab = function (tabName) {
    const composeArea = document.getElementById('waComposeArea');
    const conciergeArea = document.getElementById('waConciergeArea');
    const tabCompose = document.getElementById('waTabCompose');
    const tabConcierge = document.getElementById('waTabConcierge');

    if (!composeArea || !conciergeArea) return;

    if (tabName === 'compose') {
        composeArea.style.display = 'flex';
        conciergeArea.style.display = 'none';
        if (tabCompose) {
            tabCompose.style.background = '#075E54';
            tabCompose.style.color = 'white';
            tabCompose.style.borderColor = '#075E54';
        }
        if (tabConcierge) {
            tabConcierge.style.background = 'transparent';
            tabConcierge.style.color = 'rgba(255,255,255,0.7)';
            tabConcierge.style.borderColor = 'rgba(255,255,255,0.3)';
        }
    } else {
        composeArea.style.display = 'none';
        conciergeArea.style.display = 'flex';
        if (tabConcierge) {
            tabConcierge.style.background = '#8B5CF6';
            tabConcierge.style.color = 'white';
            tabConcierge.style.borderColor = '#8B5CF6';
        }
        if (tabCompose) {
            tabCompose.style.background = 'transparent';
            tabCompose.style.color = 'rgba(255,255,255,0.7)';
            tabCompose.style.borderColor = 'rgba(255,255,255,0.3)';
        }
    }
};

console.log('✅ AI Concierge Engine loaded — Munira CRM');
