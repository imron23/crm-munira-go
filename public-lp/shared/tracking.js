/**
 * Munira World — Dynamic UTM & GA/FB Tracking
 * Captures UTM params from URL and injects them on form submission
 */
(function () {
    'use strict';

    // Parse UTM from URL
    function getUTMParams() {
        var params = {};
        var search = window.location.search.substring(1);
        var pairs = search.split('&');
        pairs.forEach(function (pair) {
            var parts = pair.split('=');
            if (parts[0] && parts[0].startsWith('utm_')) {
                params[parts[0]] = decodeURIComponent(parts[1] || '');
            }
        });
        return params;
    }

    // Store UTM in sessionStorage so it persists across redirects
    var utms = getUTMParams();
    if (Object.keys(utms).length > 0) {
        try {
            sessionStorage.setItem('munira_utm', JSON.stringify(utms));
        } catch (e) {}
    }

    // Expose globally so forms can include UTM data in payload
    window.MuniraTracking = {
        getUTM: function () {
            try {
                return JSON.parse(sessionStorage.getItem('munira_utm') || '{}');
            } catch (e) {
                return {};
            }
        },
        getPageSource: function () {
            return window.location.pathname.replace(/^\//, '').split('/')[0] || 'unknown';
        }
    };

    // Safe GA push
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { dataLayer.push(arguments); };

    // Safe FB pixel wrapper
    window.fbSafeTrack = function (event, data) {
        try { if (typeof fbq === 'function') fbq('track', event, data || {}); } catch (e) {}
    };

    console.log('[MuniraTracking] Loaded. UTMs:', utms);
})();
