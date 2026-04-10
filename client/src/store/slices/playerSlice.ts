//region imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//endregion

//region interfaces
/**
 * Song interface representing a music track
 */
export interface Song {
  songname: string;
  artist: string;
  language: string;
  emotion: string;
  context: string;
  image_climate: string;
  audio_path?: string;
  [key: string]: unknown;
}

/**
 * Player state interface
 */
interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
}
//endregion

//region initial state
/**
 * Initial player state
 */
const initialState: PlayerState = {
  currentSong: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.7,
};
//endregion

//region slice
/**
 * Player slice for managing music playback state
 * Handles current song, queue, playback controls, and volume
 */
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Set current song and optionally update queue
    setSong(state, action: PayloadAction<{ song: Song; queue?: Song[] }>) {
      const { song, queue } = action.payload;
      if (queue && queue.length > 0) {
        const idx = queue.findIndex((s) => s.songname === song.songname);
        state.queue = queue;
        state.currentIndex = idx >= 0 ? idx : 0;
        state.currentSong = queue[state.currentIndex];
      } else {
        state.currentSong = song;
        state.queue = [song];
        state.currentIndex = 0;
      }
      state.isPlaying = true;
    },
    
    // Toggle play/pause
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    
    // Set volume level
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    
    // Play next track in queue
    nextTrack(state) {
      if (state.queue.length === 0) return;
      state.currentIndex = (state.currentIndex + 1) % state.queue.length;
      state.currentSong = state.queue[state.currentIndex];
    },
    
    // Play previous track in queue
    previousTrack(state) {
      if (state.queue.length === 0) return;
      state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
      state.currentSong = state.queue[state.currentIndex];
    },
    
    // Clear player state
    clearPlayer(state) {
      state.currentSong = null;
      state.queue = [];
      state.currentIndex = 0;
      state.isPlaying = false;
    },
  },
});
//endregion

//region exports
export const { setSong, setIsPlaying, setVolume, nextTrack, previousTrack, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
//endregion
