# Client - Frontend Documentation

## Overview

React + TypeScript + Vite frontend application for Muzly.AI music recommendation platform.

---

## Technology Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **HTTP Client:** Fetch API
- **Form Validation:** Zod
- **Icons:** Lucide React

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── animations/     # Animation components (LiquidEther, ChromaGrid, etc.)
│   │   ├── common/         # Reusable components (ErrorBoundary, LoadingSpinner)
│   │   ├── layout/         # Layout components (Header, Footer, MobileMenu)
│   │   ├── profile/        # Profile-related components
│   │   ├── sections/       # Landing page sections
│   │   ├── shared/         # Shared components (MusicPlayer)
│   │   └── ui/             # shadcn/ui components
│   ├── css/                # Component-specific CSS
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and API client
│   ├── pages/              # Page components
│   ├── store/              # Redux store configuration
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind configuration
└── vite.config.ts          # Vite configuration
```

---

## Key Features

### 1. Authentication System
- Email/password authentication
- Email verification with OTP
- JWT token management
- Protected routes

### 2. Music Discovery
- AI-powered recommendations
- Image-based emotion detection
- Song browsing and search
- Favorites management

### 3. Admin Dashboard
- Unified admin interface with tabs:
  - Overview (statistics)
  - Songs management
  - Users management
  - Activity logs
- Real-time activity monitoring
- User and content management

### 4. User Profile
- Profile management
- Favorites collection
- Activity history
- Listening statistics

### 5. Music Player
- Global music player
- Play/pause controls
- Volume control
- Queue management
- Progress tracking

---

## Component Architecture

### Admin Components
```
AdminDashboard (Main)
├── AdminStatCard (Statistics)
├── AdminActivityTable (Activity logs)
├── AdminSongsTable (Songs management)
└── AdminUsersTable (Users management)
```

### Animation Components
- **LiquidEther:** Fluid background animation
- **ChromaGrid:** Interactive grid with hover effects
- **ClickSpark:** Click spark effects
- **FloatingLines:** Floating wave lines

### Common Components
- **ErrorBoundary:** Error handling wrapper
- **LoadingSpinner:** Loading state indicator
- **ModalWrapper:** Reusable modal container
- **PageBackground:** Consistent page backgrounds

---

## State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  player: {
    currentSong: Song | null,
    isPlaying: boolean,
    volume: number,
    queue: Song[]
  }
}
```

---

## API Integration

### Base Configuration
```typescript
const API_BASE = import.meta.env.VITE_NODE_API_BASE || 'http://127.0.0.1:5000/api/v1';
```

### API Endpoints
- `/auth/*` - Authentication
- `/songs/*` - Song operations
- `/user/*` - User operations
- `/admin/*` - Admin operations
- `/activity/*` - Activity logging

---

## Custom Hooks

### useApiData
Fetches data from API with loading and error states.

### useFormValidation
Validates form inputs with Zod schemas.

### useDebounce
Debounces input values for search/filter operations.

### use-mobile
Detects mobile viewport for responsive design.

### use-toast
Manages toast notifications.

---

## Routing

```typescript
/ → Home
/songs → Songs (Browse & Search)
/about → About
/profile → Profile
/auth → Authentication
/verify-email → Email Verification
/admin → Admin Dashboard
* → 404 Not Found
```

---

## Styling System

### Tailwind Configuration
- Custom color palette
- Design tokens
- Responsive breakpoints
- Animation utilities

### CSS Modules
- Component-specific styles in `/css`
- Animation-specific CSS files
- Global styles in `index.css`

---

## Build & Development

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:8080`

### Production Build
```bash
npm run build
```
Outputs to `/dist`

### Preview Production Build
```bash
npm run preview
```

---

## Environment Variables

Create `.env` file:
```env
VITE_NODE_API_BASE=http://127.0.0.1:5000/api/v1
VITE_PYTHON_API_BASE=http://127.0.0.1:8000
```

---

## Code Organization

### Region Comments Pattern
```typescript
//region imports
//endregion

//region interfaces
//endregion

//region component
//endregion

//region exports
//endregion
```

### JSDoc Documentation
All functions and components include JSDoc comments.

---

## Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Debounced search inputs
- Memoized components
- Efficient re-renders with React.memo

---

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Dependencies

### Core
- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^7.1.1

### State & Data
- @reduxjs/toolkit: ^2.5.0
- react-redux: ^9.2.0
- @tanstack/react-query: ^5.62.11

### UI & Styling
- tailwindcss: ^3.4.17
- framer-motion: ^11.15.0
- lucide-react: ^0.469.0

### Forms & Validation
- zod: ^3.24.1
- react-hook-form: ^7.54.2

---

## Testing

Run tests:
```bash
npm run test
```

---

## Deployment

1. Build production bundle
2. Deploy `/dist` folder to hosting service
3. Configure environment variables
4. Set up HTTPS
5. Configure CORS on backend

---

## Troubleshooting

### Common Issues

**Issue:** API connection failed
**Solution:** Check `VITE_NODE_API_BASE` environment variable

**Issue:** Build errors
**Solution:** Clear node_modules and reinstall dependencies

**Issue:** TypeScript errors
**Solution:** Run `npm run type-check`

---

## Contributing

1. Follow TypeScript best practices
2. Use region comments for organization
3. Add JSDoc documentation
4. Test on multiple browsers
5. Ensure mobile responsiveness

---

## License

Proprietary - Muzly.AI
