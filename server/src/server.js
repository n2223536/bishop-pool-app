/**
 * Bishop Estates Cabana Club - Backend API Server
 * Node.js + Express
 * 
 * Endpoints:
 * - POST /api/signup - Accept and validate member signups
 * - GET /api/admin/members - List all members (admin-only)
 * - PUT /api/admin/members/:id/status - Update payment status (admin-only)
 * - POST /api/webhook/jotform - JotForm webhook for auto-signup
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const adminAuthMiddleware = require('./middleware/auth');
const { generateVenmoLink, validateEmail, generateMemberId } = require('./utils/helpers');
const { readMembers, writeMembers } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '../data');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
})();

/**
 * POST /api/signup
 * Accept new member signup form data
 * Body: { firstName, lastName, email, phone, membershipTier }
 */
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, membershipTier } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, phone'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['basic', 'standard', 'premium'].includes(membershipTier)) {
      return res.status(400).json({ 
        error: 'Invalid membership tier. Must be: basic, standard, or premium' 
      });
    }

    // Read existing members
    const members = await readMembers();

    // Check if email already exists
    if (members.some(m => m.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new member record
    const newMember = {
      id: generateMemberId(),
      firstName,
      lastName,
      email,
      phone,
      membershipTier,
      paymentStatus: 'pending', // pending, paid, overdue
      amount: getTierAmount(membershipTier),
      venmoLink: generateVenmoLink('bishop-cabana-club', getTierAmount(membershipTier)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to members list
    members.push(newMember);
    await writeMembers(members);

    res.status(201).json({
      success: true,
      message: 'Member signup successful',
      member: newMember
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/members
 * Retrieve all members (admin-only)
 */
app.get('/api/admin/members', adminAuthMiddleware, async (req, res) => {
  try {
    const members = await readMembers();
    
    // Optional: filter by status query param
    const { status } = req.query;
    const filtered = status 
      ? members.filter(m => m.paymentStatus === status)
      : members;

    res.json({
      success: true,
      count: filtered.length,
      members: filtered
    });
  } catch (error) {
    console.error('Error reading members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/members/:id
 * Retrieve a single member by ID (admin-only)
 */
app.get('/api/admin/members/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const members = await readMembers();
    const member = members.find(m => m.id === id);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ success: true, member });
  } catch (error) {
    console.error('Error reading member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/members/:id/status
 * Update member payment status (admin-only)
 * Body: { paymentStatus } where paymentStatus is 'pending', 'paid', or 'overdue'
 */
app.put('/api/admin/members/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'overdue'].includes(paymentStatus)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, paid, or overdue' 
      });
    }

    const members = await readMembers();
    const memberIndex = members.findIndex(m => m.id === id);

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    members[memberIndex].paymentStatus = paymentStatus;
    members[memberIndex].updatedAt = new Date().toISOString();

    await writeMembers(members);

    res.json({
      success: true,
      message: 'Member status updated',
      member: members[memberIndex]
    });
  } catch (error) {
    console.error('Error updating member status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/members/:id
 * Delete a member (admin-only)
 */
app.delete('/api/admin/members/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const members = await readMembers();
    const filtered = members.filter(m => m.id !== id);

    if (filtered.length === members.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await writeMembers(filtered);

    res.json({
      success: true,
      message: 'Member deleted'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/webhook/jotform
 * Webhook endpoint for JotForm submissions
 * Expects JotForm webhook payload with form field data
 */
app.post('/api/webhook/jotform', async (req, res) => {
  try {
    // JotForm sends form data as: { rawRequest: { firstName, lastName, email, phone, membershipTier } }
    const { firstName, lastName, email, phone, membershipTier } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required JotForm fields' });
    }

    // Read existing members
    const members = await readMembers();

    // Skip if email already registered
    if (members.some(m => m.email === email)) {
      return res.status(200).json({ 
        message: 'Member already exists',
        skipped: true 
      });
    }

    // Create member from JotForm submission
    const newMember = {
      id: generateMemberId(),
      firstName,
      lastName,
      email,
      phone: phone || 'Not provided',
      membershipTier: membershipTier || 'standard',
      paymentStatus: 'pending',
      amount: getTierAmount(membershipTier || 'standard'),
      venmoLink: generateVenmoLink('bishop-cabana-club', getTierAmount(membershipTier || 'standard')),
      source: 'jotform',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    members.push(newMember);
    await writeMembers(members);

    res.status(200).json({
      success: true,
      message: 'Member created from JotForm submission',
      member: newMember
    });
  } catch (error) {
    console.error('JotForm webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Helper: Get price by membership tier
 */
function getTierAmount(tier) {
  const tiers = {
    'basic': 150,
    'standard': 250,
    'premium': 400
  };
  return tiers[tier] || 250;
}

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Bishop Estates Cabana Club API running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`📚 Endpoints: POST /api/signup | GET /api/admin/members | PUT /api/admin/members/:id/status`);
});

module.exports = app;
