/**
 * Munira World — Dynamic UTM & GA/FB Tracking + Meta CAPI
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

    // Generate or retrieve a consistent event ID for dedup
    function getEventId() {
        var id = sessionStorage.getItem('munira_eid');
        if (!id) {
            id = 'eid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
            try { sessionStorage.setItem('munira_eid', id); } catch (e) {}
        }
        return id;
    }

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return m ? m[2] : null;
    }

    // --- Meta CAPI (server-side) -----------------------------------------------
    // Sends a Lead event to Meta via our backend proxy — more reliable than pixel alone
    window.sendMetaCAPI = function (leadData) {
        try {
            var API_BASE = (window.location.protocol === 'file:' || ['3000', '5500', '8080'].includes(window.location.port))
                ? 'http://localhost:8080/api'
                : '/api';

            var utm = window.MuniraTracking ? window.MuniraTracking.getUTM() : {};
            var payload = {
                event_name: 'Lead',
                event_time: Math.floor(Date.now() / 1000),
                event_id: getEventId(),
                event_source_url: window.location.href,
                user_data: {
                    phone: (leadData.whatsapp_num || '').replace(/\D/g, ''),
                    client_user_agent: navigator.userAgent,
                    fbc: getCookie('_fbc'),
                    fbp: getCookie('_fbp')
                },
                custom_data: {
                    lead_name: leadData.nama_lengkap || '',
                    pax: leadData.yang_berangkat || '',
                    package: leadData.paket_pilihan || '',
                    form_source: leadData.form_source || '',
                    utm_source: utm.utm_source || '',
                    utm_medium: utm.utm_medium || '',
                    utm_campaign: utm.utm_campaign || ''
                }
            };

            fetch(API_BASE + '/track/meta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(function () {}); // fire-and-forget

            // Also fire client pixel if available
            try { fbq('track', 'Lead', { content_name: leadData.paket_pilihan }, { eventID: payload.event_id }); } catch (e) {}
            try { gtag('event', 'generate_lead', { send_to: 'G-11PXTCBM9L' }); } catch (e) {}
        } catch (err) {
            console.warn('[MuniraCAPI]', err);
        }
    };

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
