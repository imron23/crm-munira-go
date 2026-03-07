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
            const jumlahKeluarga = document.getElementById('jumlahKeluarga').value;
            const pilihanKamar = document.getElementById('pilihanKamar').value;

            // Formatting WhatsApp text
            let text = `Assalamu'alaikum Munira World, saya tertarik Paket Umrah Liburan Sekolah 29 Juni. Mohon info ketersediaan seat VIP untuk keluarga saya.

*--- DATA IDENTITAS ---*
👤 Nama: ${namaLengkap}
📱 No. WhatsApp: ${nomorWA}
👥 Jumlah Keluarga: ${jumlahKeluarga} Orang
🛏 Tipe Kamar: ${pilihanKamar}`;

            const encodedText = encodeURIComponent(text);
            const waNumber = '6285261349134';
            const waLink = `https://wa.me/${waNumber}?text=${encodedText}`;

            const kecamatanEl = document.getElementById('kecamatan');
            const domisili = kecamatanEl ? kecamatanEl.value : 'N/A';

            // Prepare data for API
            const leadData = {
                nama_lengkap: namaLengkap,
                whatsapp_num: nomorWA,
                domisili: domisili,
                yang_berangkat: jumlahKeluarga + ' Orang',
                paket_pilihan: pilihanKamar,
                kesiapan_paspor: 'N/A',
                fasilitas_utama: 'Liburan Sekolah PRD',
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

    /* ---- Accordion Logic for Itinerary ---- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        // Build an elegant open animation for the first item
        const firstItem = accordionHeaders[0].parentElement;
        firstItem.classList.add('active');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const parentContent = this.parentElement;

                // Toggle active class on clicked item
                if (parentContent.classList.contains('active')) {
                    parentContent.classList.remove('active');
                } else {
                    // Close all others first
                    document.querySelectorAll('.accordion-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Open the clicked one
                    parentContent.classList.add('active');
                }
            });
        });
    }

});
