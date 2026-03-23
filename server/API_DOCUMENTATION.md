# Bishop Estates Cabana Club - API Documentation

**Base URL:** `http://localhost:3001` (development) | `https://api.bishop-cabana.com` (production)

---

## Overview

This API powers the Bishop Estates Cabana Club member signup and management system. It provides endpoints for:
- Member signup and registration
- Admin member management
- Payment status tracking
- JotForm webhook integration

---

## Authentication

### Methods

The API supports two authentication methods for admin endpoints:

#### 1. API Key (Recommended for Simple Use)
```
Authorization: Bearer <API_KEY>
```

Default API Key: `bishop-admin-key-2024-secret` (change in production)

#### 2. JWT Token (Recommended for Production)
```
Authorization: Bearer <JWT_TOKEN>
```

Generate a JWT token:
```bash
curl -X POST http://localhost:3001/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin-1"}'
```

#### 3. Query Parameter (For Testing)
```
GET /api/admin/members?apiKey=<API_KEY>
```

---

## Endpoints

### 1. Member Signup

**POST** `/api/signup`

Submit a new member signup form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "membershipTier": "standard"
}
```

**Membership Tiers:**
- `basic` - $150/year
- `standard` - $250/year
- `premium` - $400/year

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Member signup successful",
  "member": {
    "id": "MEM-E5K8L2-A3B9C5",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard",
    "amount": 250,
    "paymentStatus": "pending",
    "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=Bishop%20Estates%20Cabana%20Club%20Membership",
    "createdAt": "2024-03-21T21:07:00Z",
    "updatedAt": "2024-03-21T21:07:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid data
- `409 Conflict` - Email already registered

**Example cURL:**
```bash
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard"
  }'
```

---

### 2. List All Members (Admin)

**GET** `/api/admin/members`

Retrieve all members. **Requires authentication.**

**Authentication Required:**
- Header: `Authorization: Bearer <API_KEY>`
- Or query param: `?apiKey=<API_KEY>`

**Optional Query Parameters:**
- `status` - Filter by payment status: `pending`, `paid`, or `overdue`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 42,
  "members": [
    {
      "id": "MEM-E5K8L2-A3B9C5",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "(555) 123-4567",
      "membershipTier": "standard",
      "amount": 250,
      "paymentStatus": "pending",
      "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=...",
      "createdAt": "2024-03-21T21:07:00Z",
      "updatedAt": "2024-03-21T21:07:00Z"
    }
  ]
}
```

**Example cURL:**
```bash
# Using API key in header
curl -X GET http://localhost:3001/api/admin/members \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"

# Filter by payment status
curl -X GET "http://localhost:3001/api/admin/members?status=pending" \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"

# Using query param
curl -X GET "http://localhost:3001/api/admin/members?apiKey=bishop-admin-key-2024-secret"
```

---

### 3. Get Single Member (Admin)

**GET** `/api/admin/members/:id`

Retrieve a single member by ID. **Requires authentication.**

**Response (200 OK):**
```json
{
  "success": true,
  "member": {
    "id": "MEM-E5K8L2-A3B9C5",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard",
    "amount": 250,
    "paymentStatus": "pending",
    "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=...",
    "createdAt": "2024-03-21T21:07:00Z",
    "updatedAt": "2024-03-21T21:07:00Z"
  }
}
```

**Error Response:**
- `404 Not Found` - Member not found

**Example cURL:**
```bash
curl -X GET http://localhost:3001/api/admin/members/MEM-E5K8L2-A3B9C5 \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"
```

---

### 4. Update Member Payment Status (Admin)

**PUT** `/api/admin/members/:id/status`

Update a member's payment status. **Requires authentication.**

**Request Body:**
```json
{
  "paymentStatus": "paid"
}
```

**Valid Payment Statuses:**
- `pending` - Awaiting payment
- `paid` - Payment received
- `overdue` - Payment overdue

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Member status updated",
  "member": {
    "id": "MEM-E5K8L2-A3B9C5",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard",
    "amount": 250,
    "paymentStatus": "paid",
    "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=...",
    "createdAt": "2024-03-21T21:07:00Z",
    "updatedAt": "2024-03-21T21:08:00Z"
  }
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:3001/api/admin/members/MEM-E5K8L2-A3B9C5/status \
  -H "Authorization: Bearer bishop-admin-key-2024-secret" \
  -H "Content-Type: application/json" \
  -d '{"paymentStatus": "paid"}'
