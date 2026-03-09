// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Mockup Entrance
window.addEventListener('load', () => {
    const mockup = document.getElementById('heroMockup');
    if (mockup) mockup.classList.add('active');
});

// Generic Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
    });
});

// Typewriter Effect for Problem Section
const typewriterText = {
    id: "Apakah Iklan Umrah Anda Hanya Menjadi 'Biaya' Tanpa Hasil?",
    en: "Is Your Umrah Ad Budget Just a 'Cost' Without Results?"
};
const typewriterElement = document.getElementById('typewriterHeadline');
let typewriterTimer = null;

function runTypewriter(lang = 'id') {
    if (!typewriterElement) return;
    if (typewriterTimer) clearTimeout(typewriterTimer);
    let i = 0;
    const text = typewriterText[lang] || typewriterText['id'];
    typewriterElement.innerHTML = "";
    function type() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            typewriterTimer = setTimeout(type, 50);
        } else { typewriterTimer = null; }
    }
    type();
}

if (typewriterElement) {
    ScrollTrigger.create({
        trigger: typewriterElement,
        start: "top 80%",
        onEnter: () => {
            const currentLang = localStorage.getItem('munira-lang') || 'id';
            runTypewriter(currentLang);
        },
        once: true
    });
}

// Language Engine (i18n) - Expanded
const translations = {
    id: {
        page_title: "Umrah CRM - Solusi Premium Travel",
        nav_home: "Beranda", nav_features: "Keunggulan", nav_problem: "Solusi", nav_pricing: "Harga",
        hero_badge: "Sistem CRM Tercepat di Indonesia",
        hero_title_1: "Transformasi Digital",
        hero_title_2: "Travel Umrah Premium",
        hero_subtitle: "Kendalikan ribuan jamaah, pantau performa tim real-time, dan tingkatkan konversi iklan Anda dengan teknologi CRM berbasis AI tercanggih.",
        hero_cta_demo: "Jadwalkan Demo Sekarang",
        hero_cta_learn: "Pelajari Fitur",
        card_stats_title: "Konversi Iklan",
        card_users_title: "Total Jamaah",
        label_urgency: "Realitas Pahit",
        prob_1_title: "Bocor Anggaran Iklan",
        prob_1_desc: "Iklan mahal di Meta/Google, tapi Landing Page lemot? Calon jamaah kabur karena loading lambat.",
        prob_2_title: "Blind Management",
        prob_2_desc: "Mengelola database modal scroll WhatsApp? Anda tidak tahu CS mana yang closing atau loyo.",
        prob_3_title: "Database Bocor",
        prob_3_desc: "Karyawan resign sering membawa aset data jamaah Anda. Bangun sistem terpusat sekarang.",
        urgency_footer: "Berhenti Membakar Uang. Saatnya Era Digital Presisi.",
        label_performance: "Fokus Konversi Iklan",
        perf_title: "Iklan Anda Berharga. Jangan Biarkan Kecepatan Membuangnya.",
        speed_wp: "Website WordPress (Konvensional)",
        speed_wp_hint: "User kehilangan minat. Potensi boncos iklan tinggi.",
        speed_munira: "Munira High-Speed Stack",
        speed_munira_hint: "Full Load Instan. Iklan terkonversi jadi Lead berkualitas.",
        label_form: "Optimasi Konversi",
        form_title: "Formulir Progresif: Jangan Biarkan Jamaah Bosan.",
        form_desc: "Kebanyakan LP kehilangan leads karena form yang panjang. Munira menggunakan Progressive Filling.",
        form_f1_t: "Micro-Step Interaction", form_f1_d: "Memecah pertanyaan jadi langkah interaktif.",
        form_f2_t: "Smart Auto-Complete", form_f2_d: "Deteksi wilayah otomatis untuk user.",
        form_f3_t: "30% Konversi Lebih Tinggi", form_f3_d: "Dibuktikan secara teknis meningkatkan jumlah lead.",
        form_try_badge: "COBALAH FORM INI",
        form_s1_label: "Langkah 1: Identitas", form_s1_title: "Informasi Kontak",
        form_name_l: "Nama Lengkap", form_loc_l: "Kecamatan Domisili", form_wa_l: "Nomor WhatsApp",
        form_s2_label: "Langkah 2: Rencana", form_s2_title: "Detail Keberangkatan",
        form_exp_l: "Pernah Umrah?", form_exp_o1: "Pernah", form_exp_o2: "Belum", form_qty_l: "Jumlah Peserta",
        form_s3_title: "Pilihan Paket", form_succ_t: "Pendaftaran Berhasil!", form_succ_d: "Konsultan kami akan segera menghubungi Anda.",
        form_succ_b: "Kembali", form_prev_b: "Kembali", form_next_b: "Selanjutnya",
        label_testimonials: "Testimoni", testi_title: "Dipercaya Oleh Pemilik Travel Premium.",
        testi_1_text: "Dulu pusing pantau 10 CS, sekarang tinggal buka HP. Konversi naik 3x lipat!",
        testi_1_name: "H. Ahmad Fauzi", testi_1_pos: "Owner Travel Jakarta",
        testi_2_text: "Fitur AI-nya juara! Admin baru bisa jawab chat pakai bahasa menyentuh hati.",
        testi_2_name: "Hj. Siti Nurhaliza", testi_2_pos: "Direktur Ops Surabaya",
        testi_3_text: "Keamanan data nomor satu. CS resign, database tetap aman terkunci.",
        testi_3_name: "Ridwan Prasetyo", testi_3_pos: "Owner Travel Bandung",
        testi_4_name: "H. Muhammad Sholeh", testi_4_pos: "Marketing Makassar",
        testi_5_text: "Fitur AI-nya bantu CS saya jawab pertanyaan jamaah dengan bahasa yang sangat sopan. Branding travel kami premium.",
        testi_5_name: "Dian Rahmawati", testi_5_pos: "Head of Digital Medan",
        testi_6_text: "Setup-nya dibantu sampai bisa. Tim support Munira responsif banget, gak dilepas gitu aja. Sangat worth it!",
        testi_6_name: "Hj. Haryati Saputra", testi_6_pos: "Pimpinan Travel Yogyakarta",
        testi_7_text: "Biasanya data jamaah berantakan di Excel. Sekarang terpusat, aman, dan gak bisa dicolong tim yang resign.",
        testi_7_name: "Abdullah Karim", testi_7_pos: "Manager Ops Samarinda",
        testi_8_text: "Integrasi Meta Pixel-nya gampang banget. Saya bisa tau iklan mana yang beneran ngasilin duit, bukan cuma like.",
        testi_8_name: "Laila Nurhasanah", testi_8_pos: "Lead CS Jakarta",
        testi_9_text: "Tampilan mobile-nya keren banget. Jamaah jadi makin percaya kalau travel kami itu profesional.",
        testi_10_name: "Ibu Hikmah", testi_10_pos: "Staff Ops Palembang",
        ov_title: "Dashboard Overview",
        ov_subtitle: "Kendalikan seluruh ekosistem bisnis Anda dalam satu layar intuitif.",
        ov_period: "Periode", ov_apply: "Apply",
        ov_perf: "Performa Umum",
        ov_leads: "Total Leads", ov_leads_d: "dalam periode",
        ov_inq: "Today's Inquiries", ov_inq_d: "hari ini",
        ov_cvr: "CVR % (Closing Rate)", ov_cvr_d: "order / total lead",
        ov_resp: "Avg Response", ov_resp_d: "kecepatan CS follow up",
        ov_sales: "Hasil Penjualan & Revenue",
        ov_deals: "75 deals won", ov_lost_d: "57 tidak closing",
        ov_rev: "Revenue (Rp)", ov_rev_d: "DP + Order Complete",
        ov_recent: "Recent Inquiries",
        ov_lb: "CS Leaderboard",
        tech_label: "The Invisible Powerhouse", tech_subtitle: "Arsitektur Tanpa Kompromi",
        ana_1_t: "Mesin Jet (Golang Engine)", ana_1_d: "Dibuat dengan bahasa yang sama dengan Google. Memproses data ribuan jamaah dalam milidetik—secepat jet tempur yang menembus awan.",
        ana_2_t: "Brankas Pintar (JSONB Storage)", ana_2_d: "Data jamaah Anda disimpan dalam laci digital fleksibel yang tidak pernah penuh. Ia mengenali profil jamaah secara cerdas seperti brankas pintar kelas atas.",
        ana_3_t: "Pelari Tanpa Beban (Vanilla JS)", ana_3_d: "Tanpa beban library berat yang bikin lelet. Munira berlari sangat ringan, memberikan loading instan meskipun sinyal jamaah di lapangan sedang sulit.",
        ana_4_t: "Kecerdasan Abadi (AI Failback)", ana_4_d: "Sistem kecerdasan yang tidak pernah mati. Jika satu otak AI sedang sibuk, cadangannya langsung mengambil alih dalam mikrodetik tanpa Anda sadari.",
        label_advanced: "Teknologi Canggih", advanced_title: "Teknologi Masa Depan,<br>Dalam Kendali Anda.",
        feat_bi_t: "BI Command Center (Real-Time)", feat_bi_d: "Ditenagai Golang Engine untuk pengolahan data ribuan jamaah dalam milidetik. Monitoring ROI Ads & Staff secara instan tanpa lag.",
        feat_stream_t: "LIVE LEADS STREAM", feat_stream_d: "Pantau arus pendaftaran jamaah secara langsung dengan AI Scorer terintegrasi.",
        feat_sec_t: "Munira Shield Architecture", feat_sec_d: "Proteksi data jamaah berlapis yang tidak hanya aman dari hacker, tapi juga dari kebocoran internal.",
        sec_mod_1_t: "AES-256 Encryption", sec_mod_1_s: "Proteksi Tingkat Militer",
        sec_mod_2_t: "DDoS Protection", sec_mod_2_s: "Sistem Pertahanan Enterprise",
        sec_mod_3_t: "Auto Backup", sec_mod_3_s: "Penyimpanan Aman Tiap 6 Jam",
        feat_scale_t: "Infinite Scalability", feat_scale_d: "Siap menangani 1.000 hingga 1.000.000 jamaah tanpa lag. Infrastruktur awan terbaik.",
        feat_cloud_t: "Auto-Cloud Backup", feat_cloud_d: "Data dicadangkan setiap 6 jam secara otomatis ke server global ternama.",
        feat_wa_t: "WA Panel Builder", feat_wa_d: "Rakit template WhatsApp otomatis dengan AI scorer untuk konversi instan.",
        feat_prog_t: "Program Builder", feat_prog_d: "Kelola paket Umrah & Haji dengan sistem drag-and-drop yang intuitif.",
        label_pricing: "Investasi Munira", price_title: "Semua Fitur Premium, Tanpa Batas.",
        price_1_title: "Paket 6 Bulan", price_2_title: "Paket 12 Bulan", price_3_title: "Paket Bulanan",
        price_f_all: "SEMUA FITUR TERMASUK",
        price_f1: "Dashboard Management Real-time",
        price_f2: "High-Speed Landing Page",
        price_f3: "AI Scorer & WhatsApp Analytics",
        price_f4: "Enterprise Data Shield",
        price_f5: "Full AI Concierge 24/7",
        price_f6: "Support Prioritas & Update",
        price_btn: "Pilih Paket",
        price_best: "HEMAT 50%",
        price_btn_best: "Dapatkan Sekarang",
        cta_title: "Siap Transformasi Bisnis?",
        cta_desc: "Dapatkan demo gratis dan lihat masa depan travel Anda.",
        cta_btn: "Jadwalkan Konsultasi Gratis", footer_text: "© 2026 Munira Technology CRM.",
        scarcity_limit: "⚠️ Slot Terbatas: Hanya bersisa 2 dari 10 slot Travel & 1 dari 4 slot Ads Premium bulan ini.",
        cta_scarcity: "Kami hanya menerima level travel tertentu. Amankan slot konsultasi Anda hari ini.",
        proof_title: "Suka dengan Kecepatan & Kemewahan Web Ini?",
        proof_desc: "Website yang sedang Anda buka saat ini adalah bukti nyata teknologi Munira. Bayangkan jika Travel Anda memiliki kecepatan dan kemewahan yang sama—konversi naik, jamaah makin percaya.",
        proof_btn: "Saya Mau Web Seperti Ini",
        label_eco: "Munira Ecosystem", eco_title: "Alur Keberangkatan Digital",
        eco_sos_t: "Social Media", eco_sos_d: "Organic Traffic",
        eco_wa_t: "WA Direct", eco_wa_d: "Direct Inquiries",
        eco_1_t: "Ads Traffic", eco_1_d: "Meta & Google Ads",
        eco_2_t: "Fast LP", eco_2_d: "1.5s Load Time",
        eco_3_t: "AI Scorer", eco_3_d: "Qualify Leads",
        eco_4_t: "CRM Center", eco_4_d: "Manage & Close",
        eco_5_t: "Success", eco_5_d: "Berangkat!",
        tt_sos_t: "Omnichannel Awareness", tt_sos_d: "Tahap awal di mana jamaah menemukan Anda secara organik melalui konten emosional di IG/TikTok. Teknologi Tracking Pixel kami mulai merekam jejak minat mereka.",
        tt_wa_t: "Instant Trust Building", tt_wa_d: "Jamaah menghubungi Anda langsung. Munira API Gateway mencatat durasi respon CS dan mengkategorikan minat jamaah secara otomatis.",
        tt_ads_t: "Precision Scaling", tt_ads_d: "Iklan Meta & Google yang terarah. Kami mengirimkan sinyal balik melalui Conversions API agar biaya iklan Anda semakin murah setiap harinya.",
        tt_lp_t: "The Speed Gatekeeper", tt_lp_d: "Landing Page berbasis Golang & Gin. Kecepatan 1.5 detik memastikan tidak ada jamaah yang hilang karena loading lama—semua iklan terkonversi maksimal.",
        tt_ai_t: "AI Lead Qualifier", tt_ai_d: "Algoritma cerdas yang memisahkan 'penanya iseng' dengan 'calon pembeli'. Admin Anda hanya menerima lead berkualitas tinggi dengan skor niat > 80%.",
        tt_crm_t: "Operational Excellence", tt_crm_d: "Database terpusat di PostgreSQL. Pemilik travel bisa melihat ROI, performa CS, hingga status pembayaran jamaah dalam satu dashboard aman.",
        tt_suc_t: "The Ultimate Success", tt_suc_d: "Jamaah berangkat dengan khusyuk, travel Anda untung besar, dan siklus ini terus berputar secara otomatis. Selamat!",
        modal_prog_title: "Umrah Premium 9 Hari",
        day_1: "H-1", day_1_d: "Keberangkatan: Jakarta - Jeddah. Check-in Hotel Makkah.",
        day_2: "H-2", day_2_d: "Ibadah Umrah Utama (Tawaf, Sa'I, Tahallul).",
        day_3: "H-3", day_3_d: "Ziarah Kota Makkah (Jabal Tsur, Arafah, Mina).",
        day_4: "H-4", day_4_d: "Perbanyak Ibadah Mandiri & Tausiyah Senja.",
        day_5: "H-5", day_5_d: "Menuju Madinah via Kereta Cepat (High Speed Rail).",
        day_6: "H-6", day_6_d: "Ziarah Raudhah & Masjid Nabawi.",
        day_7: "H-7", day_7_d: "Ziarah Kota Madinah (Masjid Quba, Kebun Kurma).",
        day_8: "H-8", day_8_d: "Persiapan Kepulangan & Belanja Oleh-oleh.",
        day_9: "H-9", day_9_d: "Kepulangan: Jeddah - Jakarta. Sampai Jumpa Kembali!",
        label_science: "Science of Selling", sci_title: "Emotional Closing & Deep Tech",
        sci_deep_t: "Deep Dive Analysis", sci_deep_s: "Penjelasan Detail Untuk Orang Awam",
        sci_go_t: "Golang (Go) — Mengapa sangat cepat?", sci_go_d: "Dibuat dengan bahasa Google. Memproses data ribuan jamaah secepat jet tempur.",
        sci_brankas_t: "PostgreSQL & JSONB — Brankas pintar", sci_brankas_d: "Data jamaah disimpan dalam laci digital fleksibel yang tidak pernah penuh.",
        sci_vanilla_t: "Vanilla JS — Rahasia web ringan", sci_vanilla_d: "Munira berlari tanpa beban library berat, memberikan loading instan di mana saja.",
        sci_psych_t: "Emotional Layer (Psikologi Penjualan)",
        sci_emo_1_t: "Spiritual Connection", sci_emo_1_d: "Menyentuh sisi 'Niyat' dan kerinduan jamaah akan Baitullah.",
        sci_emo_2_t: "Solution-Oriented", sci_emo_2_d: "Fokus pada kemudahan fasilitas (Hotel dekat, Bus nyaman).",
        sci_emo_3_t: "Scarcity & Urgency", sci_emo_3_d: "Menciptakan rasa takut kehilangan (FOMO) terhadap sisa kuota.",
        label_faq: "FAQ", faq_title: "Pertanyaan Yang Sering Diajukan",
        faq_1_q: "Apakah saya perlu server sendiri?", faq_1_a: "Tidak perlu. Munira CRM berbasis Cloud (SaaS), semua infrastruktur kami yang kelola.",
        faq_2_q: "Bagaimana jika CS saya awam teknologi?", faq_2_a: "Justru Munira dibuat untuk CS awam. AI Template Builder memudahkan segalanya.",
        faq_3_q: "Apakah data saya aman?", faq_3_a: "Sangat aman. Enkripsi AES-256 dan Staff Data Masking melindungi aset Anda."
    },
    en: {
        page_title: "Umrah CRM - Premium Travel Solutions",
        nav_home: "Home", nav_features: "Features", nav_problem: "Solution", nav_pricing: "Pricing",
        hero_badge: "Indonesia's Fastest CRM System",
        hero_title_1: "Digital Transformation",
        hero_title_2: "Premium Umrah Travel",
        hero_subtitle: "Control thousands of pilgrims, monitor real-time team performance, and boost your ad conversions with advanced AI CRM tech.",
        hero_cta_demo: "Schedule Demo Now",
        hero_cta_learn: "Explore Features",
        card_stats_title: "Ad Conversion",
        card_users_title: "Total Pilgrims",
        label_urgency: "The Bitter Reality",
        prob_1_title: "Leaking Ad Budget",
        prob_1_desc: "Expensive ads but slow site? Potential pilgrims bounce within 3 seconds of loading.",
        prob_2_title: "Blind Management",
        prob_2_desc: "Managing data via WhatsApp scroll? You don't know which CS is closing or slacking.",
        prob_3_title: "Data Leaks",
        prob_3_desc: "When top staff quit, they often take your pilgrim data. Build a centralized system.",
        urgency_footer: "Stop Burning Money. Time for Precision Digital Era.",
        label_performance: "Performance Driven",
        perf_title: "Your Ads Are Valuable. Don't Let Speed Waste Them.",
        speed_wp: "Conventional WordPress Website",
        speed_wp_hint: "Users lose interest. High bounce rates lead to wasted ad spend.",
        speed_munira: "Munira High-Speed Stack",
        speed_munira_hint: "Instant Load. Every ad dollar converts to quality Leads.",
        label_form: "Conversion Flow",
        form_title: "Progressive Forms: Keep Users Engaged.",
        form_desc: "Long forms kill leads. Munira uses Progressive Filling technology.",
        form_f1_t: "Micro-Step Interaction", form_f1_d: "Breaks long questions into interactive steps.",
        form_f2_t: "Smart Auto-Complete", form_f2_d: "Automatic region detection for users.",
        form_f3_t: "30% Higher Conversion", form_f3_d: "Technically proven to increase lead volume.",
        form_try_badge: "TRY THIS FORM",
        form_s1_label: "Step 1: Identity", form_s1_title: "Contact Info",
        form_name_l: "Full Name", form_loc_l: "Sub-district", form_wa_l: "WhatsApp Number",
        form_s2_label: "Step 2: Planning", form_s2_title: "Departure Details",
        form_exp_l: "Been to Umrah?", form_exp_o1: "Yes", form_exp_o2: "No", form_qty_l: "Participants",
        form_s3_title: "Package Choice", form_succ_t: "Registration Success!", form_succ_d: "Our consultants will contact you shortly.",
        form_succ_b: "Back to Home", form_prev_b: "Back", form_next_b: "Next Step",
        label_testimonials: "Testimonials", testi_title: "Trusted by Premium Travel Owners.",
        testi_1_text: "Used to be stressed managing 10 CS, now I just check my phone. Conversion 3x up!",
        testi_1_name: "H. Ahmad Fauzi", testi_1_pos: "Travel Owner Jakarta",
        testi_2_text: "AI feature is a winner! New staff can chat with a heartfelt spiritual tone instantly.",
        testi_2_name: "Hj. Siti Nurhaliza", testi_2_pos: "Ops Director Surabaya",
        testi_3_text: "Data security is #1. CS resign? Database remains safe and locked in our system.",
        testi_3_name: "Ridwan Prasetyo", testi_3_pos: "Travel Owner Bandung",
        testi_4_name: "H. Muhammad Sholeh", testi_4_pos: "Marketing Makassar",
        testi_5_text: "The AI feature helps my CS answer pilgrim questions with very polite language. Our travel branding feels premium.",
        testi_5_name: "Dian Rahmawati", testi_5_pos: "Head of Digital Medan",
        testi_6_text: "The setup was assisted until ready. Munira's support team is very responsive, they don't just leave you.",
        testi_6_name: "Hj. Haryati Saputra", testi_6_pos: "Travel Leader Yogyakarta",
        testi_7_text: "Pilgrim data used to be a mess in Excel. Now it's centralized, safe, and can't be stolen.",
        testi_7_name: "Abdullah Karim", testi_7_pos: "Ops Manager Samarinda",
        testi_8_text: "Meta Pixel integration is super easy. I can see exactly which ads generate money.",
        testi_8_name: "Laila Nurhasanah", testi_8_pos: "Lead CS Jakarta",
        testi_9_text: "The mobile view is stunning. Pilgrims trust us more as a professional travel agency.",
        testi_9_name: "Faisal Ridho", testi_9_pos: "Creative Lead Bandung",
        testi_10_name: "Ibu Hikmah", testi_10_pos: "Ops Staff Palembang",
        ov_title: "Dashboard Overview",
        ov_subtitle: "Control your entire business ecosystem in one intuitive screen.",
        ov_period: "Period", ov_apply: "Apply",
        ov_perf: "General Performance",
        ov_leads: "Total Leads", ov_leads_d: "in period",
        ov_inq: "Today's Inquiries", ov_inq_d: "today",
        ov_cvr: "CVR % (Closing Rate)", ov_cvr_d: "order / total lead",
        ov_resp: "Avg Response", ov_resp_d: "CS follow up speed",
        ov_sales: "Sales & Revenue Results",
        ov_deals: "75 deals won", ov_lost_d: "57 not closing",
        ov_rev: "Revenue (IDR)", ov_rev_d: "DP + Order Complete",
        ov_recent: "Recent Inquiries",
        ov_lb: "CS Leaderboard",
        tech_label: "The Invisible Powerhouse", tech_subtitle: "Uncompromising Architecture",
        ana_1_t: "Fighter Jet (Golang Engine)", ana_1_d: "Built with the same language as Google. Processes thousands of pilgrims in milliseconds.",
        ana_2_t: "Digital Vault (JSONB Storage)", ana_2_d: "Your pilgrim data is stored in flexible digital drawers that never get full.",
        ana_3_t: "Marathon Runner (Vanilla JS)", ana_3_d: "Without heavy libraries. Munira runs light, providing instant loading even on weak signals.",
        ana_4_t: "Eternal Intelligence (AI Failback)", ana_4_d: "Backup brain instantly takes over if the main AI is busy, with zero downtime.",
        label_advanced: "Advanced Technology", advanced_title: "Future Technology,<br>In Your Control.",
        feat_bi_t: "BI Command Center (Real-Time)", feat_bi_d: "Powered by Golang Engine. Instant ROI & Staff monitoring with zero lag.",
        feat_stream_t: "LIVE LEADS STREAM", feat_stream_d: "Monitor live registration flows with integrated AI Lead Scoring.",
        feat_sec_t: "Munira Shield Architecture", feat_sec_d: "Multi-layered protection. Secure from hackers and internal data leaks.",
        sec_mod_1_t: "AES-256 Encryption", sec_mod_1_s: "Military Grade Protection",
        sec_mod_2_t: "DDoS Protection", sec_mod_2_s: "Enterprise Defense System",
        sec_mod_3_t: "Auto Backup", sec_mod_3_s: "Safe Storage Every 6 Hours",
        feat_scale_t: "Infinite Scalability", feat_scale_d: "Ready for 1M pilgrims. Best-in-class cloud infrastructure.",
        feat_cloud_t: "Auto-Cloud Backup", feat_cloud_d: "Data is backed up every 6 hours automatically to global servers.",
        feat_wa_t: "WA Panel Builder", feat_wa_d: "Build automated WhatsApp templates with AI scoring for instant conversion.",
        feat_prog_t: "Program Builder", feat_prog_d: "Manage Umrah & Hajj packages with an intuitive drag-and-drop system.",
        label_pricing: "Munira Investment", price_title: "Unlimited Premium Features.",
        price_1_title: "6 Months Plan", price_2_title: "12 Months Plan", price_3_title: "Monthly Plan",
        price_f_all: "ALL FEATURES INCLUDED",
        price_f1: "Real-time Dashboard Management",
        price_f2: "High-Speed Landing Page",
        price_f3: "AI Scorer & WhatsApp Analytics",
        price_f4: "Enterprise Data Shield",
        price_f5: "Full AI Concierge 24/7",
        price_f6: "Priority Support & Updates",
        price_btn: "Select Plan",
        price_best: "SAVE 50%",
        price_btn_best: "Claim Best Offer",
        cta_title: "Ready to Transform?",
        cta_desc: "Get a free demo and see the future of your travel business.",
        cta_btn: "Schedule Free Consultation", footer_text: "© 2026 Munira Technology CRM.",
        scarcity_limit: "⚠️ Limited Slot: Only 2 of 10 Travel slots & 1 of 4 Premium Ads slots remaining.",
        cta_scarcity: "We only onboard specific travel quality levels. Secure your consultation today.",
        proof_title: "Love the Speed & Luxury of This Website?",
        proof_desc: "This website is a living proof of Munira technology. Speed and premium feel that builds instant trust.",
        proof_btn: "I Want a Website Like This",
        label_eco: "Munira Ecosystem", eco_title: "The Digital Journey Flow",
        eco_sos_t: "Social Media", eco_sos_d: "Organic Traffic",
        eco_wa_t: "WA Direct", eco_wa_d: "Direct Inquiries",
        eco_1_t: "Ads Traffic", eco_1_d: "Meta & Google Ads",
        eco_2_t: "Fast LP", eco_2_d: "1.5s Load Time",
        eco_3_t: "AI Scorer", eco_3_d: "Qualify Leads",
        eco_4_t: "CRM Center", eco_4_d: "Manage & Close",
        eco_5_t: "Success", eco_5_d: "Departure!",
        tt_sos_t: "Omnichannel Awareness", tt_sos_d: "The initial stage where pilgrims find you organically through IG/TikTok content. Our Tracking Pixel technology records their interest journey from day one.",
        tt_wa_t: "Instant Trust Building", tt_wa_d: "Direct connections via WhatsApp. Munira API Gateway tracks CS response times and automatically categorizes pilgrim intent.",
        tt_ads_t: "Precision Scaling", tt_ads_d: "Targeted Meta & Google ads. We feed signals back via Conversions API to reduce your ad costs day by day through smart machine learning.",
        tt_lp_t: "The Speed Gatekeeper", tt_lp_d: "Landing Pages built on Golang & Gin. 1.5s loading ensures no pilgrims are lost while waiting—maximizing every dollar of your ad spend.",
        tt_ai_t: "AI Lead Qualifier", tt_ai_d: "Intelligent algorithms separating casual lookers from serious bookers. Your admins only handle high-quality leads with intent scores over 80%.",
        tt_crm_t: "Operational Excellence", tt_crm_d: "Centralized PostgreSQL database. Monitor ROI, CS performance, and payment statuses in one secure real-time dashboard.",
        tt_suc_t: "The Ultimate Success", tt_suc_d: "Pilgrims depart with peace of mind, your agency thrives, and the cycle continues automatically. Congratulations!",
        modal_prog_title: "Premium Umrah 9 Days",
        day_1: "D-1", day_1_d: "Departure: Jakarta - Jeddah. Makkah Hotel Check-in.",
        day_2: "D-2", day_2_d: "Main Umrah Rituals (Tawaf, Sa'I, Tahallul).",
        day_3: "D-3", day_3_d: "Makkah City Tour (Jabal Tsur, Arafah, Mina).",
        day_4: "D-4", day_4_d: "Spiritual Self-Enrichment & Evening Tausiyah.",
        day_5: "D-5", day_5_d: "Travel to Madinah via High Speed Rail.",
        day_6: "D-6", day_6_d: "Raudhah Visit & Nabawi Mosque Prayer.",
        day_7: "D-7", day_7_d: "Madinah City Tour (Quba Mosque, Date Farm).",
        day_8: "D-8", day_8_d: "Departure Preparation & Souvenir Shopping.",
        day_9: "D-9", day_9_d: "Return: Jeddah - Jakarta. See You Again!",
        label_science: "Science of Selling", sci_title: "Emotional Closing & Deep Tech",
        sci_deep_t: "Deep Dive Analysis", sci_deep_s: "Detailed Layman Explanation",
        sci_go_t: "Golang (Go) — Why so fast?", sci_go_d: "Built with Google's language. Processes thousands of pilgrims in milliseconds.",
        sci_brankas_t: "PostgreSQL & JSONB — Digital Vault", sci_brankas_d: "Pilgrim data is stored in flexible drawers that never get full.",
        sci_vanilla_t: "Vanilla JS — Light Web Secret", sci_vanilla_d: "Munira runs light without heavy libraries, providing instant loading.",
        sci_psych_t: "Emotional Layer (Sales Psychology)",
        sci_emo_1_t: "Spiritual Connection", sci_emo_1_d: "Touching the 'Niyat' and pilgrim's longing for Baitullah.",
        sci_emo_2_t: "Solution-Oriented", sci_emo_2_d: "Focus on facility convenience (Nearby Hotels, Comfortable Bus).",
        sci_emo_3_t: "Scarcity & Urgency", sci_emo_3_d: "Creating smart urgency for faster decision making.",
        label_faq: "FAQ", faq_title: "Frequently Asked Questions",
        faq_1_q: "Do I need my own server?", faq_1_a: "No. Munira CRM is Cloud-based (SaaS), we manage all infrastructure.",
        faq_2_q: "What if my staff is non-technical?", faq_2_a: "Munira is built for everyone. AI Template Builder makes it effortless.",
        faq_3_q: "Is my data secure?", faq_3_a: "Absolutely. AES-256 encryption and Staff Data Masking protect your assets."
    }
};

