# Component Guide - Bishop Estates Signup App

## Overview

This guide provides detailed documentation for the frontend components and their usage.

---

## SignupForm Component

**File:** `src/components/SignupForm.tsx`

### Purpose
Collects new member applications with form validation and submission handling.

### Props
None (currently a standalone page component)

### State
- `formData` - User input object containing name, email, phone, familySize, membershipType
- `errors` - Object mapping field names to error messages
- `submitted` - Boolean flag for successful submission
- `loading` - Boolean flag during API submission

### Key Functions

#### `validateForm(): boolean`
Validates all form fields before submission.

**Validation Rules:**
- Name: Required, non-empty string
- Email: Required, valid email format
- Phone: Required, 10-digit format (accepts multiple formats)
- Family Size: Required, must select from dropdown
- Membership Type: Required, must select from dropdown

**Returns:** `true` if all fields valid, `false` otherwise

#### `handleChange(e: React.ChangeEvent)`
Updates form state and clears field errors on user input.

**Called on:** Input/select change events

#### `handleSubmit(e: React.FormEvent)`
1. Prevents default form submission
2. Validates form
3. Sets loading state
4. Submits data (currently mocks 1s delay)
5. Shows success message
6. Resets form after 5 seconds

**TODO:** Replace mock submission with real JotForm API call

### Styling
- Uses Tailwind CSS utility classes
- Responsive grid layout (mobile-first)
- Gradient background (blue-50 to indigo-100)
- Color scheme: Indigo primary (#6366f1)
- Mobile max-width: 448px (md breakpoint)
- Shadow and rounded corners for depth

### Accessibility Features
- Proper `<label>` elements for all inputs
- Error messages announced via `aria-describedby` (can be enhanced)
- Focus states with `focus:ring-2` indicator
- Disabled state during submission
- Semantic HTML structure

### Example Usage

```typescript
import SignupForm from '@/components/SignupForm';

export default function Page() {
  return <SignupForm />;
}
```

### Future Enhancements
- [ ] Phone number input mask
- [ ] Real-time email validation (check if exists)
- [ ] Captcha or bot prevention
- [ ] Multi-step form (split into sections)
- [ ] Field-level validation feedback
- [ ] Success page with next steps

---

## AdminDashboard Component

**File:** `src/components/AdminDashboard.tsx`

### Purpose
Displays and manages pending member signups with filtering, sorting, and status updates.

### Props
None (currently a standalone page component)

### State
- `signups` - Array of SignupRecord objects
- `filteredSignups` - Filtered/sorted version of signups
- `loading` - Boolean flag for initial data fetch
- `searchTerm` - String for name/email/phone search
- `statusFilter` - Filter by status ('all', 'pending', 'approved', 'rejected')
- `sortField` - Current sort field ('name', 'submittedAt', 'status')
- `sortOrder` - Sort direction ('asc', 'desc')

### TypeScript Interfaces

#### `SignupRecord`
```typescript
interface SignupRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  familySize: string;
  membershipType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; // ISO 8601 date string
}
```

### Key Functions

#### `handleStatusChange(id: string, newStatus: SignupRecord['status'])`
Updates a signup's status (approve, reject, or revert to pending).

**Called on:** Action button clicks

#### `handleSort(field: SortField)`
Toggles sort field and direction.

**Behavior:**
- Click same field twice to reverse order
- Click different field to change sort criterion

#### `formatDate(dateString: string): string`
Converts ISO date string to readable format.

**Output:** "Mar 21, 2024, 10:30 AM"

#### `getStatusBadgeColor(status: SignupRecord['status']): string`
Returns Tailwind classes for status badge styling.

**Color Mapping:**
- Pending: Yellow (`bg-yellow-100 text-yellow-800`)
- Approved: Green (`bg-green-100 text-green-800`)
- Rejected: Red (`bg-red-100 text-red-800`)

### Layout

**Dashboard Sections:**

1. **Header** - Title and description
2. **Stats Cards** - 4 card grid showing:
   - Total signups
   - Pending count
   - Approved count
   - Rejected count
3. **Filters** - Search and status dropdown
4. **Data Table** - Sortable table with columns:
   - Name (sortable)
   - Email (clickable)
   - Phone (clickable)
   - Family Size
   - Membership Type
   - Submitted Date (sortable)
   - Status (sortable, colored badge)
   - Actions (approve/reject/pending buttons)
5. **Footer** - Count of displayed vs total signups

### Responsive Behavior

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<640px) | Single column, horizontal table scroll |
| Tablet (640-1024px) | 2-column stats grid, full table width |
| Desktop (>1024px) | 4-column stats grid, full table with hover effects |

### Styling
- Clean white background on gray page background
- Shadow and rounded corners for depth
- Color-coded status badges
- Hover effects on table rows
- Button hover states (darker green/red)

### Mock Data
Currently loads 5 sample SignupRecord objects after 500ms delay.

