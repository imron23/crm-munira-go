/**
 * Munira World — LP Cover / Scroll-reveal & Navbar behaviour
 * Provides: scroll-reveal animations, navbar shrink-on-scroll, mobile menu toggle
 * (The inline preloader timeout in each HTML is sufficient; this file adds
 *  enhanced UX polish shared across all Landing Pages)
 */
(function () {
    'use strict';

    /* ── Navbar shrink on scroll ──────────────────────────── */
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ── Mobile menu toggle ───────────────────────────────── */
    var toggle = document.getElementById('mobileToggle');
    var navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            toggle.classList.toggle('active');
        });

        // Close on nav-link click
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }

    /* ── Scroll-reveal (IntersectionObserver) ────────────── */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback: immediately show all
            els.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        els.forEach(function (el) { observer.observe(el); });
    }

    /* ── Accordion (itinerary timeline) ─────────────────── */
    function initAccordion() {
        document.querySelectorAll('.accordion-header').forEach(function (header) {
            header.addEventListener('click', function () {
                var parent = header.closest('.timeline-content, .accordion-item');
                if (!parent) return;
                var wasActive = parent.classList.contains('active');

                // Close all
                document.querySelectorAll('.timeline-content.active, .accordion-item.active').forEach(function (el) {
                    el.classList.remove('active');
                });

                // Toggle clicked
                if (!wasActive) parent.classList.add('active');
            });
        });
    }

    /* ── Plane animation parallax ─────────────────────── */
    function initPlaneAnim() {
        var plane = document.getElementById('planeAnim');
        if (!plane) return;
        window.addEventListener('scroll', function () {
            var s = window.scrollY / document.body.scrollHeight;
            plane.style.transform = 'translateX(' + (s * 300) + 'px)';
        }, { passive: true });
    }

    /* ── Init on DOMContentLoaded ────────────────────── */
    function init() {
        initReveal();
        initAccordion();
        initPlaneAnim();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[MuniraLP Cover] Loaded.');
})();