function setLanguage(lang) {
    localStorage.setItem('munira-lang', lang);
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.innerText = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) { el.innerHTML = translations[lang][key]; }
    });
    if (typewriterElement && typewriterElement.innerHTML !== "") runTypewriter(lang);
}

document.getElementById('langToggle')?.addEventListener('click', () => {
    const currentLang = localStorage.getItem('munira-lang') || 'id';
    setLanguage(currentLang === 'id' ? 'en' : 'id');
    gsap.from('#langToggle', { scale: 0.8, duration: 0.4, ease: "back.out(2)" });
});

// Testimonial Drag Logic
const slider = document.getElementById('testiSlider');
let isDown = false; let startX; let scrollLeft;
if (slider) {
    slider.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mouseup', () => isDown = false);
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; e.preventDefault();
        const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk;
    });
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('munira-lang') || 'id';
    setLanguage(savedLang);
    const savedTheme = localStorage.getItem('munira-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
});

// Theme Engine
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
function setTheme(mode) {
    const icon = themeToggle?.querySelector('i');
    if (mode === 'dark') { body.classList.add('dark-mode'); if (icon) icon.className = 'fas fa-moon'; }
    else { body.classList.remove('dark-mode'); if (icon) icon.className = 'fas fa-sun'; }
    localStorage.setItem('munira-theme', mode);
}