**To replace with real API:**
```typescript
useEffect(() => {
  const fetchSignups = async () => {
    const response = await fetch('/api/signups');
    const data = await response.json();
    setSignups(data);
    setLoading(false);
  };
  fetchSignups();
}, []);
```

### Example Usage

```typescript
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

### Future Enhancements
- [ ] API integration (real data)
- [ ] Pagination (for 100+ signups)
- [ ] Bulk actions (select multiple, approve all)
- [ ] Email notifications on status change
- [ ] Member profile view/edit modal
- [ ] Export to CSV
- [ ] Advanced filtering (date range, membership type)
- [ ] Real-time updates (WebSocket)
- [ ] Permission system (only admins can modify)
- [ ] Audit log (track who approved what and when)

---

## Styling & Design System

### Color Palette

**Primary Colors:**
- Indigo-600: `#4f46e5` (buttons, links)
- Indigo-700: `#4338ca` (button hover)
- Indigo-50: `#eef2ff` (backgrounds)

**Semantic Colors:**
- Green-600: `#16a34a` (success, approve)
- Yellow-600: `#ca8a04` (warning, pending)
- Red-600: `#dc2626` (error, reject)
- Gray-900: `#111827` (text, primary)
- Gray-600: `#4b5563` (text, secondary)

### Typography

**Headings:**
- h1: `text-4xl font-bold` (page titles)
- h2: `text-3xl font-bold` (section titles)
- h3: `text-lg font-semibold` (field labels)

**Body:**
- Default: `text-sm` for form fields
- Metadata: `text-xs` for timestamps
- Links: `text-indigo-600 hover:underline`

### Spacing
Uses Tailwind's 4px base unit:
- Tight: `p-2`, `m-1` (8px, 4px)
- Standard: `p-4`, `m-4` (16px, 16px)
- Loose: `p-8`, `m-8` (32px, 32px)

### Forms
- Inputs: `border border-gray-300 rounded-lg px-4 py-2`
- Focus: `focus:ring-2 focus:ring-indigo-500 focus:outline-none`
- Error: `border-red-500` (red border)
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

---

## Type Safety

All components use TypeScript for full type safety.

**Key Types:**
```typescript
// Form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  familySize: string;
  membershipType: string;
}

// Form errors
interface FormErrors {
  [key: string]: string; // fieldName -> errorMessage
}

// Signup record
interface SignupRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  familySize: string;
  membershipType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Sort types
type SortField = 'name' | 'submittedAt' | 'status';
type SortOrder = 'asc' | 'desc';
```

---

## Testing

### Manual Testing Checklist

#### SignupForm
- [ ] Submit form with empty fields (see validation errors)
- [ ] Submit with invalid email (see error)
- [ ] Submit with valid data (see success message)
- [ ] Success message disappears after 5 seconds
- [ ] Form resets after successful submission
- [ ] Mobile layout on iPhone (responsive)
- [ ] Tab through inputs (keyboard navigation)

#### AdminDashboard
- [ ] Table loads with mock data
- [ ] Search filters by name, email, phone
- [ ] Status filter works (pending/approved/rejected)
- [ ] Click column headers to sort
- [ ] Sort toggles ascending/descending
- [ ] Click approve/reject buttons to change status
- [ ] Stats cards update when status changes
- [ ] Mobile table scrolls horizontally
- [ ] All links work (email/phone)

### Unit Test Example (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from '@/components/SignupForm';

describe('SignupForm', () => {
  it('shows validation error for empty name', async () => {
    render(<SignupForm />);
    const submitButton = screen.getByText('Join Now');
    await userEvent.click(submitButton);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows success message on valid submission', async () => {
    render(<SignupForm />);
    // Fill form...
    const submitButton = screen.getByText('Join Now');
    await userEvent.click(submitButton);
    expect(screen.getByText(/Thank you/)).toBeInTheDocument();
  });
});
```

---

## Performance Notes

- Components use `useState` and `useEffect` (React hooks)
- No unnecessary re-renders (proper dependency arrays)
- Filtering/sorting done client-side (OK for <1000 records)
- Mock data loads after 500ms (simulate network latency)

**For production with real data:**
- Implement pagination (50-100 rows per page)
- Use server-side filtering/sorting
- Implement caching strategy
- Add loading skeletons for better UX
- Consider virtualizing large tables (React Window)

---

## Deployment Checklist

Before deploying to Vercel:

- [ ] Replace mock data with real API
- [ ] Add environment variables for API endpoints
- [ ] Add authentication/authorization
- [ ] Implement rate limiting on forms
- [ ] Add CSRF tokens
- [ ] Sanitize user input
- [ ] Add error logging/monitoring
- [ ] Test on actual mobile devices
- [ ] Enable PWA manifest
- [ ] Set up analytics
- [ ] Configure email notifications

---

**Last Updated:** March 21, 2024
