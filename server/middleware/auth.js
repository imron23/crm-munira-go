const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'munira_secret_key_2026_CHANGE_IN_PROD';

// Sanitize input against NoSQL injection
const sanitizeInput = (obj) => {
    // Handle arrays: sanitize each element individually
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeInput(item));
    }
    if (typeof obj !== 'object' || obj === null) return obj;
    const clean = {};
    for (const key of Object.keys(obj)) {
        // Strip keys starting with $ (MongoDB operators)
        if (key.startsWith('$')) continue;
        const val = obj[key];
        if (typeof val === 'string') {
            // Basic XSS strip: remove script tags and event handlers
            clean[key] = val
                .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
                .substring(0, 5000); // max length guard
        } else if (Array.isArray(val)) {
            // Recursively sanitize arrays
            clean[key] = val.map(item => sanitizeInput(item));
        } else if (typeof val === 'object' && val !== null) {
            // Reject objects with $ operators (NoSQLi guard)
            const hasOperator = Object.keys(val).some(k => k.startsWith('$'));
            if (hasOperator) {
                clean[key] = ''; // neutralize
            } else {
                clean[key] = sanitizeInput(val);
            }
        } else {
            clean[key] = val;
        }
    }
    return clean;
};

// Middleware: sanitize req.body
const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeInput(req.body);
    }
    next();
};

// Middleware: verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token diperlukan untuk autentikasi' });
    }

    try {
        const bearer = token.split(' ')[1] || token;
        const decoded = jwt.verify(bearer, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa' });
    }
    return next();
};

// Middleware: require specific role(s)
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Hanya ${roles.join(' atau ')} yang bisa mengakses fitur ini`
        });
    }
    next();
};

// Middleware: require super_admin or admin
const requireAdmin = requireRole('super_admin', 'admin');

// Middleware: require super_admin only
const requireSuperAdmin = requireRole('super_admin');

module.exports = { verifyToken, requireAdmin, requireSuperAdmin, sanitizeBody, JWT_SECRET };
