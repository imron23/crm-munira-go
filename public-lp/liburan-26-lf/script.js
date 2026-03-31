/* ============================================================
   Munira World — Progressive Short Form Script
   Used by: liburan-26-sf & liburan-26-lf
   ============================================================ */

/* ---------- Preloader Dismiss ---------- */
(function () {
    function dismissLoader() {
        var l = document.getElementById('pageLoader');
        if (l) {
            l.style.opacity = '0';
            l.style.visibility = 'hidden';
            document.body.classList.remove('loading');
            setTimeout(function () { l.remove(); }, 600);
        }
    }
    // Dismiss after content loaded or max 3s
    if (document.readyState === 'complete') {
        setTimeout(dismissLoader, 300);
    } else {
        window.addEventListener('load', function () { setTimeout(dismissLoader, 300); });
        // Fallback: dismiss after 3s no matter what
        setTimeout(dismissLoader, 3000);
    }
})();

/* ---------- State ---------- */
var sfState = { nama: '', hp: '', kec: '', kab: '', prov: '', paket: '', pax: 1, usia: [] };
var acSelected = null, acDebounce = null;

/* ---------- Progress ---------- */
function updateProgress(step) {
    var lbl = document.getElementById('pLabel');
    var bar = document.getElementById('pBar');
    if (lbl) lbl.textContent = 'Langkah ' + step + ' dari 4';
    if (bar) bar.style.width = (step * 25) + '%';
}

/* ---------- Error helpers ---------- */
function showErr(id, show) {
    var el = document.getElementById(id);
    if (!el) return;
    if (show) {
        el.classList.add('show');
        if (el.previousElementSibling) el.previousElementSibling.classList.add('error');
    } else {
        el.classList.remove('show');
        if (el.previousElementSibling) el.previousElementSibling.classList.remove('error');
    }
}

/* ---------- Step navigation ---------- */
window.nextStep = function (step) {
    if (step === 1) {
        var nama = document.getElementById('sfNama').value.trim();
        var hp = document.getElementById('sfHp').value.replace(/\D/g, '');
        var ok = true;
        if (nama.length < 2) { showErr('eNama', true); ok = false; } else showErr('eNama', false);
        if (hp.length < 9) { showErr('eHp', true); ok = false; } else showErr('eHp', false);
        if (!ok) return;
        sfState.nama = nama;
        sfState.hp = hp;
    }

    if (step === 2) {
        if (!acSelected) { showErr('eKec', true); return; } else showErr('eKec', false);
        sfState.kec = acSelected.kecamatan;
        sfState.kab = acSelected.kota;
        sfState.prov = acSelected.provinsi;
        sfState.paket = document.getElementById('sfPaket').value;
        renderUsia();
    }

    if (step === 3) {
        var ok = true;
        sfState.usia = [];
        document.querySelectorAll('.u-inp').forEach(function (inp, idx) {
            var val = parseInt(inp.value);
            var relNode = document.querySelectorAll('.u-rel')[idx];
            var rel = relNode ? relNode.value : 'Saya';
            if (isNaN(val) || val < 1) {
                inp.classList.add('error');
                ok = false;
            } else {
                inp.classList.remove('error');
                sfState.usia.push({ santri: rel, usia: val });
            }
        });
        if (!ok) { showErr('eUsia', true); return; } else showErr('eUsia', false);

        document.getElementById('sNama').textContent = sfState.nama;
        document.getElementById('sHp').textContent = sfState.hp;
        document.getElementById('sDom').textContent = sfState.kec + ', ' + sfState.kab;
        document.getElementById('sPax').textContent = sfState.pax + ' Orang';
        document.getElementById('sUsia').innerHTML = sfState.usia.map(function (u) {
            return '<span style="display:inline-block;background:#e2e8f0;padding:2px 8px;border-radius:4px;margin:2px 4px 2px 0;">' + u.santri + ': ' + u.usia + 'th</span>';
        }).join('');
    }

    document.getElementById('step' + step).classList.remove('active');
    document.getElementById('step' + (step + 1)).classList.add('active');
    updateProgress(step + 1);
};

