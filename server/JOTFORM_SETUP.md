# JotForm Webhook Integration Setup

This guide explains how to connect your JotForm signup form to the Bishop Estates Cabana Club API.

## Overview

When a new form submission is received in JotForm, it will automatically create a member record in our database via the webhook endpoint.

## Prerequisites

1. Active JotForm account
2. Created form with fields:
   - `firstName` (Text)
   - `lastName` (Text)
   - `email` (Email)
   - `phone` (Text, optional)
   - `membershipTier` (Dropdown: basic, standard, premium)

3. API running at: `http://localhost:3001` (development) or `https://api.bishop-cabana.com` (production)

## Step-by-Step Setup

### 1. Get Your Webhook URL

**Development:**
```
http://localhost:3001/api/webhook/jotform
```

**Production:**
```
https://api.bishop-cabana.com/api/webhook/jotform
```

### 2. Configure JotForm Webhook

1. Log in to [JotForm.com](https://www.jotform.com)
2. Select your Bishop Estates signup form
3. Go to **Form Settings** (gear icon) → **Integrations** tab
4. Find and click **Webhooks**
5. Click **Add Webhook**

### 3. Enter Webhook Details

**Webhook URL:**
```
https://api.bishop-cabana.com/api/webhook/jotform
```

**Method:** POST

**Content Type:** JSON

**Custom Headers (Optional):**
```
Authorization: Bearer bishop-admin-key-2024-secret
```

### 4. Map Form Fields

JotForm will send form data as JSON. Ensure your form fields match our expected field names:

| JotForm Field | API Field | Type |
|---|---|---|
| First Name | firstName | Text |
| Last Name | lastName | Text |
| Email | email | Email |
| Phone | phone | Text (optional) |
| Membership Tier | membershipTier | Dropdown |

If your form uses different field names, you can map them in the webhook configuration.

### 5. Test the Webhook

1. Click **Test Webhook** in JotForm
2. Fill in sample data:
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "phone": "(555) 123-4567",
     "membershipTier": "standard"
   }
   ```

3. Submit and verify you see a `200 OK` response

The member should now appear in your member database!

### 6. Verify in API

Check that the member was created:

```bash
curl http://localhost:3001/api/admin/members \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"
```

You should see the test member in the response.

## Testing

### Test 1: Submit through JotForm

1. Visit your public JotForm
2. Fill out and submit
3. Check the admin dashboard:
   ```bash
   curl http://localhost:3001/api/admin/members \
     -H "Authorization: Bearer bishop-admin-key-2024-secret"
   ```

### Test 2: Webhook Test

Use the JotForm webhook test interface to send sample data.

### Test 3: Direct API Call

```bash
curl -X POST http://localhost:3001/api/webhook/jotform \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "(555) 987-6543",
    "membershipTier": "premium"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Member created from JotForm submission",
  "member": {
    "id": "MEM-...",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "(555) 987-6543",
    "membershipTier": "premium",
    "amount": 400,
    "paymentStatus": "pending",
    "source": "jotform",
    "venmoLink": "https://venmo.com/pay?...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Troubleshooting

### Webhook Not Firing

**Problem:** Form submissions don't create members

**Solution:**
1. Check webhook URL is correct and API is running
2. Verify form field names match expected names
3. Check JotForm webhook logs: Form Settings → Integrations → Webhooks → View Logs
4. Ensure your form is published (not in draft mode)

### Duplicate Members

**Problem:** Same person appears twice after submission

**Solution:**
- Our API checks for duplicate emails and skips creation
- Clear old test data if needed: `rm data/members.json`

### Field Mapping Issues

**Problem:** Form fields aren't being captured correctly

**Solution:**
1. Get actual JotForm field names: Export a test submission
2. Update the field mapping in `src/server.js` - modify the JotForm webhook handler
3. Example:
   ```javascript
   // If JotForm uses different field names
   firstName: payload.first_name || payload.firstName || '',
   lastName: payload.last_name || payload.lastName || '',
   ```

### API Returns 500 Error

**Problem:** Webhook returns `500 Internal Server Error`

**Solution:**
1. Check server logs: `npm run dev`
2. Verify database file exists: `ls -la data/members.json`
3. Check file permissions: Should be readable/writable
4. Restart server: `npm start`

## Advanced Configuration

### Custom Field Mapping

If your form uses different field names, edit `src/server.js`:

```javascript
// In POST /api/webhook/jotform
const { firstName, lastName, email, phone, membershipTier } = req.body;

// Update this section to match your form fields:
const newMember = {
  firstName: payload.first_name || payload.firstName,
  lastName: payload.last_name || payload.lastName,
  email: payload.email_address || payload.email,
  // ... etc
};
```

### Signature Verification

For production, verify JotForm webhook signatures:

1. Enable signing in JotForm webhook settings
2. Get the signature key from JotForm
3. Add verification in `src/server.js`:

```javascript
const crypto = require('crypto');

function verifyJotFormSignature(body, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  return hash === signature;
}
```

### Rate Limiting

For production, add rate limiting to the webhook:

```bash
npm install express-rate-limit
```

In `src/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/webhook/jotform', webhookLimiter, async (req, res) => {
  // ... webhook handler
});
```

## Form Field Configuration

### Recommended JotForm Setup

**Form Name:** Bishop Estates Cabana Club Membership

**Fields:**

1. **First Name** (Text Field)
   - Required: Yes
   - Placeholder: "John"

2. **Last Name** (Text Field)
   - Required: Yes
   - Placeholder: "Doe"

3. **Email** (Email Field)
   - Required: Yes
   - Placeholder: "john@example.com"

4. **Phone** (Text Field)
   - Required: No
   - Placeholder: "(555) 123-4567"

5. **Membership Tier** (Dropdown)
   - Required: Yes
   - Options:
     - Basic - $150/year
     - Standard - $250/year
     - Premium - $400/year

6. **Submit Button**
   - Text: "Sign Up for Membership"

### Success Message

After form submission, show:

```
Thank you for signing up! 

You'll receive a Venmo payment link via email shortly. 
Questions? Contact doug@bishop-cabana.com
```

## Support

For help:
1. Check API logs: `tail -f /tmp/api.log`
2. Review webhook logs in JotForm
3. Test webhook directly with cURL
4. Check file permissions on `data/members.json`

## Next Steps

1. ✅ Set up webhook in JotForm
2. ✅ Test with sample submission
3. 🔄 Deploy API to production
4. 🔄 Update webhook URL to production domain
5. 🔄 Enable HTTPS (required by JotForm in production)
6. 🔄 Add email notifications (optional)
