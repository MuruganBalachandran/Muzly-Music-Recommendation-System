//region interfaces
/**
 * User interface for authenticated user data
 */
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
}
//endregion

//region configuration
/**
 * API base URL for authentication endpoints
 */
const API_BASE = import.meta.env.VITE_NODE_API_BASE || 'http://localhost:5000/api/v1';
//endregion

//region exports
/**
 * Authentication service
 * Handles user authentication, registration, and profile management
 */
export const auth = {
  //region signUp
  /**
   * Register a new user account
   * @param email - User email address
   * @param password - User password
   * @param name - Optional user name
   */
  signUp: async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: name || 'Music Lover' }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Sign up failed');
    return data;
  },
  //endregion

  //region verifyEmail
  /**
   * Verify user email with OTP
   * @param email - User email address
   * @param otp - One-time password from email
   */
  verifyEmail: async (email: string, otp: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Verification failed');

    const sessionUser = { ...data.data.user, id: data.data.user._id };
    return { user: sessionUser };
  },
  //endregion

  //region resendOtp
  /**
   * Resend OTP to user email
   * @param email - User email address
   */
  resendOtp: async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to resend OTP');
    return data;
  },
  //endregion

  //region signIn
  /**
   * Sign in existing user
   * @param email - User email address
   * @param password - User password
   */
  signIn: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Invalid credentials');

    const sessionUser = { ...data.data.user, id: data.data.user._id };
    return { user: sessionUser };
  },
  //endregion

  //region signOut
  /**
   * Sign out current user
   */
  signOut: async () => {
    await fetch(`${API_BASE}/auth/logout`, { 
      method: 'POST', 
      credentials: 'include' 
    });
  },
  //endregion

  //region updateProfile
  /**
   * Update user profile information
   * @param name - New user name
   */
  updateProfile: async (name: string) => {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Update failed');

    return { name: data.data?.name ?? name };
  },
  //endregion
};
//endregion
