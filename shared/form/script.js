document.addEventListener('DOMContentLoaded', () => {
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    const form = document.getElementById('leadForm');

    let currentStep = 1;

    // --- API WILAYAH LOGIC ---
    const provSelect = document.getElementById('provinsi');
    const kabSelect = document.getElementById('kabupaten');
    const kecSelect = document.getElementById('kecamatan');

    if (provSelect) {
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    provSelect.appendChild(opt);
                });
            })
            .catch(err => console.error("Error loading provinces:", err));

        provSelect.addEventListener('change', function () {
            kabSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
            kabSelect.disabled = true;
            kecSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan...</option>';
            kecSelect.disabled = true;

            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${this.value}.json`)
                .then(res => res.json())
                .then(data => {
                    kabSelect.innerHTML = '<option value="" disabled selected>Pilih Kabupaten...</option>';
                    data.forEach(r => {
                        const opt = document.createElement('option');
                        opt.value = r.id;
                        opt.textContent = r.name;
                        kabSelect.appendChild(opt);
                    });
                    kabSelect.disabled = false;
                });
        });

        kabSelect.addEventListener('change', function () {
            kecSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
            kecSelect.disabled = true;

            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${this.value}.json`)
                .then(res => res.json())
                .then(data => {
                    kecSelect.innerHTML = '<option value="" disabled selected>Pilih Kecamatan...</option>';
                    data.forEach(d => {
                        const opt = document.createElement('option');
                        opt.value = d.id;
                        opt.textContent = d.name;
                        kecSelect.appendChild(opt);
                    });
                    kecSelect.disabled = false;
                });
        });
    }
    // --- END API LOGIC ---

    // NEXT button logic
    nextBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const nextStepIdx = parseInt(e.currentTarget.getAttribute('data-next'));
            if (validateStep(currentStep)) {
                showStep(nextStepIdx);
            }
        });
    });

    // PREV button logic
    prevBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const prevStepIdx = parseInt(e.currentTarget.getAttribute('data-prev'));
            showStep(prevStepIdx);
        });
    });

    function showStep(stepNum) {
        // Hide all
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(p => p.classList.remove('active', 'completed'));

        // Show correct step
        document.getElementById(`step${stepNum}`).classList.add('active');

        // Update Progress Bar
        progressSteps.forEach((p, idx) => {
            const pStep = idx + 1;
            if (pStep < stepNum) {
                p.classList.add('completed');
            } else if (pStep === stepNum) {
                p.classList.add('active');
            }
        });

        currentStep = stepNum;

        // Smooth scroll to top of form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Validation logic for each step
    function validateStep(stepNum) {
        let isValid = true;
        const step = document.getElementById(`step${stepNum}`);
        const requiredInputs = step.querySelectorAll('input[required]:not([type="checkbox"]), select[required]');

        // Clear previous errors
        step.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        const errElems = step.querySelectorAll('.error-msg');
        errElems.forEach(el => el.style.display = 'none');

        // Text & Select fields
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            }
        });

        // Special Rule for WA (Only Numbers) if present
        const nomorWA = step.querySelector('#nomorWA');
        if (nomorWA && !/^[0-9]+$/.test(nomorWA.value)) {
            nomorWA.classList.add('error');
            isValid = false;
        }

        // Special Radio/Checkbox Validation for Step 3
        if (stepNum === 3) {
            const pasporChecked = step.querySelector('input[name="statusPaspor"]:checked');
            if (!pasporChecked) {
                step.querySelector('.radio-group-vertical').classList.add('error');
                isValid = false;
            }

            const bayarChecked = step.querySelector('input[name="metodePembayaran"]:checked');
            if (!bayarChecked) {
                step.querySelector('.horizontal').classList.add('error');
                isValid = false;
            }

            const persetujuanCheckbox = step.querySelector('#persetujuan');
            if (persetujuanCheckbox && !persetujuanCheckbox.checked) {
                document.getElementById('err-persetujuan').style.display = 'block';
                isValid = false;
            }
        }

        return isValid;
    }

    // Remove red borders on input
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => {
            el.classList.remove('error');
            const parentGroup = el.closest('.form-group');
            if (parentGroup) {
                const radioGroups = parentGroup.querySelectorAll('.radio-group-vertical, .horizontal');
                radioGroups.forEach(rg => rg.classList.remove('error'));
            }
        });
    });

    // Handle Form Submit
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateStep(3)) return;

            const overlay = document.getElementById('formLoadingOverlay');
            overlay.classList.add('active');

            // Format number string for DB display
            const jmlPeserta = document.getElementById('jumlahPeserta').value + ' Orang (' + document.getElementById('rencanaKeberangkatan').value + ')';

            const provText = document.getElementById('provinsi') ? document.getElementById('provinsi').options[document.getElementById('provinsi').selectedIndex]?.text : '';
            const kabText = document.getElementById('kabupaten') ? document.getElementById('kabupaten').options[document.getElementById('kabupaten').selectedIndex]?.text : '';
            const kecText = document.getElementById('kecamatan') ? document.getElementById('kecamatan').options[document.getElementById('kecamatan').selectedIndex]?.text : '';
            const fullDomisili = (provText && kecText) ? `${kecText}, ${kabText}, ${provText}` : 'N/A';

            const payload = {
                nama_lengkap: document.getElementById('namaLengkap').value,
                whatsapp_num: document.getElementById('nomorWA').value,
                domisili: fullDomisili,
                yang_berangkat: jmlPeserta,
                paket_pilihan: document.getElementById('pilihanPaket').value,
                kesiapan_paspor: document.querySelector('input[name="statusPaspor"]:checked').value,
                fasilitas_utama: document.querySelector('input[name="metodePembayaran"]:checked').value, // Used for payment method mapping
                landing_page: window.location.pathname
            };

            // Call to your Lead Database Endpoint
            // We use the same structural endpoint /api/leads but modifying backend logic
            const API_URL = (window.location.protocol === 'file:' || window.location.port === '3000') ? 'http://localhost:3000/api/leads' : '/api/leads';
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                // Formatting WhatsApp message based on logic
                let text = `Assalamu'alaikum Konsultan Munira World,
Saya tertarik merencanakan Umrah.

Nama: ${payload.nama_lengkap}
Domisili: ${payload.domisili}
Pengalaman: ${document.getElementById('pengalamanUmrah').value}
Rencana: ${document.getElementById('rencanaKeberangkatan').value}
Jumlah: ${document.getElementById('jumlahPeserta').value} Pax
Paket: ${payload.paket_pilihan}
Paspor: ${payload.kesiapan_paspor}
Bayar: ${payload.fasilitas_utama}

Mohon info jadwal dan estimasinya.`;

                const waLink = `https://wa.me/6285261349134?text=${encodeURIComponent(text)}`;
                overlay.classList.remove('active');
                window.top.location.href = waLink;
            }).catch(err => {
                console.error(err);
                overlay.classList.remove('active');
                // Failsafe to WA
                window.top.location.href = 'https://wa.me/6285261349134';
            });
        });
    }

});
