//region imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//endregion

//region interfaces
/**
 * UI state interface for managing application-wide UI state
 */
interface UIState {
  recommendedSongs: Record<string, unknown>[];
  recommendedFromModal: Record<string, unknown>[];
  modalAnalysis: Record<string, any> | null;
  isRecommendedOnly: boolean;
  showAnalysis: boolean;
  recommendedPage: number;
  recentSearches: any[];
  libraryActiveTab: 'searched' | 'history' | 'favorites' | 'recommendations';
  libraryCurrentPage: number;
  librarySearch: string;
}
//endregion

//region initial state
/**
 * Initial UI state
 */
const initialState: UIState = {
  recommendedSongs: [],
  recommendedFromModal: [],
  modalAnalysis: null,
  isRecommendedOnly: false,
  showAnalysis: false,
  recommendedPage: 1,
  recentSearches: [],
  libraryActiveTab: 'searched',
  libraryCurrentPage: 1,
  librarySearch: '',
};
//endregion

//region slice
/**
 * UI slice for managing application-wide UI state
 * Handles recommendations, analysis display, and search history
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set recommended songs from home page
    setRecommendedSongs(state, action: PayloadAction<Record<string, unknown>[]>) {
      state.recommendedSongs = action.payload;
      state.isRecommendedOnly = action.payload.length > 0;
    },

    // Set recommended songs from modal
    setRecommendedFromModal(state, action: PayloadAction<Record<string, unknown>[]>) {
      state.recommendedFromModal = action.payload;
    },

    // Set modal analysis data
    setModalAnalysis(state, action: PayloadAction<Record<string, any> | null>) {
      state.modalAnalysis = action.payload;
    },

    // Toggle analysis display
    setShowAnalysis(state, action: PayloadAction<boolean>) {
      state.showAnalysis = action.payload;
    },

    // Set recommended page
    setRecommendedPage(state, action: PayloadAction<number>) {
      state.recommendedPage = action.payload;
    },

    // Set recent searches
    setRecentSearches(state, action: PayloadAction<any[]>) {
      state.recentSearches = action.payload;
    },

    // Reset recommendations
    resetRecommendations(state) {
      state.recommendedSongs = [];
      state.recommendedFromModal = [];
      state.modalAnalysis = null;
      state.isRecommendedOnly = false;
      state.showAnalysis = false;
      state.recommendedPage = 1;
    },

    // Library actions
    setLibraryActiveTab(state, action: PayloadAction<'searched' | 'history' | 'favorites'>) {
      state.libraryActiveTab = action.payload;
      state.libraryCurrentPage = 1; // Reset to first page when changing tabs
    },

    setLibraryCurrentPage(state, action: PayloadAction<number>) {
      state.libraryCurrentPage = action.payload;
    },

    setLibrarySearch(state, action: PayloadAction<string>) {
      state.librarySearch = action.payload;
    },

    // Clear all UI state
    clearUIState(state) {
      state.recommendedSongs = [];
      state.recommendedFromModal = [];
      state.modalAnalysis = null;
      state.isRecommendedOnly = false;
      state.showAnalysis = false;
      state.recommendedPage = 1;
      state.recentSearches = [];
      state.libraryActiveTab = 'searched';
      state.libraryCurrentPage = 1;
      state.librarySearch = '';
    },
  },
});
//endregion

//region exports
export const {
  setRecommendedSongs,
  setRecommendedFromModal,
  setModalAnalysis,
  setShowAnalysis,
  setRecommendedPage,
  setRecentSearches,
  resetRecommendations,
  setLibraryActiveTab,
  setLibraryCurrentPage,
  setLibrarySearch,
  clearUIState,
} = uiSlice.actions;
export default uiSlice.reducer;
//endregion
