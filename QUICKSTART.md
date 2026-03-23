# 🚀 Quick Start Guide

Get up and running with the Bishop Estates Signup App in 5 minutes.

## Installation

```bash
cd /Users/number5/.openclaw/workspace/bishop-pool-app
npm install
```

## Run Development Server

```bash
npm run dev
```

Visit:
- **Signup Form:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin

## Directory Structure (Frontend)

```
src/
├── app/
│   ├── layout.tsx          ← Root layout
│   ├── page.tsx            ← Signup page (/)
│   └── admin/page.tsx      ← Admin page (/admin)
├── components/
│   ├── SignupForm.tsx      ← New member signup
│   └── AdminDashboard.tsx  ← Admin management
└── styles/
    └── globals.css         ← Global Tailwind styles
```

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | Tailwind CSS theme |
| `next.config.js` | Next.js settings |
| `README.md` | Full documentation |
| `COMPONENT_GUIDE.md` | Component details |

## What's Built

### ✅ SignupForm Component
- Full form validation
- Real-time error messages
- Mobile-responsive design
- Success/error handling
- Currently uses mock submission (no backend yet)

### ✅ AdminDashboard Component
- Browse all signups in data table
- Search by name/email/phone
- Filter by status (pending/approved/rejected)
- Sort by name/date/status
- Approve or reject applications
- Statistics cards showing counts
- Currently uses mock data (no backend yet)

### ✅ Styling
- Tailwind CSS for all styling
- Mobile-first responsive design
- Color-coded status badges
- Professional, clean UI

### ✅ Configuration
- TypeScript for type safety
- PWA manifest for mobile app
- Next.js 14 setup
- ESLint ready

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts. Your app deploys automatically.

## Testing

Test manually:

**Signup Form:**
1. Visit http://localhost:3000
2. Leave fields empty, click "Join Now" → see validation errors
3. Fill valid data, submit → see success message
4. Test on mobile (DevTools or real iPhone)

**Admin Dashboard:**
1. Visit http://localhost:3000/admin
2. Search by name/email/phone
3. Filter by status
4. Click column headers to sort
5. Try approve/reject buttons

## Next: Backend Integration

The frontend is ready. To connect to real data:

1. **JotForm Integration:** Update `src/components/SignupForm.tsx` to POST to JotForm API
2. **Database:** Create `/api/signups` endpoint in Next.js (create `src/app/api/signups/route.ts`)
3. **Authentication:** Add auth to `/api/admin/...` endpoints (admin dashboard only)

See `README.md` for detailed integration instructions.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JOTFORM_API_KEY=your_key_here
```

## Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (PWA-ready)
- **Tools:** ESLint, PostCSS, Autoprefixer

## Common Tasks

### Change colors
Edit `tailwind.config.js` (primary color is indigo-600)

### Edit form fields
Edit `src/components/SignupForm.tsx` (add/remove fields)

### Change admin table columns
Edit `src/components/AdminDashboard.tsx` (modify table JSX)

### Add new page
Create file in `src/app/` (e.g., `src/app/contact/page.tsx`)

## Help

- Read `COMPONENT_GUIDE.md` for detailed component docs
- Read `README.md` for full project overview
- Check component files for inline comments

---

**Happy coding! 🎉**
