# Bishop Estates Cabana Club - Backend API

A Node.js + Express API for managing member signups, payments, and administration for the Bishop Estates Cabana Club.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Development

```bash
# Start with auto-reload
npm run dev

# Or run directly
npm start
```

Server will run on `http://localhost:3001`

### Testing

Try a signup:

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

Get all members (admin):

```bash
curl http://localhost:3001/api/admin/members \
  -H "Authorization: Bearer bishop-admin-key-2024-secret"
```

## API Endpoints

### Public Endpoints

- **POST** `/api/signup` - New member signup
- **POST** `/api/webhook/jotform` - JotForm webhook
- **GET** `/api/health` - Health check

### Admin Endpoints (Requires Auth)

- **GET** `/api/admin/members` - List all members
- **GET** `/api/admin/members/:id` - Get single member
- **PUT** `/api/admin/members/:id/status` - Update payment status
- **DELETE** `/api/admin/members/:id` - Delete member

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full details.

## Project Structure

```
server/
├── src/
│   ├── server.js                 # Main Express app
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   └── utils/
│       ├── database.js           # JSON file database
│       └── helpers.js            # Utility functions
├── data/
│   └── members.json              # Member database (auto-created)
├── package.json
├── .env.example
├── API_DOCUMENTATION.md
└── README.md
```

## Database

Members are stored in `data/members.json`:

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
    "venmoLink": "https://venmo.com/pay?...",
    "createdAt": "2024-03-21T21:07:00Z",
    "updatedAt": "2024-03-21T21:07:00Z"
  }
]
```

### Migration to Production Database

To use a real database (PostgreSQL, MongoDB), update `src/utils/database.js` to replace JSON file operations with database queries.

## Authentication

### API Key (Development/Simple)

```bash
Authorization: Bearer bishop-admin-key-2024-secret
```

### JWT Token (Production)

```bash
Authorization: Bearer <jwt-token>
```

Generate a token:
```javascript
const { generateAdminToken } = require('./src/middleware/auth');
const token = generateAdminToken('admin-1');
console.log(token);
```

## Features

✅ Member signup with validation
✅ Admin member management
✅ Payment status tracking
✅ Venmo payment link generation
✅ JotForm webhook integration
✅ Simple JSON database (MVP)
✅ API key + JWT authentication
✅ Comprehensive error handling
✅ Health check endpoint

## Membership Tiers & Pricing

| Tier | Price | Benefits |
|------|-------|----------|
| Basic | $150/year | Pool access |
| Standard | $250/year | Pool + Guest privileges |
| Premium | $400/year | Pool + Guest + Priority booking |

## Environment Variables

See `.env.example` for all available options:

```bash
PORT=3001                              # Server port
NODE_ENV=development                   # Environment
ADMIN_API_KEY=...                      # API key
JWT_SECRET=...                         # JWT secret
VENMO_RECIPIENT=bishop-cabana-club     # Venmo account
```

## Frontend Integration

This API is designed to work with the Bishop Estates Cabana Club frontend app. The frontend should:

1. **Submit signups** to `POST /api/signup`
2. **Display Venmo link** from response (stored in `member.venmoLink`)
3. **Admin dashboard** queries `GET /api/admin/members` with auth header

### CORS Configuration

When frontend and backend are on different domains, enable CORS in `server.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://bishop-cabana.com'],
  credentials: true
}));
```

## Deployment

### Heroku

```bash
git push heroku main
heroku config:set ADMIN_API_KEY=your-strong-key
heroku logs --tail
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment

Production checklist:
- ✅ Change `ADMIN_API_KEY` and `JWT_SECRET`
- ✅ Set `NODE_ENV=production`
- ✅ Use HTTPS only
- ✅ Enable CORS for production domain
- ✅ Set up monitoring/logging
- ✅ Migrate to PostgreSQL/MongoDB
- ✅ Add rate limiting
- ✅ Secure JotForm webhook

## Scripts

```bash
npm start              # Start server
npm run dev           # Start with nodemon (auto-reload)
npm test              # Run tests (not yet implemented)
```

## Support

Built for the Bishop Estates Cabana Club by Number 5.

Questions? Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) or contact Doug at Metro18.