themeToggle?.addEventListener('click', () => {
    const newMode = body.classList.contains('dark-mode') ? 'light' : 'dark';
    gsap.to(body, { opacity: 0.8, duration: 0.2, onComplete: () => { setTheme(newMode); gsap.to(body, { opacity: 1, duration: 0.4 }); } });
    gsap.from(themeToggle, { scale: 0.8, rotation: -90, duration: 0.5, ease: "back.out(2)" });
});

// Fireworks / Confetti Celebration - Premium Style
function celebrateBestValue() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#0d5c4b', '#d4af37', '#ffffff']
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#0d5c4b', '#d4af37', '#ffffff']
        }));
    }, 250);
}

// Add event listeners to pricing buttons
document.querySelectorAll('.price-box .btn-glow').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.closest('.price-box').classList.contains('featured')) {
            celebrateBestValue();
        }
        setTimeout(() => {
            document.getElementById('forms').scrollIntoView({ behavior: 'smooth' });
        }, 800);
    });
});

// Interactive Speed Bar Animation - Narrative Storytelling
const revealBars = document.querySelectorAll('.reveal-bar');
revealBars.forEach(bar => {
    const isMunira = bar.classList.contains('success');
    gsap.to(bar, {
        width: bar.getAttribute('data-width'),
        duration: isMunira ? 1.0 : 4.0, // Munira is fast, WP is agonizingly slow
        ease: isMunira ? "power4.out" : "linear",
        scrollTrigger: {
            trigger: bar,
            start: "top 90%"
        },
        delay: isMunira ? 0 : 0.5 // Start WP slightly later to emphasize frustration
    });
});

