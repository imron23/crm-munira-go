/* ============================================================
   MUNIRA WORLD — INTERACTIONS & ANIMATIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Navbar scroll effect ---- */
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu toggle ---- */
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.navbar-links');
    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    /* ---- Scroll reveal (IntersectionObserver) ---- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    /* ---- Counter animation for pricing ---- */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    cio.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => cio.observe(el));
    }

    function animateCount(el) {
        const end = parseFloat(el.dataset.count);
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = (end * eased).toFixed(1);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    /* ---- Parallax-lite on hero ---- */
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroContent.style.transform = `translateY(${scroll * 0.25}px)`;
                heroContent.style.opacity = 1 - scroll / (window.innerHeight * 0.8);
            }
        }, { passive: true });
    }

    /* ---- Lead Generation Form ---- */
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const namaLengkap = document.getElementById('namaLengkap').value;
            const nomorWA = document.getElementById('nomorWA').value;
            const domisili = document.getElementById('kecamatan').value;
            const yangBerangkat = document.getElementById('yangBerangkat').value;
            const pilihanKamar = document.getElementById('pilihanKamar').value;
            const kesiapanPaspor = document.getElementById('kesiapanPaspor').value;

            const checkedFasilitas = Array.from(document.querySelectorAll('input[name="fasilitasUtama"]:checked')).map(cb => cb.value);
            let fasilitasString = checkedFasilitas.length > 0 ? checkedFasilitas.join(', ') : 'Belum menentukan spesifik';

            // Formatting WhatsApp text
            let text = `Assalamu'alaikum Munira World. Saya ingin hadiahkan Umrah terbaik untuk keluarga. Mohon info paket I'tikaf 17 hari yang paling nyaman dan aman.

*--- DATA IDENTITAS (PENDAFTAR) ---*
👤 Nama: ${namaLengkap}
📱 No. WhatsApp: ${nomorWA}
📍 Domisili: ${domisili}

*--- KUALIFIKASI KEBUTUHAN ---*
🕋 Perjalanan Untuk: ${yangBerangkat}
🛏 Pilihan Kamar: ${pilihanKamar}
🛂 Status Paspor: ${kesiapanPaspor}
🌟 Prioritas Fasilitas Utama: ${fasilitasString}`;

            const encodedText = encodeURIComponent(text);
            const waNumber = '6285261349134';
            const waLink = `https://wa.me/${waNumber}?text=${encodedText}`;

            // Prepare data for API
            const leadData = {
                nama_lengkap: namaLengkap,
                whatsapp_num: nomorWA,
                domisili: domisili,
                yang_berangkat: yangBerangkat,
                paket_pilihan: pilihanKamar,
                kesiapan_paspor: kesiapanPaspor,
                fasilitas_utama: fasilitasString,
                landing_page: window.location.pathname,
                // Extract UTM logic if exists
                utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
                utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
                utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || ''
            };

            // Track Pixel and GA4 Lead explicitly
            try {
                if (typeof fbq === 'function') {
                    fbq('track', 'Lead');
                }
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        'send_to': 'G-11PXTCBM9L',
                        'value': 1,
                        'currency': 'IDR'
                    });
                }
            } catch (trackerErr) {
                console.warn('Tracker error:', trackerErr);
            }

            // Post to CRM API
            const API_URL = (window.location.protocol === 'file:' || window.location.port === '3000') ? 'http://localhost:3000/api/leads' : '/api/leads';
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            }).then(() => {
                // Ignore result, redirect to WA immediately
                window.top.location.href = waLink;
            }).catch((err) => {
                console.error("Failed to track lead:", err);
                // Still redirect to WA even if tracking fails (fail-safe)
                window.top.location.href = waLink;
            });
        });
    }

});
