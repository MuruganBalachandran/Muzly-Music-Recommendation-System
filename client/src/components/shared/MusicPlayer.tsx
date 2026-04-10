import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsPlaying, setVolume as setReduxVolume, nextTrack, previousTrack, clearPlayer } from '@/store/slices/playerSlice';

export const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, volume, queue } = useAppSelector((state) => state.player);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio tag
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => dispatch(nextTrack());

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch]);

  // Handle current song changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    
    let path = '';
    
    // Play from MongoDB Buffer via our Backend API
    if (currentSong._id) {
      path = `http://127.0.0.1:5000/api/v1/songs/play/${currentSong._id}`;
    } 

    // Only update and play if the source changed
    if (audioRef.current.src !== path) {
      audioRef.current.src = path;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Autoplay prevented", e);
          dispatch(setIsPlaying(false));
        });
      }
    }
  }, [currentSong, isPlaying, dispatch]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => dispatch(setIsPlaying(false)));
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying, dispatch]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Render logic
  if (!currentSong) return null;

  const togglePlay = () => dispatch(setIsPlaying(!isPlaying));
  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    dispatch(clearPlayer());
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0b0f0e] to-[#1a1f1e] border-t border-[#064E3B]/50 z-40"
      >
        <div className="w-full h-1 bg-[#1a1f1e]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#06B6D4] to-[#064E3B]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={(currentSong.album_image as string) || (currentSong.image as string) || "https://images.unsplash.com/photo-1614149162883-504ce0ad44ca?w=50&h=50&fit=crop"}
              alt={currentSong.songname}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{currentSong.songname}</h4>
              <p className="text-xs text-[#8B5CF6] truncate">{currentSong.artist}</p>
            </div>
            <button onClick={handleClose} className="text-[#8B5CF6] hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            <button onClick={() => dispatch(previousTrack())} disabled={queue.length <= 1} className="text-[#06B6D4] hover:text-white transition disabled:opacity-50">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay} className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2] hover:from-[#0891b2] hover:to-[#06B6D4] text-black rounded-full p-2 sm:p-3 transition">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => dispatch(nextTrack())} disabled={queue.length <= 1} className="text-[#06B6D4] hover:text-white transition disabled:opacity-50">
              <SkipForward size={18} />
            </button>
            <div className="hidden sm:flex text-xs text-[#8B5CF6] gap-2 flex-1 ml-4 line-clamp-1 truncate">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="relative">
              <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className="text-[#06B6D4] hover:text-white transition">
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full right-0 mb-2 bg-[#0b0f0e] border border-[#064E3B] rounded-lg p-2">
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => dispatch(setReduxVolume(parseFloat(e.target.value)))} className="w-24 h-1 bg-[#1a1f1e] rounded-lg cursor-pointer accent-[#06B6D4]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B5CF6] hidden sm:inline">{formatTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => handleSeek(parseFloat(e.target.value))} className="flex-1 h-1 bg-[#1a1f1e] rounded-lg cursor-pointer accent-[#06B6D4]" />
            <span className="text-xs text-[#8B5CF6] hidden sm:inline">{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