// Progressive Form Login Restored
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const formSteps = document.querySelectorAll('.form-step');
const stepLines = document.querySelectorAll('.step-line');
const stepNums = document.querySelectorAll('.step-num');
let currentFormStep = 0;

function updateForm() {
    formSteps.forEach((s, i) => s.style.display = i === currentFormStep ? 'block' : 'none');
    stepLines.forEach((l, i) => {
        l.classList.toggle('active', i < currentFormStep);
        l.style.background = i < currentFormStep ? 'var(--primary)' : 'var(--border-light)';
    });
    stepNums.forEach((n, i) => {
        n.classList.toggle('active', i <= currentFormStep);
    });
    if (prevBtn) prevBtn.style.visibility = currentFormStep === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.display = currentFormStep === formSteps.length - 1 ? 'none' : 'block';
}

nextBtn?.addEventListener('click', () => {
    if (currentFormStep < formSteps.length - 1) {
        currentFormStep++; updateForm();
        gsap.fromTo(formSteps[currentFormStep], { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.6 });
    }
});

prevBtn?.addEventListener('click', () => {
    if (currentFormStep > 0) {
        currentFormStep--; updateForm();
        gsap.fromTo(formSteps[currentFormStep], { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6 });
    }
});

// Autocomplete Wilayah
(function () {
    const inp = document.getElementById('eDomisili');
    const dd = document.getElementById('eDomisiliDropdown');
    if (!inp || !dd) return;
    const API_BASE = '/api';
    let timer;
    inp.addEventListener('input', () => {
        const q = inp.value.trim(); if (q.length < 3) { dd.style.display = 'none'; return; }
        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/wilayah/search?q=${encodeURIComponent(q)}`);
                const json = await res.json();
                const results = json.data || [];
                if (!results.length) { dd.innerHTML = '<div style="padding:15px; color:#888;">No results</div>'; }
                else {
                    dd.innerHTML = results.map(r => `<div class="ac-item" style="padding:12px; cursor:pointer;" onclick="selectLoc('${r.kecamatan}, ${r.kota}')">${r.kecamatan}, ${r.kota}</div>`).join('');
                }
                dd.style.display = 'block';
            } catch (e) { }
        }, 300);
    });
})();
window.selectLoc = function (val) {
    const inp = document.getElementById('eDomisili');
    const dd = document.getElementById('eDomisiliDropdown');
    if (inp) inp.value = val;
    if (dd) dd.style.display = 'none';
};

// FAQ Accordion Toggle
document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (question) {
        const item = question.parentElement;
        item.classList.toggle('active');

        // Close other items
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
    }
});

/* --- INTERACTIVE ANIMATIONS ENGINE --- */

// 1. 3D Tilt for Bento and Security Cards
document.querySelectorAll('.bento-card, .security-module, .analogy-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});

// 2. Magnetic Buttons Effect
document.querySelectorAll('.btn-glow, .apple-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + (x * 0.2) + "px, " + (y * 0.2) + "px)";
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = "translate(0, 0)";
    });
});

// 3. Hero Parallax
const hero = document.querySelector('.apple-hero');
const mockup = document.getElementById('heroMockup');
if (hero && mockup) {
    hero.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        mockup.style.transform = "rotateX(" + (-y) + "deg) rotateY(" + (-x) + "deg)";

        // Also move glow sphere
        const sphere = document.querySelector('.hero-glow-sphere');
        if (sphere) {
            sphere.style.transform = "translate(calc(-50% + " + (x * 2) + "px), calc(-50% + " + (y * 2) + "px))";
        }
    });
}

// 4. Live Leads Stream Simulation Ping
const streamList = document.querySelector('.stream-list');
if (streamList) {
    setInterval(() => {
        const first = streamList.children[0];
        if (first) {
            first.style.animation = "none";
            // Trigger reflow
            void first.offsetWidth;
            first.style.animation = "pulsePing 2s infinite";
        }
    }, 4000);
}

const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulsePing {
        0% { background: rgba(16, 185, 129, 0.1); }
        50% { background: rgba(16, 185, 129, 0.3); }
        100% { background: transparent; }
    }
`;
document.head.appendChild(style);

// 5. Program Builder Modal Toggle
document.addEventListener('DOMContentLoaded', () => {
    const progCard = document.querySelector('.card-prog');
    const progModal = document.getElementById('programModal');
    const closeModal = document.getElementById('closeModal');

    if (progCard && progModal && closeModal) {
        progCard.style.cursor = 'pointer';
        progCard.addEventListener('click', () => {
            progModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeModal.addEventListener('click', () => {
            progModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        progModal.addEventListener('click', (e) => {
            if (e.target === progModal) {
                progModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// 6. Ecosystem Tooltips & Success Animation
function showNodeDetail(element, type) {
    // Close all other tooltips
    document.querySelectorAll('.node-tooltip').forEach(tt => tt.classList.remove('active'));

    // Toggle current
    const tooltip = element.querySelector('.node-tooltip');
    if (tooltip) tooltip.classList.add('active');

    // Close tooltip when clicking outside
    setTimeout(() => {
        const handleOutside = (e) => {
            if (!element.contains(e.target)) {
                tooltip.classList.remove('active');
                document.removeEventListener('click', handleOutside);
            }
        };
        document.addEventListener('click', handleOutside);
    }, 10);
}

function triggerSuccessAnim(element) {
    showNodeDetail(element, 'success');

    // Coin Fall Logic
    const container = document.getElementById('coinContainer');
    if (!container) return;

    container.innerHTML = '';
    const coinCount = 30;

    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.innerText = '$';

        // Randomize
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 1 + Math.random() * 2;

        coin.style.left = `${left}%`;
        coin.style.animation = `coinFall ${duration}s ${delay}s ease-in forwards`;

        container.appendChild(coin);

        // Cleanup
        setTimeout(() => coin.remove(), (delay + duration) * 1000);
    }
}

