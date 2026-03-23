/* ============================================================
   Munira World — lp-2-long/script.js
   LP-Specific JavaScript
   ============================================================ */

document.body.classList.add("loading");
        setTimeout(function () {
            var l = document.getElementById("pageLoader");
            if (l) { l.style.opacity = "0"; l.style.visibility = "hidden"; }
            document.body.classList.remove("loading");
            setTimeout(function () { if (l) l.remove(); }, 600);
        }, 2500);

/* ---- */

(function () {
                    let eCurrent = 1;

                    // Timeout 20 detik untuk menghapus aturan wajib isi kecamatan
                    let isKecamatanMandatory = true;
                    setTimeout(() => {
                        isKecamatanMandatory = false;
                    }, 20000);

                    function eShowPane(n) {
                        [1, 2, 3].forEach(i => {
                            document.getElementById('ep' + i)?.classList.toggle('active', i === n);
                            const d = document.getElementById('edot' + i);
                            if (!d) return;
                            d.classList.remove('active', 'done');
                            if (i < n) d.classList.add('done');
                            else if (i === n) d.classList.add('active');
                        });
                        eCurrent = n;
                        document.querySelector('.emb-form-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }

                    function eShowErr(inpId, errId, cond) {
                        const el = document.getElementById(inpId);
                        const er = document.getElementById(errId);
                        if (!el || !er) return cond;
                        if (cond) { el.classList.add('err'); er.style.display = 'block'; }
                        else { el.classList.remove('err'); er.style.display = 'none'; }
                        return cond;
                    }

                    function eValidate(n) {
                        let fail = false;
                        if (n === 1) {
                            fail |= eShowErr('eNama', 'ee-nama', !document.getElementById('eNama')?.value.trim());
                            // Validate kecamatan via hidden field (autocomplete) if mandatory
                            const kecVal = document.getElementById('eKec')?.value;
                            const kecInp = document.getElementById('eDomisiliInput');
                            const kecErr = document.getElementById('ee-kec');
                            if (isKecamatanMandatory && !kecVal) {
                                if (kecInp) kecInp.classList.add('err');
                                if (kecErr) kecErr.style.display = 'block';
                                fail = true;
                            } else {
                                if (kecInp) kecInp.classList.remove('err');
                                if (kecErr) kecErr.style.display = 'none';
                            }
                            const wa = document.getElementById('eWA')?.value.trim() || '';
                            fail |= eShowErr('eWA', 'ee-wa', !/^[0-9]{9,15}$/.test(wa.replace(/\s/g, '')));
                        }
                        if (n === 2) {
                            fail |= eShowErr('ePengalaman', 'ee-pengalaman', !document.getElementById('ePengalaman')?.value);
                            fail |= eShowErr('eRencana', 'ee-rencana', !document.getElementById('eRencana')?.value);
                            const jml = parseInt(document.getElementById('eJumlah')?.value) || 0;
                            fail |= eShowErr('eJumlah', 'ee-jumlah', jml < 1);
                        }
                        if (n === 3) {
                            fail |= eShowErr('ePaket', 'ee-paket', !document.getElementById('ePaket')?.value);
                            const paspor = document.querySelector('input[name="ePaspor"]:checked');
                            const pe = document.getElementById('ee-paspor');
                            if (!paspor) { if (pe) pe.style.display = 'block'; fail = true; }
                            else { if (pe) pe.style.display = 'none'; }
                            const bayar = document.querySelector('input[name="eBayar"]:checked');
                            const be = document.getElementById('ee-bayar');
                            if (!bayar) { if (be) be.style.display = 'block'; fail = true; }
                            else { if (be) be.style.display = 'none'; }
                            const setuju = document.getElementById('eSetuju')?.checked;
                            const se = document.getElementById('ee-setuju');
                            if (!setuju) { if (se) se.style.display = 'block'; fail = true; }
                            else { if (se) se.style.display = 'none'; }
                        }
                        return !fail;
                    }

                    document.addEventListener('DOMContentLoaded', function () {
                        /* ── Kecamatan Autocomplete for Long Form ── */
                        (function () {
                            const API_BASE = (window.location.protocol === 'file:' || ['3000', '5500', '8080'].includes(window.location.port))
                                ? 'http://localhost:8080/api' : '/api';
                            const inp = document.getElementById('eDomisiliInput');
                            const dd = document.getElementById('eDomisiliDropdown');
                            const hidKec = document.getElementById('eKec');
                            const hidKab = document.getElementById('eKab');
                            const hidProv = document.getElementById('eProv');
                            const hint = document.getElementById('eDomisiliHint');
                            if (!inp || !dd) return;
                            let debounceTimer, activeIdx = -1, lastResults = [];

                            function hl(text, q) {
                                if (!q) return text;
                                const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                                return text.replace(re, '<mark style="background:#FEF9EC;color:#B7914C;font-weight:700;border-radius:2px;">$1</mark>');
                            }

                            function showDd(results, q) {
                                lastResults = results; activeIdx = -1;
                                const itemStyle = 'padding:10px 14px;cursor:pointer;font-size:0.88rem;border-bottom:1px solid #f0f0f0;';
                                if (!results.length) {
                                    dd.innerHTML = '<div style="' + itemStyle + 'color:#a0aec0;">Tidak ditemukan. Coba kata lain.</div>';
                                } else {
                                    dd.innerHTML = results.map((r, i) =>
                                        `<div class="emb-ac-item" data-idx="${i}" style="${itemStyle}">
                                            <strong style="color:#1a365d;display:block;">${hl(r.kecamatan, q)}</strong>
                                            <span style="color:#718096;font-size:0.78rem;">${hl(r.kota, q)}, ${r.provinsi}</span>
                                        </div>`
                                    ).join('');
                                    dd.querySelectorAll('.emb-ac-item').forEach(el => {
                                        el.addEventListener('mousedown', e => { e.preventDefault(); selectItem(parseInt(el.dataset.idx)); });
                                        el.addEventListener('mouseover', () => { dd.querySelectorAll('.emb-ac-item').forEach((x, i) => x.style.background = (i == parseInt(el.dataset.idx) ? '#FEF9EC' : '')); });
                                    });
                                }
                                dd.style.display = 'block';
                            }

                            function selectItem(idx) {
                                const r = lastResults[idx]; if (!r) return;
                                inp.value = r.kecamatan + ', ' + r.kota;
                                hidKec.value = r.kecamatan;
                                hidKab.value = r.kota;
                                hidProv.value = r.provinsi;
                                hint.innerHTML = '<i class="fas fa-check-circle" style="color:#16a34a;margin-right:4px;"></i><span style="color:#16a34a;font-weight:600;">' + r.kecamatan + ', ' + r.kota + ', ' + r.provinsi + '</span>';
                                inp.classList.remove('err');
                                document.getElementById('ee-kec').style.display = 'none';
                                dd.style.display = 'none';
                            }

                            inp.addEventListener('input', function () {
                                hidKec.value = ''; hidKab.value = ''; hidProv.value = '';
                                const q = this.value.trim();
                                if (q.length < 3) { dd.style.display = 'none'; hint.innerHTML = '<i class="fas fa-keyboard" style="margin-right:4px;"></i>Ketik minimal 3 huruf...'; return; }
                                hint.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:4px;"></i>Mencari...';
                                clearTimeout(debounceTimer);
                                debounceTimer = setTimeout(async () => {
                                    try {
                                        const res = await fetch(API_BASE + '/wilayah/search?q=' + encodeURIComponent(q));
                                        const data = await res.json();
                                        if (data.message && !(data.data || []).length) {
                                            dd.innerHTML = '<div style="padding:12px 14px;color:#a0aec0;font-size:0.83rem;"><i class="fas fa-hourglass-half" style="margin-right:6px;"></i>' + data.message + '</div>';
                                            dd.style.display = 'block'; hint.innerHTML = ''; return;
                                        }
                                        showDd(data.data || [], q);
                                        hint.innerHTML = (data.data || []).length ? '<i class="fas fa-map-marker-alt" style="color:#C5A059;margin-right:4px;"></i>' + data.data.length + ' kecamatan ditemukan' : '';
                                    } catch (e) { dd.innerHTML = '<div style="padding:12px 14px;color:#a0aec0;">Gagal memuat data wilayah.</div>'; dd.style.display = 'block'; }
                                }, 300);
                            });

                            inp.addEventListener('keydown', function (e) {
                                const items = dd.querySelectorAll('.emb-ac-item');
                                if (!items.length) return;
                                if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
                                else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
                                else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); selectItem(activeIdx); return; }
                                else if (e.key === 'Escape') { dd.style.display = 'none'; return; }
                                items.forEach((el, i) => el.style.background = i === activeIdx ? '#FEF9EC' : '');
                                if (activeIdx >= 0) items[activeIdx].scrollIntoView({ block: 'nearest' });
                            });

                            document.addEventListener('click', e => { if (!inp.contains(e.target) && !dd.contains(e.target)) dd.style.display = 'none'; });
                        })();

                        // Next/Prev buttons
                        document.querySelectorAll('.emb-btn-next').forEach(btn => {
                            btn.addEventListener('click', function () {
                                const next = parseInt(this.dataset.enext);
                                if (eValidate(eCurrent)) eShowPane(next);
                            });

                        });
                        document.querySelectorAll('.emb-btn-prev').forEach(btn => {
                            btn.addEventListener('click', function () {
                                eShowPane(parseInt(this.dataset.eprev));
                            });
                        });

                        // Clear errors on change
                        document.querySelectorAll('.emb-inp').forEach(el => {
                            el.addEventListener('change', () => el.classList.remove('err'));
                            el.addEventListener('input', () => el.classList.remove('err'));
                        });

                        // Dynamic Jamaah Fields
                        const ejumlahInput = document.getElementById('eJumlah');
                        const eusiaContainer = document.getElementById('eUsiaContainer');
                        if (ejumlahInput && eusiaContainer) {
                            ejumlahInput.addEventListener('input', function () {
                                let html = '';
                                const j = parseInt(this.value) || 0;
                                if (j > 0 && j <= 30) {
                                    for (let i = 1; i <= j; i++) {
                                        html += `
                                        <div class="emb-group" style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-top:10px;">
                                            <label style="color:#C5A059;">Data Calon Jamaah ${i}</label>
                                            <div class="emb-row">
                                                <div style="flex:1;">
                                                    <select id="eRelasi_${i}" class="emb-inp" style="padding:10px;">
                                                        <option value="" disabled selected>Hubungan/Status...</option>
                                                        <option value="Saya Sendiri">Saya Sendiri</option>
                                                        <option value="Suami/Istri">Suami/Istri</option>
                                                        <option value="Anak">Anak</option>
                                                        <option value="Ayah/Ibu">Ayah/Ibu</option>
                                                        <option value="Saudara">Saudara</option>
                                                        <option value="Orang Lain">Orang Lain</option>
                                                    </select>
                                                </div>
                                                <div style="flex:1;">
                                                    <input type="number" id="eUsia_${i}" class="emb-inp" style="padding:10px;" placeholder="Usia (Thn)" min="0" max="120">
                                                </div>
                                            </div>
                                        </div>`;
                                    }
                                }
                                eusiaContainer.innerHTML = html;
                            });
                        }

                        /**
                         * Extract first name from full name and detect gender preference
                         * Returns object { firstName, genderGuess: 'male'|'female'|'unknown' }
                         */
                        function extractNameInfo(fullName) {
                            if (!fullName || !fullName.trim()) return { firstName: '', genderGuess: 'unknown' };

                            const name = fullName.trim();
                            const parts = name.split(/\s+/);
                            const firstName = parts[0] || '';

                            // Common Indonesian male/female name patterns
                            const malePatterns = /^(ahmad|muhammad|mohammad|budi|andi|dodi|edi|faisal|hamzah|ibrahim|joko|kamil|lutfi|muhammad|nurul|agus|yusuf|ali|umar|bilal|zain|fadli|reza|dimas|bayu|eko|hadi|irawan|joko|karim|latif|mahmud|nizar|osman|putra|qomar|rudi|surya|taufik|utsman|wahyu|yusuf|zaki|habib|imam|khalid|malik|omar|rafli|sultan|tariq|umar|vali|wali|xavier|yasir|zaid|arif|bambang|cahyo|dadan|erik|ferry|galih|hendra|iwan|jaya|krisna|liono|made|nana|opik|panji|qori|rian|setiawan|teguh|ujang|vino|wawan|yanto|zulfan)$/i;
                            const femalePatterns = /^(siti|nurul|fatimah|aisyah|khadijah|zainab|amina|sarah|maryam|dewi|putri|ratna|sri|wulan|yuni|ani|bella|citra|dina|eka|fitri|gita|hani|indah|julia|kartika|lisa|may|nia|olivia|putri|qori|rina|sinta|tia|uma|vivin|winda|xia|yolanda|zahra|amalia|bayan|celine|dinda|eliza|fira|gina|hana|irma|jihan|keisha|lara|mira|nadia|oka|putri|qiana|rani|salsabila|tania|ulfah|vera|widya|xena|yasmine|zeina|hapsari|kusuma|permata|safitri|wijaya|kusuma|ratu|melati|cempaka|mawar|anggrek|tulip|rose|dahlia)$/i;

                            let genderGuess = 'unknown';
                            if (malePatterns.test(firstName)) {
                                genderGuess = 'male';
                            } else if (femalePatterns.test(firstName)) {
                                genderGuess = 'female';
                            }

                            return { firstName, genderGuess };
                        }

                        /**
                         * Generate personalized success message
                         */
                        function generateSuccessMessage(fullName, aiGenderDetected) {
                            const { firstName, genderGuess } = extractNameInfo(fullName);

                            // Use AI detected gender if available, otherwise use local guess
                            const gender = aiGenderDetected || genderGuess;

                            // Determine salutation based on gender
                            let salutation = 'Bapak/Ibu'; // default
                            if (gender === 'male') {
                                salutation = 'Bapak';
                            } else if (gender === 'female') {
                                salutation = 'Ibu';
                            }

                            // Add first name if available
                            const personalizedSalutation = firstName ? `${salutation} ${firstName}` : salutation;

                            return `Terima kasih banyak sudah berbagi rencana ibadah Anda, <strong>${personalizedSalutation}</strong>. Kami sangat menghargai niat tulus ini.<br><br>Izinkan kami menyiapkan detail perjalanan yang paling tenang, nyaman, dan sesuai Sunnah untuk Anda. Tim kami akan menyapa melalui WhatsApp kurang dari 1-6 jam ke depan untuk berbincang lebih lanjut. Mohon ditunggu ya.`;
                        }

                        // Submit
                        const form = document.getElementById('embLeadForm');
                        const successModal = document.getElementById('successModal');
                        const successModalBtn = document.getElementById('successModalBtn');
                        const successModalMsg = document.getElementById('successModalMessage');
                        let waRedirectUrl = '';

                        if (form) {
                            form.addEventListener('submit', function (e) {
                                e.preventDefault();

                                // Honeypot spam check - silent rejection
                                const honeypot = document.getElementById('eWebsiteHoneypot');
                                if (honeypot && honeypot.value) {
                                    console.warn('Spam bot terdeteksi.');
                                    return;
                                }

                                if (!eValidate(3)) return;

                                // Disable button to prevent double submission
                                const submitBtn = document.getElementById('embSubmitBtn');
                                if (submitBtn) {
                                    submitBtn.disabled = true;
                                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                                    submitBtn.style.opacity = '0.7';
                                    submitBtn.style.cursor = 'not-allowed';
                                }

                                const overlay = document.getElementById('embOverlay');
                                if (overlay) overlay.classList.add('on');

                                const nama = document.getElementById('eNama').value.trim();
                                const wa = document.getElementById('eWA').value.trim();
                                // Read from hidden fields set by autocomplete
                                const kecTxt = document.getElementById('eKec')?.value || '';
                                const kabTxt = document.getElementById('eKab')?.value || '';
                                const provTxt = document.getElementById('eProv')?.value || '';
                                const domisili = kecTxt ? `${kecTxt}, ${kabTxt}, ${provTxt}` : '';

                                const pengalaman = document.getElementById('ePengalaman').value;
                                const rencana = document.getElementById('eRencana').value;
                                const jumlah = document.getElementById('eJumlah').value;
                                const paket = document.getElementById('ePaket').value;
                                const paspor = document.querySelector('input[name="ePaspor"]:checked')?.value || '';
                                const bayar = document.querySelector('input[name="eBayar"]:checked')?.value || '';
                                const params = new URLSearchParams(window.location.search);

                                const jamaahUsiaDetail = [];
                                let jamaahText = '';
                                const jCount = parseInt(jumlah) || 0;
                                for (let i = 1; i <= jCount; i++) {
                                    const rel = document.getElementById('eRelasi_' + i)?.value || 'Belum Diisi';
                                    const usia = document.getElementById('eUsia_' + i)?.value || '-';
                                    jamaahUsiaDetail.push({ hubungan: rel, usia: usia + ' Thn' });
                                    jamaahText += `\n   ${i}. ${rel} (${usia} Thn)`;
                                }

                                try { if (typeof fbq === 'function') fbq('track', 'Lead'); } catch (_) { }
                                try { if (typeof gtag === 'function') gtag('event', 'generate_lead', { send_to: 'G-11PXTCBM9L', value: 1, currency: 'IDR' }); } catch (_) { }

                                const payload = {
                                    nama_lengkap: nama,
                                    whatsapp_num: wa,
                                    domisili,
                                    yang_berangkat: `${jumlah} Orang (${rencana})`,
                                    jamaah_usia_detail: jamaahUsiaDetail,
                                    paket_pilihan: paket,
                                    kesiapan_paspor: paspor,
                                    fasilitas_utama: bayar,
                                    landing_page: '/lp-2-long',
                                    utm_source: params.get('utm_source') || '',
                                    utm_medium: params.get('utm_medium') || '',
                                    utm_campaign: params.get('utm_campaign') || ''
                                };

                                const API = (window.location.protocol === 'file:' || ['3000', '5500', '8080'].includes(window.location.port))
                                    ? 'http://localhost:8080/api/leads' : '/api/leads';

                                // Pick WA number: from injected rotator or fallback default
                                let waTarget = '6285261349134';
                                const rotator = window.__MUNIRA_WA_ROTATOR__;
                                if (rotator && rotator.length > 0) {
                                    const active = rotator.filter(n => n.is_active !== false);
                                    if (active.length > 0) {
                                        const idx = Math.floor(Math.random() * active.length);
                                        waTarget = active[idx].number.replace(/\D/g, '');
                                        if (!waTarget.startsWith('62')) waTarget = '62' + waTarget.replace(/^0/, '');
                                    }
                                }

                                (async function () {
                                    try {
                                        const res = await fetch(API, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload),
                                            keepalive: true
                                        });
                                        if (!res.ok) console.warn('[Lead] API:', res.status, await res.text());
                                    } catch (e) { 
                                        console.warn('[Lead]', e); 
                                        // Re-enable in case of network failure
                                        if (submitBtn) {
                                            submitBtn.disabled = false;
                                            submitBtn.innerHTML = 'Konsultasikan Sekarang <i class="fab fa-whatsapp"></i>';
                                            submitBtn.style.opacity = '1';
                                            submitBtn.style.cursor = 'pointer';
                                        }
                                        if (overlay) overlay.classList.remove('on');
                                    }
                                    const text = `Assalamu'alaikum Konsultan Munira World,\n\nSaya tertarik dengan Program Umrah Keluarga Liburan Sekolah 10 Hari.\n\n*--- DATA IDENTITAS ---*\n👤 Nama: ${nama}\n📱 No. WhatsApp: ${wa}\n📍 Domisili: ${domisili}\n\n*--- RENCANA PERJALANAN ---*\n🕋 Pengalaman Umrah: ${pengalaman}\n📅 Rencana Berangkat: ${rencana}\n👨‍👩‍👧‍👦 Jumlah Peserta: ${jumlah} Orang\n*Rincian Jamaah:*${jamaahText}\n\n*--- PREFERENSI ---*\n🛏 Paket Pilihan: ${paket}\n🛂 Status Paspor: ${paspor}\n💳 Pembayaran: ${bayar}\n\nMohon bantuannya untuk info detail, ketersediaan seat, dan penawaran terbaik. Terima kasih.`;
                                    window.location.href = `https://wa.me/${waTarget}?text=${encodeURIComponent(text)}`;
                                })();
                            });
                        }
                    });
                })();

