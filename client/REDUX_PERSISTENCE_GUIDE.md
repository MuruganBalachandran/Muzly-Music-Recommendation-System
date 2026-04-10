# Redux Persistence Setup Guide

## Overview
The application now uses Redux with redux-persist to maintain state across page refreshes. All critical application state is automatically persisted to localStorage.

## Persisted State

### 1. **Auth State** (`authSlice.ts`)
- User information (name, email, role, ID)
- Authentication status
- **Persists**: User login sessions across refreshes

### 2. **Player State** (`playerSlice.ts`)
- Current song playing
- Queue of songs
- Current index in queue
- Play/pause status
- Volume level
- **Persists**: Music player state and queue

### 3. **UI State** (`uiSlice.ts`) - NEW
- Recommended songs from Home page
- Recommended songs from modal
- Modal analysis data
- Show/hide analysis toggle
- Current recommendation page
- Recent searches
- Library active tab (searched/history/favorites/recommendations)
- Library current page
- Library search query
- **Persists**: Recommendations, UI state, library navigation, and recommendations library across refreshes

## How It Works

### Redux Store Configuration (`store.ts`)
```typescript
const persistConfig = {
  key: 'muzly-root',
  storage,
  whitelist: ['auth', 'player', 'ui'], // Only these slices are persisted
};
```

### State Rehydration
1. When the app loads, redux-persist automatically restores persisted state from localStorage
2. The `persistor` is configured in `main.tsx` with `PersistGate`
3. UI waits for rehydration before rendering (prevents flash of empty state)

## Usage in Components

### Accessing Persisted State
```typescript
const { recommendedSongs, recommendedFromModal, showAnalysis } = useAppSelector((state) => state.ui);
```

### Updating Persisted State
```typescript
import { setRecommendedSongs, setShowAnalysis } from "@/store/slices/uiSlice";

dispatch(setRecommendedSongs(songs));
dispatch(setShowAnalysis(true));
```

## Key Features

✅ **Automatic Persistence**: State automatically saves to localStorage
✅ **Automatic Rehydration**: State automatically restores on page refresh
✅ **Selective Persistence**: Only necessary slices are persisted (auth, player, ui)
✅ **No Manual Storage**: No need for manual localStorage calls
✅ **Type-Safe**: Full TypeScript support for all state

## Files Modified/Created

1. **Created**: `client/src/store/slices/uiSlice.ts` - New UI state management
2. **Updated**: `client/src/store/store.ts` - Added UI slice to persist config
3. **Updated**: `client/src/pages/Songs.tsx` - Uses Redux for recommendations
4. **Updated**: `client/src/pages/Home.tsx` - Uses Redux for recommendations
5. **Updated**: `client/src/pages/Library.tsx` - Uses Redux for library state (tabs, pagination, search)

## Testing Persistence

1. Get recommendations on Home page
2. Click "Suggest More" to navigate to Songs page
3. Refresh the page (F5 or Cmd+R)
4. **Expected**: Recommendations should still be visible without loading

### Library Persistence
1. Navigate to Library page
2. Switch between tabs (Searched, History, Favorites, Recommendations)
3. Search for items
4. Refresh the page
5. **Expected**: Active tab, search query, and pagination should be restored

### Recommendations Library
1. Get recommendations from Home page or modal
2. Navigate to Library page
3. Click on "Recommendations" tab
4. **Expected**: All recommendations (from Home and modal) should appear
5. Search and filter recommendations
6. Refresh page - recommendations persist via Redux

## Clearing Persisted State

To clear all persisted state (for logout or reset):
```typescript
import { clearUIState } from "@/store/slices/uiSlice";
import { clearUser } from "@/store/slices/authSlice";
import { clearPlayer } from "@/store/slices/playerSlice";

dispatch(clearUser());
dispatch(clearPlayer());
dispatch(clearUIState());
```

## Browser Storage

- **Storage Location**: Browser's localStorage
- **Key**: `persist:muzly-root`
- **Size**: Typically < 1MB for normal usage
- **Persistence**: Survives browser restart (unless cache is cleared)

## Notes

- Redux-persist is already configured in the store
- PersistGate wrapper is used in main.tsx to prevent rendering before rehydration
- All state updates automatically trigger persistence
- No additional configuration needed for new state additions (just add to whitelist)
