// shared/tracking.js
(async function () {
    try {
        const res = await fetch('/api/settings/public');
        if (!res.ok) return;
        const json = await res.json();

        if (json.success && json.data) {
            const ga4_id = json.data.ga4_id;
            const meta_pixel_id = json.data.meta_pixel_id;

            // Load GA4 if exists
            if (ga4_id) {
                const gaScript = document.createElement('script');
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4_id}`;
                document.head.appendChild(gaScript);

                window.dataLayer = window.dataLayer || [];
                window.gtag = function () { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', ga4_id);
            }

            // Load Meta Pixel if exists
            if (meta_pixel_id) {
                !function (f, b, e, v, n, t, s) {
                    if (f.fbq) return; n = f.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                    n.queue = []; t = b.createElement(e); t.async = !0;
                    t.src = v; s = b.getElementsByTagName(e)[0];
                    if (s && s.parentNode) {
                        s.parentNode.insertBefore(t, s);
                    } else {
                        document.head.appendChild(t);
                    }
                }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', meta_pixel_id);
                fbq('track', 'PageView');
            }
        }
    } catch (err) {
        console.error('Error loading tracking pixels:', err);
    }
})();
