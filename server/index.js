require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { sanitizeBody } = require('./middleware/auth');

const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');
const pagesRouter = require('./routes/pages');
const programsRouter = require('./routes/programs');
const teamRouter = require('./routes/team');
const formsRouter = require('./routes/forms');
const wilayahRouter = require('./routes/wilayah');
const trashRouter = require('./routes/trash');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'http://localhost:3000']
        : true,
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global sanitization middleware (NoSQLi + XSS guard)
app.use(sanitizeBody);

// Serve static files - dashboard hidden under /Imron23
app.use('/Imron23', express.static(path.join(__dirname, '..', 'dashboard'), {
    etag: false,
    lastModified: false,
    setHeaders: (res, filePath) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));
// Homepage → LP Liburan Long
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'lp-2-long', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/programs', programsRouter);
app.use('/api/team', teamRouter);
app.use('/api/forms', formsRouter);
app.use('/api/wilayah', wilayahRouter);
app.use('/api/trash', trashRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Munira World CRM API is running (MongoDB)',
        version: '2.0.0',
        features: ['auth', 'roles', 'team-management', 'status-history', 'telegram-alerts', 'security']
    });
});

// 404 handler for API
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Bootstrap: connect DB → seed admin → auto-seed leads → start server
const bootstrap = async () => {
    await connectDB();

    const bcrypt = require('bcryptjs');
    const AdminUser = require('./models/AdminUser');
    const ADMIN_USER = process.env.ADMIN_USER || 'Imron23';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'Imunira234..';

    const existing = await AdminUser.findOne({ username: ADMIN_USER });
    if (!existing) {
        const hash = bcrypt.hashSync(ADMIN_PASS, 12);
        await AdminUser.create({
            username: ADMIN_USER,
            password_hash: hash,
            role: 'super_admin',
            full_name: 'Super Admin',
            avatar_initial: 'S',
            is_active: true,
            permissions: {
                can_delete: true,
                can_export: true,
                can_manage_team: true,
                can_view_revenue: true,
            }
        });
        console.log('[Bootstrap] Default super_admin created:', ADMIN_USER);
    } else if (existing.role !== 'super_admin') {
        // Upgrade existing admin to super_admin
        await AdminUser.findByIdAndUpdate(existing._id, { role: 'super_admin' });
        console.log('[Bootstrap] Existing admin upgraded to super_admin:', ADMIN_USER);
    }

    // Auto-seed sample leads if database is empty
    try {
        const Lead = require('./models/Lead');
        const leadCount = await Lead.countDocuments();
        if (leadCount === 0) {
            console.log('[Bootstrap] Database leads kosong, menjalankan auto-seed...');
            const { execSync } = require('child_process');
            execSync('node seed_100_leads_mongo.js', {
                cwd: path.join(__dirname, '..'),
                stdio: 'inherit',
                env: { ...process.env, MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/munira_crm' }
            });
            console.log('[Bootstrap] Auto-seed selesai! 100 sample leads ditambahkan.');
        } else {
            console.log(`[Bootstrap] Database sudah ada ${leadCount} leads, skip auto-seed.`);
        }
    } catch (seedErr) {
        console.error('[Bootstrap] Auto-seed error (non-fatal):', seedErr.message);
    }

    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(`🚀 Munira CRM Server running on port ${PORT}`);
        console.log(`📦 Database: MongoDB (Mongoose)`);
        console.log(`🔐 Security: JWT + NoSQLi Guard + XSS Filter`);
        console.log(`👥 Roles: super_admin, admin, sales, viewer`);
        console.log(`📊 Features: Status History, Team Mgmt, Telegram`);
        console.log(`Dashboard: http://localhost:${PORT}/Imron23`);
        console.log(`API:       http://localhost:${PORT}/api/leads`);
        console.log(`=========================================`);
    });
};

bootstrap();
