//region configuration
/**
 * API Configuration
 * Base URLs for different API services
 */
export const API_BASE = import.meta.env.PROD ? '/api/ml' : (import.meta.env.VITE_API_BASE || 'http://localhost:8001');
export const NODE_API_BASE = import.meta.env.PROD ? '/api/v1' : (import.meta.env.VITE_NODE_API_BASE || 'http://localhost:5000/api/v1');
//endregion

//region helper functions
/**
 * Generic fetch wrapper with error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
async function apiFetch(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...options
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}
//endregion

//region songs API
/**
 * Fetch paginated songs with optional filters
 */
export async function getSongs(page = 1, limit = 10, search = '', filters: any = {}) {
  let url = `${NODE_API_BASE}/songs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  if (filters.artist) url += `&artist=${encodeURIComponent(filters.artist)}`;
  if (filters.language) url += `&language=${encodeURIComponent(filters.language)}`;
  
  const json = await apiFetch(url);
  return json.data;
}

/**
 * Create a new song (Admin only)
 */
export async function createSong(data: any) {
  const isFormData = data instanceof FormData;
  const json = await apiFetch(`${NODE_API_BASE}/songs`, {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data)
  });
  return json;
}

/**
 * Update an existing song (Admin only)
 */
export async function updateSong(id: string, data: any) {
  const isFormData = data instanceof FormData;
  const json = await apiFetch(`${NODE_API_BASE}/songs/${id}`, {
    method: 'PATCH',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data)
  });
  return json;
}

/**
 * Delete a song (Admin only)
 */
export async function deleteSong(id: string) {
  await apiFetch(`${NODE_API_BASE}/songs/${id}`, {
    method: 'DELETE'
  });
  return true;
}
//endregion

//region artists API
/**
 * Fetch all artists
 */
export async function getArtists() {
  const json = await apiFetch(`${NODE_API_BASE}/artists`);
  return json.data;
}

/**
 * Create a new artist (Admin only)
 */
export async function createArtist(data: any) {
  const json = await apiFetch(`${NODE_API_BASE}/artists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return json;
}

/**
 * Update an existing artist (Admin only)
 */
export async function updateArtist(id: string, data: any) {
  const json = await apiFetch(`${NODE_API_BASE}/artists/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return json;
}

/**
 * Delete an artist (Admin only)
 */
export async function deleteArtist(id: string) {
  await apiFetch(`${NODE_API_BASE}/artists/${id}`, {
    method: 'DELETE'
  });
  return true;
}
//endregion

//region languages API
/**
 * Fetch all languages
 */
export async function getLanguages() {
  const json = await apiFetch(`${NODE_API_BASE}/languages`);
  return json.data;
}

/**
 * Create a new language (Admin only)
 */
export async function createLanguage(data: any) {
  const json = await apiFetch(`${NODE_API_BASE}/languages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return json;
}

/**
 * Update an existing language (Admin only)
 */
export async function updateLanguage(id: string, data: any) {
  const json = await apiFetch(`${NODE_API_BASE}/languages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return json;
}

/**
 * Delete a language (Admin only)
 */
export async function deleteLanguage(id: string) {
  await apiFetch(`${NODE_API_BASE}/languages/${id}`, {
    method: 'DELETE'
  });
  return true;
}
//endregion

//region activity API
/**
 * Log user activity (song played, favorited, etc.)
 */
export async function logActivity(activityData: { 
  action: string; 
  songId?: string;
  songName?: string;
  artist?: string;
  duration?: number;
  reason?: string;
  query?: string;
  searchType?: string;
  results?: number;
  details?: string;
}) {
  const json = await apiFetch(`${NODE_API_BASE}/users/activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  });
  return json;
}

/**
 * Get user's search history
 */
export async function getSearchHistory(limit = 20) {
  const json = await apiFetch(`${NODE_API_BASE}/users/search-history?limit=${limit}`);
  return json.data;
}

/**
 * Get user's favorite songs
 */
export async function getFavoriteSongs(page = 1, limit = 50) {
  const json = await apiFetch(`${NODE_API_BASE}/users/favorites?page=${page}&limit=${limit}`);
  return json.data;
}

/**
 * Add song to favorites
 */
export async function addToFavorites(songId: string, songData?: { title?: string; artist?: string; image?: string }) {
  const json = await apiFetch(`${NODE_API_BASE}/users/favorites`, {
    method: 'POST',
    body: JSON.stringify({ 
      songId,
      title: songData?.title || '',
      artist: songData?.artist || '',
      image: songData?.image || ''
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  return json.data;
}

/**
 * Remove song from favorites
 */
export async function removeFromFavorites(songId: string) {
  const json = await apiFetch(`${NODE_API_BASE}/users/favorites/${songId}`, {
    method: 'DELETE'
  });
  return json.data;
}

/**
 * Get library data (searches, history, favorites)
 */
export async function getLibraryData(tab = 'searched', page = 1, limit = 20) {
  const json = await apiFetch(`${NODE_API_BASE}/users/library?tab=${tab}&page=${page}&limit=${limit}`);
  return json.data;
}

/**
 * Delete a search from history
 */
export async function deleteSearchHistory(searchId: string) {
  const json = await apiFetch(`${NODE_API_BASE}/users/search-history/${searchId}`, {
    method: 'DELETE'
  });
  return json;
}
//endregion

//region admin API
/**
 * Fetch admin dashboard statistics
 */
export async function getAdminStats() {
  const json = await apiFetch(`${NODE_API_BASE}/admin/stats`);
  return json.data;
}

/**
 * Fetch all users with optional search (Admin only)
 */
export async function getAdminUsers(search = '') {
  const url = `${NODE_API_BASE}/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`;
  const json = await apiFetch(url);
  return json.data;
}
//endregion

//region user API
/**
 * Fetch user profile statistics
 */
export async function getProfileStats() {
  const json = await apiFetch(`${NODE_API_BASE}/users/stats`);
  return json.data;
}
//endregion

//region recommendation API
/**
 * Upload image for emotion-based music recommendation
 */
export async function uploadImage(file: File, limit = 10) {
  const form = new FormData();
  form.append('file', file);
  
  const res = await fetch(`${API_BASE}/recommend/upload?limit=${limit}`, {
    method: 'POST',
    body: form,
  });
  
  if (!res.ok) {
    throw new Error('Upload failed');
  }
  
  return await res.json();
}
//endregion

//region exports
/**
 * Default export with all API functions
 */
export default {
  // Songs
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  // Artists
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  // Languages
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  // Activity
  logActivity,
  getSearchHistory,
  getFavoriteSongs,
  getLibraryData,
  deleteSearchHistory,
  // Admin
  getAdminStats,
  getAdminUsers,
  // User
  getProfileStats,
  // Recommendation
  uploadImage
};
//endregion
