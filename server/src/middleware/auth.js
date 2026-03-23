/**
 * Admin Authentication Middleware
 * Supports both API Key and JWT token authentication
 */

const jwt = require('jsonwebtoken');

// Admin API keys (in production, load from environment variables)
const ADMIN_API_KEYS = [
  process.env.ADMIN_API_KEY || 'bishop-admin-key-2024-secret'
];

// JWT secret (in production, use strong secret from environment)
const JWT_SECRET = process.env.JWT_SECRET || 'bishop-jwt-secret-change-in-production';

/**
 * Middleware: Verify admin authentication
 * Expects either:
 * 1. Header: Authorization: Bearer <api-key>
 * 2. Header: Authorization: Bearer <jwt-token>
 * 3. Query param: ?apiKey=<api-key>
 */
function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const queryKey = req.query.apiKey;

  // Check API key from header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Try API key first
    if (ADMIN_API_KEYS.includes(token)) {
      return next();
    }

    // Try JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') {
        req.admin = decoded;
        return next();
      }
    } catch (err) {
      // JWT verification failed, continue to error
    }
  }

  // Check API key from query params
  if (queryKey && ADMIN_API_KEYS.includes(queryKey)) {
    return next();
  }

  // No valid auth found
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Admin authentication required. Use Authorization: Bearer <api-key> header or ?apiKey=<key> query param'
  });
}

/**
 * Utility: Generate JWT token for admin
 * Usage: Call this once during setup to generate a token
 */
function generateAdminToken(adminId = 'admin-1', expiresIn = '30d') {
  const token = jwt.sign(
    { adminId, role: 'admin' },
    JWT_SECRET,
    { expiresIn }
  );
  return token;
}

module.exports = adminAuthMiddleware;
module.exports.generateAdminToken = generateAdminToken;
module.exports.JWT_SECRET = JWT_SECRET;