window.prevStep = function (step) {
    document.getElementById('step' + step).classList.remove('active');
    document.getElementById('step' + (step - 1)).classList.add('active');
    updateProgress(step - 1);
};

/* ---------- Autocomplete (Kecamatan) ---------- */
var kecInp = document.getElementById('sfKecInp');
if (kecInp) {
    kecInp.addEventListener('input', function () {
        var q = this.value.trim();
        var dd = document.getElementById('sfKecDd');
        acSelected = null;
        showErr('eKec', false);
        document.getElementById('sfKecBadge').innerHTML = '';
        if (q.length < 3) { dd.classList.remove('open'); return; }

        clearTimeout(acDebounce);
        acDebounce = setTimeout(async function () {
            dd.innerHTML = '<div style="padding:10px;text-align:center;color:#718096;font-size:0.85rem;"><i class="fas fa-spinner fa-spin"></i> Mencari...</div>';
            dd.classList.add('open');
            try {
                var API_BASE = window.location.protocol === 'file:' ? 'http://localhost:8080/api' : '/api';
                var res = await fetch(API_BASE + '/wilayah/search?q=' + encodeURIComponent(q));
                var data = await res.json();
                if (!data.data || !data.data.length) {
                    dd.innerHTML = '<div style="padding:10px;text-align:center;color:#e53e3e;font-size:0.85rem;">Tidak ditemukan.</div>';
                    return;
                }
                dd.innerHTML = data.data.slice(0, 10).map(function (r) {
                    return '<div class="sf-ac-item" onclick=\'setKec(' + JSON.stringify(r) + ')\'>' +
                        '<strong>' + r.kecamatan + '</strong>' +
                        '<span>' + r.kota + ', ' + r.provinsi + '</span>' +
                        '</div>';
                }).join('');
            } catch (e) {
                dd.innerHTML = '<div style="padding:10px;text-align:center;color:#e53e3e;font-size:0.85rem;">Gagal memuat API.</div>';
            }
        }, 350);
    });
}

window.setKec = function (r) {
    acSelected = r;
    document.getElementById('sfKecInp').value = '';
    document.getElementById('sfKecDd').classList.remove('open');
    document.getElementById('sfKecBadge').innerHTML =
        '<div class="sf-badge"><i class="fas fa-check-circle" style="margin-right:6px;"></i>' + r.kecamatan + ', ' + r.kota + '</div>';
};

/* ---------- Pax counter ---------- */
window.changePax = function (d) {
    sfState.pax = Math.max(1, Math.min(10, sfState.pax + d));
    document.getElementById('paxVal').textContent = sfState.pax;
    renderUsia();
};

/* ---------- Render Usia Cards ----------
   RULE: ALL pax get a dropdown (termasuk pax ke-1 = default "Saya")
   ------------------------------------------------------------ */
function renderUsia() {
    var list = document.getElementById('usiaList');
    if (!list) return;
    var existingU = Array.from(list.querySelectorAll('.u-inp')).map(function (el) { return el.value; });
    var existingR = Array.from(list.querySelectorAll('.u-rel')).map(function (el) { return el.value; });

    var relOptions = ['Saya', 'Suami / Istri', 'Anak', 'Orang Tua', 'Saudara'];

    list.innerHTML = Array(sfState.pax).fill(0).map(function (_, i) {
        var defaultRel = i === 0 ? 'Saya' : 'Suami / Istri';
        var pastRel = existingR[i] || defaultRel;

        var opts = relOptions.map(function (opt) {
            return '<option value="' + opt + '"' + (pastRel === opt ? ' selected' : '') + '>' + opt + '</option>';
        }).join('');

        var relHtml = '<select class="sf-inp u-rel" style="flex:1; padding:8px; font-weight:600;">' + opts + '</select>';

        return '<div class="usia-card">' +
            '<span class="idx">' + (i + 1) + '</span>' +
            relHtml +
            '<input type="number" class="sf-inp u-inp" style="width:80px; padding:8px;" placeholder="Usia (Thn)" min="1" value="' + (existingU[i] || '') + '" oninput="this.classList.remove(\'error\'); showErr(\'eUsia\',false)">' +
            '</div>';
    }).join('');
}

