// RUPIAH UTILITIES — Global formatter system
// ============================================================

/**
 * Tampil singkat: 35.000.000 → "35jt" | 1.500.000 → "1,5jt" | 500.000 → "500rb" | 1500 -> "$1,500"
 */
function formatRpShort(n) {
    if (!n || n == 0) return '0';
    // Auto-detect Dollar (Umrah packages < 100_000 are usually USD)
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US');
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'jt';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb';
    return String(n);
}

/**
 * Display lengkap dengan titik: 35000000 → "35.000.000"
 */
function formatRpDot(n) {
    if (!n || n == 0) return '0';
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US');
    return Number(n).toLocaleString('id-ID');
}

/**
 * Display KPI: "Rp 35jt" or "Rp 35.000.000" jika < 1jt
 */
function formatRpKPI(n) {
    if (!n || n == 0) return 'Rp 0';
    if (n < 100_000) return '$' + Number(n).toLocaleString('en-US'); // Auto Dollar
    if (n >= 1_000_000) return 'Rp ' + formatRpShort(n);
    return 'Rp ' + formatRpDot(n);
}

/**
 * Parse nilai dari input yg sudah diformat (hapus titik)
 */
function parseRpInput(str) {
    if (!str) return 0;
    const s = String(str).toLowerCase().trim().replace(/ /g, '');
    let rawStr = s.replace(/[^0-9.,]/g, '');

    // Convert 1,5jt to 1.5 format for math
    rawStr = rawStr.replace(/,/g, '.');
    // Ensure we only keep the last decimal separator if there are multiple dots from grouping
    const parts = rawStr.split('.');
    const decimal = parts.length > 1 && parts[parts.length - 1].length <= 2 ? '.' + parts.pop() : '';
    const numRaw = parts.join('') + decimal;

    let num = parseFloat(numRaw) || 0;

    if (s.includes('jt') || s.includes('j')) return Math.round(num * 1_000_000);
    if (s.includes('m')) return Math.round(num * 1_000_000_000);
    if (s.includes('k') || s.includes('rb')) return Math.round(num * 1_000);

    // fallback plain input
    return parseInt(s.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
}

/**
 * Pasang auto-dot-formatter ke elemen input (type=text)
 * Saat user ketik, angka otomatis dipisah titik per 3 digit
 */
function attachRpFormatter(el) {
    if (!el || el.dataset.rpAttached) return;
    el.dataset.rpAttached = '1';
    el.setAttribute('inputmode', 'numeric');
    el.setAttribute('autocomplete', 'off');
    el.placeholder = el.placeholder || 'mis: 35.000.000';

    el.addEventListener('input', function () {
        const val = this.value.toLowerCase().trim();
        if (val === '') { this.value = ''; return; }

        // If user typed 'k', 'jt', 'm', parse it instantly and format it back to short form
        if (/[kjmbt]$/.test(val)) {
            const parsed = parseRpInput(val);
            if (parsed) {
                this.value = formatRpShort(parsed);
            }
            return; // Let them finish or blur
        }

        // Just numeric input -> auto dot
        const pos = this.selectionStart;
        const raw = val.replace(/\./g, '').replace(/[^0-9]/g, '');
        if (raw === '') return;
        const formatted = Number(raw).toLocaleString('id-ID');
        const diff = formatted.length - this.value.length;
        this.value = formatted;

        // Restore cursor
        try { this.setSelectionRange(pos + diff, pos + diff); } catch (e) { }
    });

    // On blur, force short format
    el.addEventListener('blur', function () {
        if (this.value) {
            const parsed = parseRpInput(this.value);
            if (parsed) this.value = formatRpShort(parsed);
            else this.value = '';
        }
    });

    el.addEventListener('keydown', function (e) {
        // Allow backspace, delete, arrows, tab
        if ([8, 46, 37, 38, 39, 40, 9].includes(e.keyCode)) return;
        // Allow ctrl+a, ctrl+c, ctrl+v
        if (e.ctrlKey || e.metaKey) return;
        // Block non-numeric AND non-shortcut chars
        if (!/[0-9kKjJtTmMbBrR,.]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

/**
 * Set nilai ke rp-input (sudah formatted)
 */
function setRpInput(el, value) {
    if (!el) return;
    if (!value || value == 0) { el.value = ''; return; }
    el.value = Number(value).toLocaleString('id-ID');
}

/**
 * Init semua .rp-input di DOM
 */
function initAllRpInputs() {
    document.querySelectorAll('.rp-input').forEach(attachRpFormatter);
}


// ============================================================
