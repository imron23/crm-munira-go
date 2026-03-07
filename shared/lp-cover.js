/**
 * lp-cover.js — Auto-inject cover image from CMS for each Landing Page
 * 
 * How it works:
 * 1. Detects folder name from current URL path
 * 2. Fetches image_url + description from /api/lp-cover?folder=...
 * 3. Injects image into .hero-video element (replaces src for img, poster for video)
 * 4. Also injects description if a #lp-cover-description element exists
 */
(function () {
    // Detect folder from URL path: /lp-bakti-anak/index.html -> "lp-bakti-anak"
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const folder = pathParts[0] || 'root';

    if (!folder || folder === 'dashboard') return;

    fetch('/api/pages/cover?folder=' + encodeURIComponent(folder))
        .then(r => r.json())
        .then(data => {
            if (!data.success || !data.image_url) return;

            const imgUrl = data.image_url;

            // --- Inject cover into Hero ---
            const heroEl = document.querySelector('.hero-video');
            if (heroEl) {
                if (heroEl.tagName === 'IMG') {
                    heroEl.src = imgUrl;
                    heroEl.alt = data.description || 'Paket Umrah Munira World';
                } else if (heroEl.tagName === 'VIDEO') {
                    // For video, set poster attribute (shows before video plays)
                    heroEl.poster = imgUrl;
                }
            }

            // --- Also update og:image meta tag dynamically ---
            const ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) ogImg.setAttribute('content', imgUrl);

            // --- Inject description if placeholder exists ---
            const descEl = document.getElementById('lp-cover-description');
            if (descEl && data.description) {
                descEl.textContent = data.description;
            }
        })
        .catch(() => { /* silently fail — fallback to default image */ });
})();
