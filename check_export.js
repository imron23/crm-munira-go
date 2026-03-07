const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Listen for console logs
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:3000/Imron23', { waitUntil: 'load' });

    // Login
    await page.evaluate(() => {
        document.getElementById('loginUser').value = 'Imron23';
        document.getElementById('loginPass').value = 'Imunira234..';
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Switch to Leads tab
    await page.evaluate(() => {
        const _showToast = window.showToast;
        window.showToast = (msg, type) => {
            console.log("TOAST:", msg, type);
            if (_showToast) _showToast(msg, type);
        };
        const leadsTab = document.querySelector('.nav-link[data-target="leads"]');
        if (leadsTab) leadsTab.click();
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Click Export
    await page.evaluate(() => {
        const btn = document.getElementById('btnExport');
        if (btn) btn.click();
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await browser.close();
})();
