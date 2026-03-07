const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');
const PageSetting = require('../models/PageSetting');
const Program = require('../models/Program');
const Form = require('../models/Form');

// Helper: extract <title> and image from HTML
function extractPageMeta(htmlPath) {
    try {
        const html = fs.readFileSync(htmlPath, 'utf8');
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;
        const ogMatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
        let image = ogMatch ? ogMatch[1] : null;
        if (!image) {
            const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            image = imgMatch ? imgMatch[1] : null;
        }
        return { title, image };
    } catch (e) {
        return { title: null, image: null };
    }
}

// PUBLIC: GET /api/pages/cover?folder=lp-xxx
router.get('/cover', async (req, res) => {
    const { folder } = req.query;
    if (!folder) return res.json({ success: false, image_url: null, description: null });
    try {
        const row = await PageSetting.findOne({ folder });
        res.json({
            success: true,
            image_url: row?.image_url || null,
            description: row?.description || null
        });
    } catch (e) {
        res.json({ success: false, image_url: null, description: null });
    }
});

// PUBLIC: GET /api/pages/packages
router.get('/packages', async (req, res) => {
    try {
        const rootDir = path.join(__dirname, '..', '..');
        const allSettings = await PageSetting.find().lean();
        const pageSettings = {};
        allSettings.forEach(r => { pageSettings[r.folder] = r; });

        const packages = [];
        const items = fs.readdirSync(rootDir, { withFileTypes: true });
        for (const item of items) {
            if (!item.isDirectory() || !item.name.startsWith('lp-')) continue;
            const mainIndex = path.join(rootDir, item.name, 'index.html');
            if (!fs.existsSync(mainIndex)) continue;
            const html = fs.readFileSync(mainIndex, 'utf8');
            const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : item.name;
            const dbEntry = pageSettings[item.name] || {};
            packages.push({
                folder: item.name,
                title,
                url: `/${item.name}/index.html`,
                image_url: dbEntry.image_url || null,
                description: dbEntry.description || ''
            });
        }
        res.json({ success: true, packages });
    } catch (e) {
        res.json({ success: false, packages: [] });
    }
});

// PUBLIC: GET /api/pages/:folder/config
// Returns the LP's linked Form + Programs for LP frontend to consume dynamically
router.get('/:folder(*)/config', async (req, res) => {
    const { folder } = req.params;
    try {
        const setting = await PageSetting.findOne({ folder }).lean();
        if (!setting) return res.json({ success: true, form: null, programs: [] });

        let form = null;
        let programs = [];

        if (setting.linked_form_id) {
            try {
                form = await Form.findById(setting.linked_form_id).lean();
                if (form) delete form.rotator_index; // don't expose
            } catch (e) { form = null; }
        }

        if (setting.linked_program_ids && setting.linked_program_ids.length > 0) {
            programs = await Program.find({
                _id: { $in: setting.linked_program_ids },
                is_active: true
            }).sort({ sort_order: 1 }).lean();
        }

        res.json({ success: true, form, programs });
    } catch (err) {
        console.error('Error fetching LP config:', err);
        res.status(500).json({ success: false, form: null, programs: [] });
    }
});

