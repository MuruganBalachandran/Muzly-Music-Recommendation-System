# Admin Dashboard Components

A unified, consistent admin dashboard system for managing platform content and monitoring user activity.

## Components Overview

### AdminDashboard.tsx
Main dashboard component with tabbed interface for:
- **Overview**: Stats cards and recent activity preview
- **Songs**: Manage all songs with search and pagination
- **Users**: View all users with role filtering
- **Activity**: Complete activity log

### AdminStatCard.tsx
Reusable stat card component displaying:
- Title and numeric value
- Icon with accent color
- Active status indicator
- Loading skeleton state
- Hover effects with gradient background

### AdminActivityTable.tsx
Activity log table showing:
- User information (name, email)
- Action performed
- Track/context
- Timestamp
- Loading and empty states

### AdminSongsTable.tsx
Songs management table with:
- Album thumbnail preview
- Song name and genre
- Artist name
- Language badge
- Delete functionality
- Search and pagination

### AdminUsersTable.tsx
Users management table with:
- User name
- Email address
- Role badge (Admin/User)
- Join date
- Search functionality

### AdminTableHeader.tsx
Reusable table header component with consistent styling:
- Uppercase column labels
- Consistent spacing and typography
- Muted text color

### AdminTableRow.tsx
Reusable table row component with:
- Staggered animation on load
- Hover effects
- Consistent styling

## Styling System

All components use a consistent design system defined in `lib/adminStyles.ts`:

### Container Styles
- `.container` - Full padding (p-8)
- `.containerCompact` - Reduced padding (p-6)

### Table Styles
- Consistent header styling with uppercase labels
- Hover effects on rows
- Proper cell padding

### Badge Styles
- Accent, Success, Warning, Danger, Info, Purple variants
- Consistent border and background opacity

### Input Styles
- Full-width inputs with glass effect
- Focus states with accent color
- Placeholder text styling

### Button Styles
- Primary (accent background)
- Secondary (border only)
- Danger (red background)

## Color Scheme

Uses the application's dark gray theme:
- Background: `0 0% 7%`
- Foreground: `0 0% 98%`
- Accent: `0 0% 30%`
- Muted: `0 0% 15%`

Status badges use semantic colors:
- Success: Green
- Warning: Yellow
- Danger: Red
- Info: Blue
- Purple: Purple

## API Integration

All components use centralized API functions from `lib/api.ts`:
- `getAdminStats()` - Fetch dashboard statistics
- `getAdminUsers(search)` - Fetch users with optional search
- `getSongs()` - Fetch songs with pagination and filters
- `deleteSong()` - Delete a song

## Responsive Design

All components are fully responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Horizontal scroll for tables on small screens
- Flexible grid layouts

## Animation

Uses Framer Motion for:
- Staggered table row animations
- Tab transitions
- Loading states
- Smooth hover effects

## Usage

```tsx
import AdminDashboard from '@/components/admin/AdminDashboard';

// In your router
<Route path="/admin" element={<AdminDashboard />} />
```

## Consistency Features

1. **Unified Table Design**: All tables use the same header and row components
2. **Consistent Badges**: Status indicators use the same styling system
3. **Standardized Inputs**: Search and filter inputs follow the same pattern
4. **Unified Loading States**: All tables show consistent loading spinners
5. **Consistent Pagination**: Unified pagination controls
6. **Unified Modals**: Uses the shared ConfirmModal component
7. **Consistent Icons**: Icon sizing and placement follows standards
8. **Unified Color Palette**: All components use the design system colors

## Future Enhancements

- Add export functionality (CSV/PDF)
- Add bulk operations
- Add advanced filtering
- Add data visualization charts
- Add real-time updates with WebSocket
- Add audit trail for admin actions
