/* ============================================================
   Munira World — liburan-26-sf/script.js
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

// State
                let sfState = { nama:'', hp:'', kec:'', kab:'', prov:'', paket:'', pax:1, usia:[] };
                let acSelected = null, acDebounce = null;

                function updateProgress(step) {
                    document.getElementById('pLabel').textContent = 'Langkah ' + step + ' dari 4';
                    document.getElementById('pBar').style.width = (step * 25) + '%';
                }

                function showErr(id, show) {
                    const el = document.getElementById(id);
                    if(show) { el.classList.add('show'); el.previousElementSibling?.classList?.add('error'); }
                    else { el.classList.remove('show'); el.previousElementSibling?.classList?.remove('error'); }
                }

                function nextStep(step) {
                    // Validasi Step 1
                    if(step === 1) {
                        const nama = document.getElementById('sfNama').value.trim();
                        const hp = document.getElementById('sfHp').value.replace(/\D/g,'');
                        let ok = true;
                        if(nama.length < 2) { showErr('eNama', true); ok=false; } else showErr('eNama', false);
                        if(hp.length < 9) { showErr('eHp', true); ok=false; } else showErr('eHp', false);
                        if(!ok) return;
                        sfState.nama = nama; sfState.hp = hp;
                    }
                    // Validasi Step 2
                    if(step === 2) {
                        if(!acSelected) { showErr('eKec', true); return; } else showErr('eKec', false);
                        sfState.kec = acSelected.kecamatan; sfState.kab = acSelected.kota; sfState.prov = acSelected.provinsi;
                        sfState.paket = document.getElementById('sfPaket').value;
                        renderUsia();
                    }
                    // Validasi Step 3
                    if(step === 3) {
                        let ok = true; sfState.usia = [];
                        document.querySelectorAll('.u-inp').forEach((inp, idx) => {
                            const val = parseInt(inp.value);
                            const relNode = document.querySelectorAll('.u-rel')[idx];
                            const rel = relNode ? relNode.value : 'Jamaah';
                            if(isNaN(val) || val < 1) { inp.classList.add('error'); ok=false; }
                            else { inp.classList.remove('error'); sfState.usia.push({santri: rel, usia: val}); }
                        });
                        if(!ok) { showErr('eUsia', true); return; } else showErr('eUsia', false);
                        
                        // Populate summary
                        document.getElementById('sNama').textContent = sfState.nama;
                        document.getElementById('sHp').textContent = sfState.hp;
                        document.getElementById('sDom').textContent = `${sfState.kec}, ${sfState.kab}`;
                        document.getElementById('sPax').textContent = sfState.pax + ' Orang';
                        document.getElementById('sUsia').innerHTML = sfState.usia.map(u => `<span style="display:inline-block;background:#e2e8f0;padding:2px 8px;border-radius:4px;margin:2px 4px 2px 0;">${u.santri}: ${u.usia}th</span>`).join('');
                    }

                    document.getElementById('step'+step).classList.remove('active');
                    document.getElementById('step'+(step+1)).classList.add('active');
                    updateProgress(step+1);
                }

                function prevStep(step) {
                    document.getElementById('step'+step).classList.remove('active');
                    document.getElementById('step'+(step-1)).classList.add('active');
                    updateProgress(step-1);
                }

                // Autocomplete
                document.getElementById('sfKecInp').addEventListener('input', function() {
                    const q = this.value.trim();
                    const dd = document.getElementById('sfKecDd');
                    acSelected = null; showErr('eKec', false);
                    document.getElementById('sfKecBadge').innerHTML = '';
                    if(q.length < 3) { dd.classList.remove('open'); return; }
                    
                    clearTimeout(acDebounce);
                    acDebounce = setTimeout(async () => {
                        dd.innerHTML = '<div style="padding:10px;text-align:center;color:#718096;font-size:0.85rem;"><i class="fas fa-spinner fa-spin"></i> Mencari...</div>';
                        dd.classList.add('open');
                        try {
                            const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:8080/api' : '/api';
                            const res = await fetch(`${API_BASE}/wilayah/search?q=${encodeURIComponent(q)}`);
                            const data = await res.json();
                            if(!data.data || !data.data.length) {
                                dd.innerHTML = '<div style="padding:10px;text-align:center;color:#e53e3e;font-size:0.85rem;">Tidak ditemukan.</div>'; return;
                            }
                            dd.innerHTML = data.data.slice(0,10).map((r, i) => 
                                `<div class="sf-ac-item" onclick='setKec(${JSON.stringify(r)})'>
                                    <strong>${r.kecamatan}</strong>
                                    <span>${r.kota}, ${r.provinsi}</span>
                                </div>`
                            ).join('');
                        } catch(e) { dd.innerHTML = '<div style="padding:10px;text-align:center;color:#e53e3e;font-size:0.85rem;">Gagal memuat API.</div>'; }
                    }, 350);
                });

                window.setKec = function(r) {
                    acSelected = r;
                    document.getElementById('sfKecInp').value = '';
                    document.getElementById('sfKecDd').classList.remove('open');
                    document.getElementById('sfKecBadge').innerHTML = `<div class="sf-badge"><i class="fas fa-check-circle" style="margin-right:6px;"></i>${r.kecamatan}, ${r.kota}</div>`;
                }

                // Pax
                function changePax(d) {
                    sfState.pax = Math.max(1, Math.min(10, sfState.pax + d));
                    document.getElementById('paxVal').textContent = sfState.pax;
                    renderUsia();
                }

                function renderUsia() {
                    const list = document.getElementById('usiaList');
                    const existingU = Array.from(list.querySelectorAll('.u-inp')).map(el => el.value);
                    const existingR = Array.from(list.querySelectorAll('.u-rel')).map(el => el.value);
                    list.innerHTML = Array(sfState.pax).fill(0).map((_,i) => {
                        let relHtml = '';
                        if(i === 0) {
                            relHtml = `<span style="font-size:0.9rem; font-weight:600; color:var(--navy); flex:1;">Saya</span><input type="hidden" class="u-rel" value="Saya">`;
                        } else {
                            const pastRel = existingR[i] || 'Suami / Istri';
                            relHtml = `
                                <select class="sf-inp u-rel" style="flex:1; padding:8px; font-weight:600;">
                                    <option value="Suami / Istri" ${pastRel==='Suami / Istri'?'selected':''}>Suami / Istri</option>
                                    <option value="Anak" ${pastRel==='Anak'?'selected':''}>Anak</option>
                                    <option value="Orang Tua" ${pastRel==='Orang Tua'?'selected':''}>Orang Tua</option>
                                    <option value="Saudara" ${pastRel==='Saudara'?'selected':''}>Saudara</option>
                                </select>
                            `;
                        }

                        return `
                        <div class="usia-card">
                            <span class="idx">${i+1}</span>
                            ${relHtml}
                            <input type="number" class="sf-inp u-inp" style="width:80px; padding:8px;" placeholder="Usia (Thn)" min="1" value="${existingU[i]||''}" oninput="this.classList.remove('error'); showErr('eUsia',false)">
                        </div>
                        `;
                    }).join('');
                }

                // Submit
                async function submitForm() {
                    const setuju = document.getElementById('sfSetuju').checked;
                    if(!setuju) { showErr('eSetuju', true); return; } else showErr('eSetuju', false);

                    const btn = document.getElementById('btnSubmit');
                    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

                    const payload = {
                        nama_lengkap: sfState.nama, whatsapp_num: sfState.hp,
                        domisili: `${sfState.kec}, ${sfState.kab}, ${sfState.prov}`,
                        yang_berangkat: sfState.pax + ' Jamaah',
                        jamaah_usia_detail: sfState.usia,
                        paket_pilihan: sfState.paket || 'Umrah Liburan',
                        fasilitas_utama: 'Bersedia Dihubungi',
                        landing_page: window.location.href, form_source: 'liburan-26-sf'
                    };

                    const API_URL = window.location.protocol === 'file:' ? 'http://localhost:8080/api/leads' : '/api/leads';
                    try {
                        await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
                        try{ gtag('event','generate_lead',{send_to:'G-11PXTCBM9L'}); fbq('track','Lead'); }catch(e){}
                    } catch(e) {}

                    // Hide form, show thanks
                    document.getElementById('pLabel').style.display = 'none';
                    document.querySelector('.sf-prog-track').style.display = 'none';
                    document.getElementById('progForm').style.display = 'none';
                    document.getElementById('sfThankYou').style.display = 'block';
                }

/* ---- */

(function () {
            var LP_FOLDER = 'lp-liburan-short';
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
                    window.__MUNIRA_FORM_ID__ = form._id;
                    window.__MUNIRA_ROTATOR_MODE__ = form.rotator_mode || 'round_robin';

                    // Dev indicator badge
                    var b = document.createElement('div');
                    b.style.cssText = 'position:fixed;bottom:60px;right:16px;z-index:9999;background:rgba(34,211,238,0.9);color:#0c0f1a;font-size:0.65rem;padding:4px 10px;border-radius:20px;font-weight:700;pointer-events:none;';
                    b.textContent = '\u26A1 Short Form: ' + (form.name || 'Dynamic');
                    document.body.appendChild(b);
                    setTimeout(function () { b.remove(); }, 4000);
                    console.log('[MuniraInject] Short Form "' + form.name + '" ready. WA: ' + (form.wa_rotator || []).length + ' CS');
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