// Init usia on load
renderUsia();

/* ---------- Form Submit ---------- */
window.submitForm = async function () {
    var setuju = document.getElementById('sfSetuju').checked;
    if (!setuju) { showErr('eSetuju', true); return; } else showErr('eSetuju', false);

    var btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

    // Get UTM from MuniraTracking if available
    var utm = (window.MuniraTracking && window.MuniraTracking.getUTM) ? window.MuniraTracking.getUTM() : {};

    // Determine form_source from LP folder path
    var pathParts = window.location.pathname.replace(/^\//, '').split('/');
    var formSource = pathParts[0] || 'liburan-sf';

    var payload = {
        nama_lengkap: sfState.nama,
        whatsapp_num: sfState.hp,
        domisili: sfState.kec + ', ' + sfState.kab + ', ' + sfState.prov,
        yang_berangkat: sfState.pax + ' Jamaah',
        jamaah_usia_detail: sfState.usia,
        paket_pilihan: sfState.paket || 'Umrah Liburan',
        fasilitas_utama: 'Bersedia Dihubungi',
        landing_page: window.location.href,
        form_source: formSource,
        utm_source: utm.utm_source || '',
        utm_medium: utm.utm_medium || '',
        utm_campaign: utm.utm_campaign || ''
    };

    var API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? 'http://localhost:8080/api/leads'
        : '/api/leads';

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
        // Fire Meta CAPI (server-side + pixel dedup)
        if (typeof window.sendMetaCAPI === 'function') {
            window.sendMetaCAPI(payload);
        } else {
            try { gtag('event', 'generate_lead', { send_to: 'G-11PXTCBM9L' }); } catch (e) {}
            try { fbq('track', 'Lead'); } catch (e) {}
        }
    } catch (e) {
        console.warn('[SF Submit]', e);
    }

    // Hide form, show thanks
    var pLabel = document.getElementById('pLabel');
    var pTrack = document.querySelector('.sf-prog-track');
    var progForm = document.getElementById('progForm');
    var thankYou = document.getElementById('sfThankYou');
    if (pLabel) pLabel.style.display = 'none';
    if (pTrack) pTrack.style.display = 'none';
    if (progForm) progForm.style.display = 'none';
    if (thankYou) thankYou.style.display = 'block';
};

/* ---------- LP Config injection (dynamic form from CMS) ---------- */
(function () {
    var LP_FOLDER = window.location.pathname.replace(/^\//, '').split('/')[0] || '';
    var API_BASE = (window.location.protocol === 'file:' || ['3000', '5500', '8080'].includes(window.location.port))
        ? 'http://localhost:8080/api' : '/api';

    async function loadAndInjectForm() {
        if (!LP_FOLDER) return;
        try {
            var cfgRes = await fetch(API_BASE + '/pages/' + LP_FOLDER + '/config');
            if (!cfgRes.ok) return;
            var cfg = await cfgRes.json();
            var form = cfg.form;
            if (!form) return;

            window.__MUNIRA_INJECT_FORM__ = form;
            window.__MUNIRA_WA_ROTATOR__ = form.wa_rotator || [];
            window.__MUNIRA_SUCCESS_MSG__ = form.success_message || 'Terima kasih!';
            window.__MUNIRA_FORM_ID__ = form._id;
            console.log('[MuniraInject] Form "' + form.name + '" ready.');
        } catch (e) {
            console.warn('[MuniraInject] Fallback ke form default.', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndInjectForm);
    } else {
        loadAndInjectForm();
    }
})();