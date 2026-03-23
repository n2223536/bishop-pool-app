# Bishop Estates Cabana Club Member App

A Progressive Web App (PWA) for Bishop Estates Cabana Club member signup and management.

## Features

✅ **Member Signup** — Clean, mobile-friendly signup form  
✅ **Admin Dashboard** — View all signups, manage payment status  
✅ **PWA** — Works on web, iPhone, Android (add to home screen)  
✅ **No App Store Required** — Just share a link  
✅ **localStorage Database** — Simple data storage for MVP  

## Tech Stack

- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **PWA Support** — Offline-capable
- **TypeScript** — Type safety

## Local Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Deployment to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new
3. Connect your repo
4. Click "Deploy"
5. Your app is live!

## Admin Access

- Go to `/admin`
- Password: `bishop2024` (change this in production!)
- View signups, update payment status, delete members

## Next Steps (Future)

- [ ] JotForm webhook integration (auto-sync new signups)
- [ ] Venmo payment link generation
- [ ] Email confirmations
- [ ] Smart & Door gate unlock integration
- [ ] Admin chat feature
- [ ] Database (MongoDB/Firebase instead of localStorage)

## File Structure

```
bishop-pool-app/
├── pages/
│   ├── index.tsx          # Member signup page
│   ├── admin.tsx          # Admin dashboard
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # HTML template
├── styles/
│   └── globals.css        # Tailwind + custom styles
├── public/
│   └── manifest.json      # PWA manifest
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Demo Data

Once you sign up, data is saved to browser localStorage. You can check it in:
- Dev Console → Application → Local Storage → bishop-pool-app

## Security Notes (MVP)

⚠️ This is an MVP using localStorage. For production:
- Use a real database (MongoDB, Firebase, Supabase)
- Add proper authentication
- Use environment variables for secrets
- Add server-side validation
- Enable HTTPS

## Questions?

Contact the dev team for questions or feature requests.
