//region imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//endregion

//region interfaces
/**
 * User interface representing authenticated user data
 */
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
//endregion

//region initial state
/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};
//endregion

//region slice
/**
 * Auth slice for managing authentication state
 * Handles user login/logout and authentication status
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set authenticated user
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    
    // Clear user and logout
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
//endregion

//region exports
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
//endregion