/* ---- */

(function () {
            var LP_FOLDER = 'lp-2-long';
            var API_BASE = (window.location.protocol === 'file:' || ['3000', '5500', '8080'].includes(window.location.port))
                ? 'http://localhost:8080/api' : '/api';

            async function loadAndInjectForm() {
                try {
                    // /api/pages/:folder/config returns { success, form: {...}, programs: [...] }
                    var cfgRes = await fetch(API_BASE + '/pages/' + LP_FOLDER + '/config');
                    if (!cfgRes.ok) return;
                    var cfg = await cfgRes.json();
                    // Use form object directly from config response
                    var form = cfg.form;
                    if (!form) return; // no form linked, use existing hardcoded form

                    window.__MUNIRA_INJECT_FORM__ = form;
                    window.__MUNIRA_WA_ROTATOR__ = form.wa_rotator || [];
                    window.__MUNIRA_SUCCESS_MSG__ = form.success_message || 'Terima kasih! Tim kami akan segera menghubungi Anda.';
                    window.__MUNIRA_SUCCESS_URL__ = form.success_redirect_url || '';
                    window.__MUNIRA_FORM_ID__ = form._id;
                    window.__MUNIRA_ROTATOR_MODE__ = form.rotator_mode || 'round_robin';

                    // Dev indicator badge (disappears after 4s)
                    var b = document.createElement('div');
                    b.style.cssText = 'position:fixed;bottom:60px;right:16px;z-index:9999;background:rgba(139,92,246,0.9);color:#fff;font-size:0.65rem;padding:4px 10px;border-radius:20px;font-weight:700;pointer-events:none;';
                    b.textContent = '\uD83D\uDCCB Form: ' + (form.name || 'Dynamic');
                    document.body.appendChild(b);
                    setTimeout(function () { b.remove(); }, 4000);

                    console.log('[MuniraInject] LP2 Long Form "' + form.name + '" ready. WA: ' + (form.wa_rotator || []).length + ' CS');
                } catch (e) {
                    console.warn('[MuniraInject] Gagal memuat form dinamis, pakai form bawaan.', e);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadAndInjectForm);
            } else {
                loadAndInjectForm();
            }
        })();