// GET /api/pages (protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const rootDir = path.join(__dirname, '..', '..');
        const allSettings = await PageSetting.find().lean();
        const pageSettings = {};
        allSettings.forEach(r => { pageSettings[r.folder] = r; });

        const pages = [];

        const rootIndex = path.join(rootDir, 'index.html');
        if (fs.existsSync(rootIndex)) {
            const meta = extractPageMeta(rootIndex);
            const dbEntry = pageSettings['root'] || {};
            pages.push({
                title: meta.title || 'Home / Root Domain',
                alias: 'Homepage Utama',
                url: '/',
                status: 'Live',
                path: 'index.html',
                image: dbEntry.image_url || meta.image,
                description: dbEntry.description || '',
                folder: 'root',
                linked_form_id: dbEntry.linked_form_id || '',
                linked_program_ids: dbEntry.linked_program_ids || [],
                is_default: dbEntry.is_default || false
            });
        }

        const items = fs.readdirSync(rootDir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory() && item.name.startsWith('lp-')) {
                const folderPath = path.join(rootDir, item.name);
                const mainIndex = path.join(folderPath, 'index.html');
                if (fs.existsSync(mainIndex)) {
                    const meta = extractPageMeta(mainIndex);
                    const dbEntry = pageSettings[item.name] || {};
                    pages.push({
                        title: meta.title || `Landing Page: ${item.name}`,
                        alias: item.name,
                        url: `/${item.name}/index.html`,
                        status: 'Live',
                        path: `${item.name}/index.html`,
                        image: dbEntry.image_url || meta.image,
                        description: dbEntry.description || '',
                        folder: item.name,
                        linked_form_id: dbEntry.linked_form_id || '',
                        linked_program_ids: dbEntry.linked_program_ids || [],
                        is_default: dbEntry.is_default || false
                    });
                }

                const files = fs.readdirSync(folderPath);
                for (const f of files) {
                    if (f.startsWith('index-') && f.endsWith('.html')) {
                        const meta = extractPageMeta(path.join(folderPath, f));
                        const variantFolder = `${item.name}/${f.replace('.html', '')}`;
                        const dbEntry = pageSettings[variantFolder] || {};
                        pages.push({
                            title: meta.title || `Variant: ${item.name} (${f})`,
                            alias: `${item.name} / ${f.replace('.html', '')}`,
                            url: `/${item.name}/${f}`,
                            status: 'Live',
                            path: `${item.name}/${f}`,
                            image: dbEntry.image_url || meta.image,
                            description: dbEntry.description || '',
                            folder: variantFolder,
                            linked_form_id: dbEntry.linked_form_id || '',
                            linked_program_ids: dbEntry.linked_program_ids || [],
                            is_default: dbEntry.is_default || false
                        });
                    }
                }
            }

            if (item.isDirectory() && item.name === 'dist') {
                const folderPath = path.join(rootDir, item.name);
                const files = fs.readdirSync(folderPath);
                for (const f of files) {
                    if (f.endsWith('.html')) {
                        const meta = extractPageMeta(path.join(folderPath, f));
                        const distFolder = `dist/${f.replace('.html', '')}`;
                        const dbEntry = pageSettings[distFolder] || {};
                        pages.push({
                            title: meta.title || `Distribution: ${f}`,
                            alias: `dist/${f.replace('.html', '')}`,
                            url: `/dist/${f}`,
                            status: 'Draft',
                            path: `dist/${f}`,
                            image: dbEntry.image_url || meta.image,
                            description: dbEntry.description || '',
                            folder: distFolder,
                            linked_form_id: dbEntry.linked_form_id || '',
                            linked_program_ids: dbEntry.linked_program_ids || [],
                            is_default: dbEntry.is_default || false
                        });
                    }
                }
            }
        }

        res.json({ success: true, pages });
    } catch (err) {
        console.error('Error fetching pages:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/pages/:folder
router.put('/:folder(*)', verifyToken, async (req, res) => {
    const { folder } = req.params;
    const { image_url, description, linked_form_id, linked_program_ids, is_default } = req.body;

    try {
        const updateData = {
            image_url: image_url || '',
            description: description || ''
        };
        if (linked_form_id !== undefined) updateData.linked_form_id = linked_form_id;
        if (linked_program_ids !== undefined) {
            updateData.linked_program_ids = Array.isArray(linked_program_ids)
                ? linked_program_ids.filter(id => id)
                : [];
        }

        if (is_default === true) {
            await PageSetting.updateMany({}, { $set: { is_default: false } });
            updateData.is_default = true;
        } else if (is_default === false) {
            updateData.is_default = false;
        }

        await PageSetting.findOneAndUpdate(
            { folder },
            { $set: updateData },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: 'Page settings updated' });
    } catch (err) {
        console.error('Error updating page settings:', err);
        res.status(500).json({ success: false, message: 'Failed to update page settings' });
    }
});

// GET /api/pages/default
router.get('/default', async (req, res) => {
    try {
        const defaultPage = await PageSetting.findOne({ is_default: true });
        if (!defaultPage) {
            return res.json({ success: true, folder: 'lp-liburan', url: '/lp-liburan/index.html' });
        }
        const url = defaultPage.folder === 'root' ? '/' : `/${defaultPage.folder}/index.html`;
        res.json({ success: true, folder: defaultPage.folder, url });
    } catch (err) {
        res.json({ success: true, folder: 'lp-liburan', url: '/lp-liburan/index.html' });
    }
});

// POST /api/pages (dummy product builder)
router.post('/', verifyToken, async (req, res) => {
    const payload = req.body;
    try {
        const dummyUrl = `/lp-custom/${payload.slug || 'new-page'}/index.html`;
        res.json({ success: true, url: dummyUrl, message: 'Page generation simulated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to generate page' });
    }
});

module.exports = router;
