/**
 * Database utilities - Simple JSON file storage
 * Production note: For production scale, migrate to PostgreSQL/MongoDB
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

/**
 * Ensure data directory and files exist
 */
async function initializeDatabase() {
  try {
    // Create data directory
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Create members.json if it doesn't exist
    try {
      await fs.stat(MEMBERS_FILE);
    } catch (err) {
      // File doesn't exist, create it
      await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2));
      console.log('✅ Created members.json');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Read all members from database
 * @returns {Promise<Array>}
 */
async function readMembers() {
  try {
    const data = await fs.readFile(MEMBERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, initialize it
      await initializeDatabase();
      return [];
    }
    throw error;
  }
}

/**
 * Write all members to database
 * @param {Array} members 
 * @returns {Promise<void>}
 */
async function writeMembers(members) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
}

/**
 * Get member by ID
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function getMemberById(id) {
  const members = await readMembers();
  return members.find(m => m.id === id) || null;
}

/**
 * Get member by email
 * @param {string} email 
 * @returns {Promise<Object|null>}
 */
async function getMemberByEmail(email) {
  const members = await readMembers();
  return members.find(m => m.email === email) || null;
}

/**
 * Get members by payment status
 * @param {string} status - 'pending', 'paid', or 'overdue'
 * @returns {Promise<Array>}
 */
async function getMembersByStatus(status) {
  const members = await readMembers();
  return members.filter(m => m.paymentStatus === status);
}

/**
 * Get members by membership tier
 * @param {string} tier - 'basic', 'standard', or 'premium'
 * @returns {Promise<Array>}
 */
async function getMembersByTier(tier) {
  const members = await readMembers();
  return members.filter(m => m.membershipTier === tier);
}

/**
 * Get summary statistics
 * @returns {Promise<Object>}
 */
async function getStatistics() {
  const members = await readMembers();
  
  const stats = {
    totalMembers: members.length,
    paid: members.filter(m => m.paymentStatus === 'paid').length,
    pending: members.filter(m => m.paymentStatus === 'pending').length,
    overdue: members.filter(m => m.paymentStatus === 'overdue').length,
    byTier: {
      basic: members.filter(m => m.membershipTier === 'basic').length,
      standard: members.filter(m => m.membershipTier === 'standard').length,
      premium: members.filter(m => m.membershipTier === 'premium').length
    },
    revenue: {
      paid: members
        .filter(m => m.paymentStatus === 'paid')
        .reduce((sum, m) => sum + (m.amount || 0), 0),
      pending: members
        .filter(m => m.paymentStatus === 'pending')
        .reduce((sum, m) => sum + (m.amount || 0), 0)
    }
  };

  return stats;
}

// Initialize database on module load
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = {
  readMembers,
  writeMembers,
  getMemberById,
  getMemberByEmail,
  getMembersByStatus,
  getMembersByTier,
  getStatistics,
  initializeDatabase
};
