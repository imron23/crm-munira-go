const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'munira.db');
const schemaPath = path.join(__dirname, '..', 'schema.sql');

console.log('Initializing database...');

// Create new database (or open existing)
const db = new Database(dbPath);

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// Migrations — add new columns if missing
try {
    db.exec("ALTER TABLE leads ADD COLUMN revenue INTEGER DEFAULT 0");
    console.log('Migration: revenue column added.');
} catch (e) { /* exists */ }
try {
    db.exec("ALTER TABLE leads ADD COLUMN program_id TEXT");
    console.log('Migration: program_id column added.');
} catch (e) { /* exists */ }
try {
    db.exec("ALTER TABLE leads ADD COLUMN rencana_umrah VARCHAR(100)");
    console.log('Migration: rencana_umrah column added.');
} catch (e) { /* exists */ }
try {
    db.exec("ALTER TABLE programs ADD COLUMN departure_dates TEXT");
    console.log('Migration: departure_dates column added to programs.');
} catch (e) { /* exists */ }

console.log('Schema created successfully.');

// Admin credentials from ENV (fallback to defaults)
const ADMIN_USER = process.env.ADMIN_USER || 'Imron23';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Imunira234..';

// Create a default admin user if it doesn't exist
const checkAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?');
const defaultAdmin = checkAdmin.get(ADMIN_USER);

if (!defaultAdmin) {
    const insertAdmin = db.prepare(
        'INSERT INTO admin_users (id, username, password_hash, role) VALUES (?, ?, ?, ?)'
    );

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(ADMIN_PASS, salt);

    const id = require('crypto').randomUUID();
    insertAdmin.run(id, ADMIN_USER, hash, 'admin');

    console.log('Default admin user created.');
    console.log('Username:', ADMIN_USER);
} else {
    // If admin exists, update password in case ENV changed
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(ADMIN_PASS, salt);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, ADMIN_USER);
    console.log('Admin password synced from ENV.');
}

// Check if leads table is empty, if so, seed it
try {
    const leadsCount = db.prepare('SELECT COUNT(*) as count FROM leads').get();
    if (leadsCount && leadsCount.count === 0) {
        console.log('[Auto-Init] Leads table is empty. Seeding 50 rows...');
        const seedPath = path.join(__dirname, '..', '..', 'seed_50_leads.js');
        if (fs.existsSync(seedPath)) {
            require('child_process').execSync('node "' + seedPath + '"', { env: process.env, stdio: 'inherit' });
            console.log('[Auto-Init] Finished seeding.');
        }
    }
} catch (e) {
    console.log('Error checking leads:', e.message);
}

db.close();
console.log('Database initialization complete.');
