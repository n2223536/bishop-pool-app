/**
 * Utility helpers for the API
 */

/**
 * Generate a Venmo payment link
 * @param {string} recipient - Venmo username or phone number
 * @param {number} amount - Amount in dollars
 * @param {string} note - Optional payment note
 * @returns {string} Venmo payment URL
 */
function generateVenmoLink(recipient, amount, note = 'Bishop Estates Cabana Club Membership') {
  // Venmo URL format: https://venmo.com/pay?txn=pay&recipients=RECIPIENT&amount=AMOUNT&note=NOTE
  const encodedNote = encodeURIComponent(note);
  return `https://venmo.com/pay?txn=pay&recipients=${recipient}&amount=${amount}&note=${encodedNote}`;
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique member ID
 * Format: MEM-TIMESTAMP-RANDOM
 * @returns {string}
 */
function generateMemberId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MEM-${timestamp}-${random}`;
}

/**
 * Format currency for display
 * @param {number} amount 
 * @returns {string}
 */
function formatCurrency(amount) {
  return `$${(amount || 0).toFixed(2)}`;
}

/**
 * Format date for display
 * @param {string} isoDate 
 * @returns {string}
 */
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Parse JotForm webhook data
 * JotForm sends form data with field names as keys
 * @param {object} payload 
 * @returns {object}
 */
function parseJotFormPayload(payload) {
  // JotForm sends rawRequest object with form field data
  // Expected fields: firstName, lastName, email, phone, membershipTier
  return {
    firstName: payload.firstName || payload['first_name'] || '',
    lastName: payload.lastName || payload['last_name'] || '',
    email: payload.email || payload['email_address'] || '',
    phone: payload.phone || payload['phone_number'] || '',
    membershipTier: payload.membershipTier || payload['membership_tier'] || 'standard'
  };
}

module.exports = {
  generateVenmoLink,
  validateEmail,
  generateMemberId,
  formatCurrency,
  formatDate,
  parseJotFormPayload
};