```

---

### 5. Delete Member (Admin)

**DELETE** `/api/admin/members/:id`

Delete a member record. **Requires authentication.**

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Member deleted"
}
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:3001/api/admin/members/MEM-E5K8L2-A3B9C5 \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"
```

---

### 6. JotForm Webhook

**POST** `/api/webhook/jotform`

Webhook endpoint for JotForm form submissions. **No authentication required** (should be secured in production).

**Setup in JotForm:**
1. Go to Form Settings → Webhooks
2. Add webhook URL: `https://api.bishop-cabana.com/api/webhook/jotform`
3. Test the webhook

**JotForm Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "(555) 987-6543",
  "membershipTier": "premium"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Member created from JotForm submission",
  "member": {
    "id": "MEM-E5K8L3-B4C9D6",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "(555) 987-6543",
    "membershipTier": "premium",
    "amount": 400,
    "paymentStatus": "pending",
    "source": "jotform",
    "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=400&note=...",
    "createdAt": "2024-03-21T21:10:00Z",
    "updatedAt": "2024-03-21T21:10:00Z"
  }
}
```

**Response (200 OK) - Already Registered:**
```json
{
  "message": "Member already exists",
  "skipped": true
}
```

---

### 7. Health Check

**GET** `/api/health`

Health check endpoint - no authentication required.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-03-21T21:07:00Z"
}
```

**Example cURL:**
```bash
curl http://localhost:3001/api/health
```

---

## Database Schema

### members.json

```json
[
  {
    "id": "MEM-E5K8L2-A3B9C5",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard",
    "amount": 250,
    "paymentStatus": "pending",
    "venmoLink": "https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=Bishop%20Estates%20Cabana%20Club%20Membership",
    "source": "web_form",
    "createdAt": "2024-03-21T21:07:00Z",
    "updatedAt": "2024-03-21T21:07:00Z"
  }
]
```

**Fields:**
- `id` - Unique member identifier (auto-generated)
- `firstName` - Member first name
- `lastName` - Member last name
- `email` - Email address (unique)
- `phone` - Phone number
- `membershipTier` - `basic`, `standard`, or `premium`
- `amount` - Annual membership fee in dollars
- `paymentStatus` - `pending`, `paid`, or `overdue`
- `venmoLink` - Generated Venmo payment link
- `source` - Where signup came from (`web_form` or `jotform`)
- `createdAt` - ISO 8601 timestamp
- `updatedAt` - ISO 8601 timestamp

---

## Environment Variables

Create a `.env` file in the server directory:

```bash
# Server
PORT=3001
NODE_ENV=development

# Authentication
ADMIN_API_KEY=bishop-admin-key-2024-secret
JWT_SECRET=bishop-jwt-secret-change-in-production

# Venmo
VENMO_RECIPIENT=bishop-cabana-club
```

---

## Quick Start

### 1. Install Dependencies
```bash
cd /Users/number5/.openclaw/workspace/bishop-pool-app/server
npm install
```

### 2. Start the Server
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### 3. Test a Signup
```bash
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "membershipTier": "standard"
  }'
```

### 4. Check Members (as Admin)
```bash
curl http://localhost:3001/api/admin/members \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message",
  "message": "Additional context (if applicable)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

---

## Venmo Integration

Payment links are automatically generated for each member. The format:

```
https://venmo.com/pay?txn=pay&recipients=bishop-cabana-club&amount=250&note=Bishop%20Estates%20Cabana%20Club%20Membership
```

Members can click the link to pay via Venmo. In a production environment:
1. Verify Venmo payment confirmations via their webhook
2. Automatically update member payment status to `paid`
3. Send confirmation emails

---

## Production Deployment

### Before Going Live:

1. **Security**
   - Change `ADMIN_API_KEY` and `JWT_SECRET` to strong values
   - Use HTTPS only
   - Enable CORS appropriately
   - Secure the JotForm webhook (validate source)

2. **Database**
   - Migrate from JSON file to PostgreSQL or MongoDB
   - Implement backup/recovery procedures
   - Set up database replication

3. **Monitoring**
   - Add error logging (Sentry, DataDog, etc.)
   - Monitor API response times
   - Track member signup trends

4. **Venmo Webhook** (Optional)
   - Integrate Venmo webhook to auto-update payment status
   - Requires Venmo Business account

5. **Email Notifications**
   - Send confirmation emails to new members
   - Send payment reminders for pending members
   - Admin notifications for new signups

---

## Support

For issues or questions:
- Contact: Doug @ Metro18
- Repo: Bishop Estates Cabana Club API
- Status: MVP (Production-ready with proper configuration)
