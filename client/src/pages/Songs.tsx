import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LiquidEther from "@/components/animations/LiquidEther";
import ChromaGrid from "@/components/animations/ChromaGrid";
import { toast } from "react-toastify";
import { getSongs, getArtists, getLanguages, logActivity } from "@/lib/api";
import ClickSpark from "@/components/animations/ClickSpark";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSong } from "@/store/slices/playerSlice";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { GetRecommendations } from "@/components/common/GetRecommendations";
import { Music, ChevronLeft, ChevronRight, MoreHorizontal, Filter, Plus, Sparkles } from "lucide-react";
import {
  setRecommendedSongs,
  setRecommendedFromModal,
  setModalAnalysis,
  setShowAnalysis,
  setRecommendedPage,
  resetRecommendations,
} from "@/store/slices/uiSlice";

// Emoji helper functions
const getEmotionEmoji = (emotion: string): string => {
  const emo = emotion.toLowerCase();
  if (emo.includes('happy') || emo.includes('joy')) return '😊';
  if (emo.includes('sad') || emo.includes('sadness')) return '😢';
  if (emo.includes('angry') || emo.includes('anger')) return '😠';
  if (emo.includes('fear') || emo.includes('afraid')) return '😨';
  if (emo.includes('surprise') || emo.includes('surprised')) return '😲';
  if (emo.includes('disgust') || emo.includes('disgusted')) return '🤢';
  if (emo.includes('neutral') || emo.includes('calm')) return '😐';
  if (emo.includes('love') || emo.includes('loving')) return '😍';
  if (emo.includes('excited') || emo.includes('excitement')) return '🤩';
  if (emo.includes('confused') || emo.includes('confusion')) return '😕';
  if (emo.includes('anxious') || emo.includes('anxiety')) return '😰';
  if (emo.includes('confident') || emo.includes('confidence')) return '😎';
  return '😊';
};

const getContextEmoji = (context: string): string => {
  const ctx = context.toLowerCase();
  if (ctx.includes('indoor')) return '🏠';
  if (ctx.includes('outdoor')) return '🌳';
  if (ctx.includes('urban')) return '🏙️';
  if (ctx.includes('nature')) return '🌲';
  if (ctx.includes('beach')) return '🏖️';
  if (ctx.includes('mountain')) return '⛰️';
  if (ctx.includes('forest')) return '🌲';
  if (ctx.includes('city')) return '🏙️';
  if (ctx.includes('park')) return '🌳';
  if (ctx.includes('water')) return '💧';
  if (ctx.includes('sky')) return '☁️';
  if (ctx.includes('night')) return '🌙';
  if (ctx.includes('day')) return '☀️';
  return '🎬';
};

const getClimateEmoji = (climate: string): string => {
  const clim = climate.toLowerCase();
  if (clim.includes('sunny') || clim.includes('clear')) return '☀️';
  if (clim.includes('rainy') || clim.includes('rain')) return '🌧️';
  if (clim.includes('cloudy') || clim.includes('cloud')) return '☁️';
  if (clim.includes('snowy') || clim.includes('snow')) return '❄️';
  if (clim.includes('stormy') || clim.includes('storm')) return '⛈️';
  if (clim.includes('foggy') || clim.includes('fog')) return '🌫️';
  if (clim.includes('windy') || clim.includes('wind')) return '💨';
  if (clim.includes('normal')) return '🌤️';
  return '🌤️';
};

const getWeatherEmoji = (weather: string): string => {
  const w = weather.toLowerCase();
  if (w.includes('clear') || w.includes('sunny')) return '☀️';
  if (w.includes('rain')) return '🌧️';
  if (w.includes('cloud')) return '☁️';
  if (w.includes('snow')) return '❄️';
  if (w.includes('storm')) return '⛈️';
  if (w.includes('fog')) return '🌫️';
  if (w.includes('wind')) return '💨';
  return '🌤️';
};

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: state.isFocused ? 'rgba(255, 159, 252, 0.5)' : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    minHeight: '42px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgba(255, 159, 252, 0.3)',
    }
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    zIndex: 99
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#FF9FFC' 
      : state.isFocused 
        ? 'rgba(255, 159, 252, 0.1)' 
        : 'transparent',
    color: state.isSelected ? '#000' : '#fff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#FF9FFC',
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.3)',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
  })
};

const Songs = () => {
  // 1. Hooks & Basic State
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Redux UI state
  const {
    recommendedSongs,
    recommendedFromModal,
    modalAnalysis,
    isRecommendedOnly,
    showAnalysis,
    recommendedPage,
  } = useAppSelector((state) => state.ui);

  const [songs, setSongs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(() => {
    // Check if we're loading recommended songs on initial render
    const params = new URLSearchParams(window.location.search);
    return params.get('recommended') !== 'true';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalSongs, setTotalSongs] = useState<number>(0);
  const itemsPerPage = 10;

  // 2. Filter State
  const [artists, setArtists] = useState<{ label: string, value: string }[]>([]);
  const [languages, setLanguages] = useState<{ label: string, value: string }[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<{ label: string, value: string } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<{ label: string, value: string } | null>(null);
  const [appliedArtist, setAppliedArtist] = useState<{ label: string, value: string } | null>(null);
  const [appliedLanguage, setAppliedLanguage] = useState<{ label: string, value: string } | null>(null);

  // 3. Recent Searches State
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [deletingSearchId, setDeletingSearchId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [songFormData, setSongFormData] = useState<any>({
    songname: '',
    artist: '',
    language: '',
    audio_file: null as File | null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomArtist, setIsCustomArtist] = useState(false);
  const [isCustomLanguage, setIsCustomLanguage] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // 4. Effects
  useEffect(() => {
    getArtists().then(data => setArtists(data.map((a: any) => ({ label: a.name, value: a.name }))));
    getLanguages().then(data => setLanguages(data.map((l: any) => ({ label: l.name, value: l.name }))));
    
    // Load recent searches
    loadRecentSearches();

    // Check if we're viewing recommended songs
    const params = new URLSearchParams(window.location.search);
    if (params.get('recommended') === 'true') {
      const stored = sessionStorage.getItem('recommendedSongs');
      const storedAnalysis = sessionStorage.getItem('recommendedAnalysis');
      if (stored) {
        try {
          const recs = JSON.parse(stored);
          dispatch(setRecommendedSongs(recs));
          setSongs(recs);
          setTotalSongs(recs.length);
          sessionStorage.removeItem('recommendedSongs');
          
          // Load analysis if available
          if (storedAnalysis) {
            const analysis = JSON.parse(storedAnalysis);
            dispatch(setModalAnalysis(analysis));
            dispatch(setShowAnalysis(true)); // Show analysis by default when coming from Home
            sessionStorage.removeItem('recommendedAnalysis');
          }
        } catch (e) {
          console.error('Failed to parse recommended songs', e);
        }
      }
    }
    setLoading(false);
    isInitialLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (isRecommendedOnly || isInitialLoadRef.current) return; // Skip if showing only recommended songs or initial load
    
    let mounted = true;
    setLoading(true);
    getSongs(currentPage, itemsPerPage, appliedSearch, {
      artist: appliedArtist?.value,
      language: appliedLanguage?.value
    })
      .then((res) => {
        if (!mounted) return;
        setSongs(res.data || []);
        setTotalSongs(res.total || 0);
      })
      .catch((err) => {
        console.error('Failed to load songs', err);
        toast.error('Failed to load songs from server');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false };
  }, [currentPage, appliedSearch, appliedArtist, appliedLanguage, isRecommendedOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearch, appliedArtist, appliedLanguage]);

  // 5. Handlers
  const handleGo = async () => {
    setAppliedSearch(searchQuery);
    setAppliedArtist(selectedArtist);
    setAppliedLanguage(selectedLanguage);
    setCurrentPage(1);
    setShowRecentSearches(false);
    
    // Log search if there is any filter/search
    if (searchQuery || selectedArtist || selectedLanguage) {
      try {
         await logActivity({
            action: 'Searched',
            query: searchQuery || '',
            searchType: 'song',
            results: songs.length,
            details: `Filters - Artist: ${selectedArtist?.label || 'None'}, Lang: ${selectedLanguage?.label || 'None'}`
         });
         // Reload recent searches
         loadRecentSearches();
      } catch (e) {
         console.error('Failed to log search', e);
      }
    }
  };

  const loadRecentSearches = async () => {
    try {
      const { getSearchHistory } = await import('@/lib/api');
      const searches = await getSearchHistory(5); // Only 5 recent searches
      setRecentSearches(searches || []);
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  };

  const handleRecentSearchClick = (search: any) => {
    setSearchQuery(search.query || '');
    setSelectedArtist(null);
    setSelectedLanguage(null);
    setShowRecentSearches(false);
    
    // Apply search immediately
    setAppliedSearch(search.query || '');
    setAppliedArtist(null);
    setAppliedLanguage(null);
    setCurrentPage(1);
  };

  const handleDeleteSearch = async (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation();
    try {
      setDeletingSearchId(searchId);
      const { deleteSearchHistory } = await import('@/lib/api');
      await deleteSearchHistory(searchId);
      // Reload recent searches
      loadRecentSearches();
    } catch (err) {
      console.error('Failed to delete search', err);
      toast.error('Failed to delete search');
    } finally {
      setDeletingSearchId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedArtist(null);
    setSelectedLanguage(null);
    setAppliedSearch('');
    setAppliedArtist(null);
    setAppliedLanguage(null);
    setCurrentPage(1);
    setShowRecentSearches(false);
  };

  const handlePlay = useCallback(async (song: Record<string, unknown>) => {
    if (!isAuthenticated) {
      toast.error('Please login to play songs');
      return;
    }
    const title = (song['songname'] || song['track_name'] || song['title']) as string | undefined;
    const artist = (song['artist'] || song['artist_name']) as string | undefined;
    const songId = (song['_id'] || song['id']) as string | undefined;
    const playerSong = {
      songname: title || 'Unknown',
      artist: artist || 'Unknown',
      language: (song['language'] || 'Unknown') as string,
      emotion: (song['emotion'] || '') as string,
      context: (song['context'] || '') as string,
      image_climate: (song['image_climate'] || '') as string,
      audio_path: (song['audio_path'] || '') as string,
      ...song
    };
    dispatch(setSong({ song: playerSong, queue: songs as any }));
    toast.success(`Now playing: ${title || 'Unknown'}`);
    try {
      await logActivity({ 
        action: 'Played', 
        songId: songId || '',
        songName: title || 'Unknown', 
        artist: artist || 'Unknown',
        duration: 0,
        details: `Played from search listing` 
      });
      console.log('✅ Song play activity logged successfully');
    } catch (err) {
      console.error('Activity logging failed', err);
    }
  }, [isAuthenticated, songs, dispatch]);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (!value && name !== 'audio_file') {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'audio_file' && !value && !selectedSong) {
      error = 'Audio file is required for new tracks';
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleDeleteClick = useCallback((song: any) => {
    setSelectedSong(song);
    setIsDeleteModalOpen(true);
  }, []);

  const handleToggleFavorite = useCallback(async (song: Record<string, unknown>) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }
    
    try {
      const songId = (song['_id'] || song['id']) as string;
      const songTitle = (song['songname'] || song['track_name'] || song['title']) as string;
      const songArtist = (song['artist'] || song['artist_name']) as string;
      const songImage = (song['album_image'] || song['image']) as string;
      const isFavorited = favorites.has(songId);
      
      if (isFavorited) {
        const { removeFromFavorites } = await import('@/lib/api');
        await removeFromFavorites(songId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(songId);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        const { addToFavorites } = await import('@/lib/api');
        await addToFavorites(songId, { title: songTitle, artist: songArtist, image: songImage });
        setFavorites(prev => new Set(prev).add(songId));
        toast.success('Added to favorites');
      }
      
      // Log activity
      await logActivity({
        action: isFavorited ? 'Unfavorited' : 'Favorited',
        songId: songId,
        songName: songTitle,
        artist: songArtist,
        details: `${isFavorited ? 'Removed from' : 'Added to'} favorites`
      });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      toast.error('Failed to update favorite');
    }
  }, [isAuthenticated, favorites]);

  // 6. Memoized Items
  const palette = useMemo(() => [
    { border: '#8B5CF6', gradient: 'linear-gradient(145deg, #8B5CF6, #000)' },
    { border: '#06B6D4', gradient: 'linear-gradient(210deg, #06B6D4, #000)' },
    { border: '#10B981', gradient: 'linear-gradient(165deg, #10B981, #000)' },
    { border: '#F59E0B', gradient: 'linear-gradient(195deg, #F59E0B, #000)' },
    { border: '#EF4444', gradient: 'linear-gradient(225deg, #EF4444, #000)' },
    { border: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5, #000)' }
  ], []);

  const chromaItems = useMemo(() => {
    return songs.map((song, i) => {
      const c = palette[i % palette.length];
      const songId = (song['_id'] || song['id']) as string;
      return {
        image: (song['album_image'] || song['image'] || 'https://via.placeholder.com/400') as string,
        title: (song['songname'] || song['track_name'] || song['title'] || 'Unknown') as string,
        subtitle: `${song['artist'] || song['artist_name'] || 'Unknown'} • ${song['language'] || song['genre'] || '-'}`,
        artist: (song['artist'] || song['artist_name'] || 'Unknown') as string,
        language: (song['language'] || song['genre'] || '-') as string,
        handle: (song['duration'] || song['length'] || '-') as string,
        borderColor: c.border,
        gradient: c.gradient,
        onPlay: () => handlePlay(song),
        onFavorite: () => handleToggleFavorite(song),
        isFavorite: favorites.has(songId),
        onDelete: user?.role === 'admin' ? () => handleDeleteClick(song) : undefined
      };
    });
  }, [songs, user, palette, handlePlay, handleToggleFavorite, favorites]); 
  
  const confirmDelete = async () => {
    if (!selectedSong) return;
    try {
      const { deleteSong } = await import('@/lib/api');
      await deleteSong(selectedSong._id);
      toast.success("Song Deleted Permanently");
      setIsDeleteModalOpen(false);
      // reload
      const [res, artistData, langData] = await Promise.all([
        getSongs(currentPage, itemsPerPage, appliedSearch, {
          artist: appliedArtist?.value,
          language: appliedLanguage?.value
        }),
        getArtists(),
        getLanguages()
      ]);
      setSongs(res.data || []);
      setTotalSongs(res.total || 0);
      setArtists(artistData.map((a: any) => ({ label: a.name, value: a.name })));
      setLanguages(langData.map((l: any) => ({ label: l.name, value: l.name })));
    } catch (err) {
      toast.error("Failed to delete song");
    }
  };

  const handleSaveSong = async () => {
    // 1. Validate all fields
    const fields = ['songname', 'artist', 'language'];
    let isValid = true;
    fields.forEach(f => {
      if (!validateField(f, songFormData[f])) isValid = false;
    });
    if (!selectedSong && !validateField('audio_file', songFormData.audio_file)) isValid = false;

    if (!isValid) {
      toast.error("Please resolve all validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const { createSong } = await import('@/lib/api');
      
      const formData = new FormData();
      formData.append('songname', songFormData.songname);
      formData.append('artist', songFormData.artist);
      formData.append('language', songFormData.language);
      if (songFormData.audio_file) {
        formData.append('audio', songFormData.audio_file);
      }

      await createSong(formData);
      toast.success("New Masterpiece Onboarded Successfully");
      
      setIsEditModalOpen(false);
      // reload
      const [res, artistData, langData] = await Promise.all([
        getSongs(currentPage, itemsPerPage, appliedSearch, {
          artist: selectedArtist?.value,
          language: selectedLanguage?.value
        }),
        getArtists(),
        getLanguages()
      ]);
      setSongs(res.data || []);
      setTotalSongs(res.total || 0);
      setArtists(artistData.map((a: any) => ({ label: a.name, value: a.name })));
      setLanguages(langData.map((l: any) => ({ label: l.name, value: l.name })));
    } catch (err: any) {
      toast.error(err.message || "Process failed. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSong = () => {
    setSelectedSong(null);
    setSongFormData({
      songname: '',
      artist: '',
      language: '',
      audio_file: null
    });
    setFormErrors({});
    setIsCustomArtist(false);
    setIsCustomLanguage(false);
    setIsEditModalOpen(true);
  };

  const totalPages = Math.ceil(totalSongs / itemsPerPage);
  const currentItems = chromaItems;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <ClickSpark sparkColor='#FF9FFC' sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative pb-40">
        <div className="fixed inset-0 -z-10 bg-background">
          <LiquidEther colors={['#1a1a1a', '#0f0f0f', '#262626']} mouseForce={15} cursorSize={80} autoDemo={true} autoSpeed={0.3} autoIntensity={1.5} />
        </div>
        <Header />
        
        <main className="pt-24 pb-12 relative z-10">
          <div className="w-[90%] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 text-white">
                    {isRecommendedOnly || recommendedFromModal.length > 0 ? 'Your ' : 'Discover '}<span className="text-white">{isRecommendedOnly || recommendedFromModal.length > 0 ? 'Recommendations' : 'Amazing Tracks'}</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {isRecommendedOnly || recommendedFromModal.length > 0 ? 'Explore more songs based on your prediction' : 'Browse our curated collection of AI-recommended songs'}
                  </p>
                </div>

                {/* First Row: Add Major Track & Get Recommendations & Icon Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {user?.role === 'admin' && (
                      <button 
                        onClick={handleAddSong}
                        className="flex-1 px-6 py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.03] transition-all"
                      >
                        <Plus className="w-5 h-5" /> Add Major Track
                      </button>
                    )}
                    <button 
                      onClick={() => setIsRecommendationsModalOpen(true)}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.03] transition-all ${user?.role !== 'admin' ? 'sm:col-span-2' : ''}`}
                    >
                      <Sparkles className="w-5 h-5" /> Get Recommendations
                    </button>
                  </div>
                  
                  {/* Icon Buttons - Right Side (only show when recommendations exist) */}
                  {(recommendedFromModal.length > 0 || isRecommendedOnly) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => dispatch(setShowAnalysis(!showAnalysis))}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        title={showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          dispatch(setRecommendedFromModal([]));
                          dispatch(setRecommendedSongs([]));
                          dispatch(setModalAnalysis(null));
                          dispatch(setShowAnalysis(false));
                          dispatch(setRecommendedPage(1));
                          setSongs([]);
                          setTotalSongs(0);
                        }}
                        className="p-3 bg-accent/80 hover:bg-accent text-white rounded-lg transition-colors"
                        title="Reset"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Second Row: Search and Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="relative flex-[2]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowRecentSearches(true)}
                      onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGo()}
                      placeholder="Title search..."
                      className="w-full rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent/50 outline-none transition-all"
                    />
                    
                    {/* Recent Searches Dropdown */}
                    {showRecentSearches && recentSearches.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 shadow-lg"
                      >
                        <div className="p-2 max-h-64 overflow-y-auto">
                          {recentSearches.map((search, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors group"
                            >
                              <button
                                onClick={() => handleRecentSearchClick(search)}
                                className="flex-1 text-left text-sm text-white/80 hover:text-white flex items-center gap-2"
                              >
                                <Music className="w-3 h-3 text-accent/60" />
                                {search.query}
                              </button>
                              <button
                                onClick={(e) => handleDeleteSearch(e, search._id)}
                                disabled={deletingSearchId === search._id}
                                className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                title="Delete search"
                              >
                                {deletingSearchId === search._id ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full"
                                  />
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {showRecentSearches && recentSearches.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-50 text-center text-sm text-white/50"
                      >
                        No searches yet
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Select
                      options={artists}
                      isClearable
                      placeholder="Artist..."
                      value={selectedArtist}
                      onChange={(opt: any) => setSelectedArtist(opt)}
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl relative hover:border-accent/50 transition-all z-[98]">
                    <Select
                      options={languages}
                      isClearable
                      placeholder="Language..."
                      value={selectedLanguage}
                      onChange={(opt: any) => setSelectedLanguage(opt)}
                      styles={customSelectStyles}
                    />
                  </div>
                  
                  <button
                    onClick={handleGo}
                    disabled={(!searchQuery && !selectedArtist && !selectedLanguage && !appliedSearch && !appliedArtist && !appliedLanguage)}
                    className="p-3 bg-accent/80 hover:bg-accent text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
                    title="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleClearFilters}
                    disabled={(!searchQuery && !selectedArtist && !selectedLanguage)}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
                    title="Clear filters"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="p-3 bg-accent/20 rounded-full"
                >
                  <Music className="w-8 h-8 text-accent opacity-80" />
                </motion.div>
                <p className="text-muted-foreground font-medium animate-pulse">Loading tracks...</p>
              </div>
            ) : recommendedFromModal.length > 0 ? (
              // RECOMMENDATIONS ENVIRONMENT
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Analysis Results - Collapsible - Same as Home Page */}
                <AnimatePresence>
                  {showAnalysis && modalAnalysis && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-12"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image placeholder on left */}
                        <div className="relative rounded-2xl overflow-hidden shadow-float lg:col-span-2 h-96 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                          <div className="text-center">
                            <Sparkles className="w-16 h-16 text-accent/40 mx-auto mb-4" />
                            <p className="text-muted-foreground">Analysis Results</p>
                          </div>
                        </div>

                        {/* Analysis Details on right */}
                        <div className="glass rounded-2xl p-6 space-y-4 lg:col-span-1 h-96 flex flex-col justify-between">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-accent animate-glow" />
                            <h3 className="text-xl font-semibold">Analysis Results</h3>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-3">Detected Emotion:</div>
                            {modalAnalysis?.analysis?.confidence !== undefined ? (
                              <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-3 overflow-hidden mb-3">
                                <div className="h-3 bg-blue-500" style={{ width: `${Math.round((modalAnalysis.analysis.confidence as number) * 100)}%` }} />
                              </div>
                            ) : null}
                            <div className="text-lg font-semibold text-white">
                              {modalAnalysis?.analysis?.emotion 
                                ? `${getEmotionEmoji(String(modalAnalysis.analysis.emotion))} ${String(modalAnalysis.analysis.emotion).charAt(0).toUpperCase() + String(modalAnalysis.analysis.emotion).slice(1)}${modalAnalysis.analysis.confidence ? ` (${(modalAnalysis.analysis.confidence * 100).toFixed(1)}% confidence)` : ''}` 
                                : '❓ Unknown'}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Scene Context:</div>
                              <div className="text-sm font-semibold text-white">
                                {modalAnalysis?.analysis?.context 
                                  ? `${getContextEmoji(String(modalAnalysis.analysis.context))} ${String(modalAnalysis.analysis.context).toUpperCase()}` 
                                  : '❓ Unknown'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Image Climate:</div>
                              <div className="text-sm font-semibold text-white">
                                {modalAnalysis?.analysis?.climate 
                                  ? `${getClimateEmoji(String(modalAnalysis.analysis.climate))} ${String(modalAnalysis.analysis.climate).toUpperCase()}` 
                                  : '❓ Unknown'}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Location:</div>
                                <div className="text-xs font-semibold text-white">
                                  {modalAnalysis?.location 
                                    ? `📌 ${modalAnalysis.location.city || ''}${modalAnalysis.location.region ? ', ' + modalAnalysis.location.region : ''}` 
                                    : '❓ Unknown'}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-2">Weather:</div>
                                <div className="text-xs font-semibold text-white">
                                  {modalAnalysis?.weather?.climate 
                                    ? `${getWeatherEmoji(String(modalAnalysis.weather.climate))} ${String(modalAnalysis.weather.climate).toUpperCase()}` 
                                    : '❓ Unknown'}
                                </div>
                                {modalAnalysis?.weather?.temp && (
                                  <div className="text-xs text-muted-foreground">🌡️ {modalAnalysis.weather.temp}°C</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recommended Songs Grid - All items with pagination */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <ChromaGrid 
                    items={recommendedFromModal.slice((recommendedPage - 1) * itemsPerPage, recommendedPage * itemsPerPage).map((song, i) => {
                      const palette = [
                        { border: '#8B5CF6', gradient: 'linear-gradient(145deg, #8B5CF6, #000)' },
                        { border: '#06B6D4', gradient: 'linear-gradient(210deg, #06B6D4, #000)' },
                        { border: '#10B981', gradient: 'linear-gradient(165deg, #10B981, #000)' },
                        { border: '#F59E0B', gradient: 'linear-gradient(195deg, #F59E0B, #000)' },
                        { border: '#EF4444', gradient: 'linear-gradient(225deg, #EF4444, #000)' },
                        { border: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5, #000)' }
                      ];
                      const c = palette[i % palette.length];
                      const songId = (song['_id'] || song['id']) as string;
                      return {
                        image: (song['album_image'] || song['image'] || 'https://via.placeholder.com/400') as string,
                        title: (song['songname'] || song['track_name'] || song['title'] || 'Unknown') as string,
                        subtitle: `${song['artist'] || song['artist_name'] || 'Unknown'} • ${song['language'] || song['genre'] || '-'}`,
                        artist: (song['artist'] || song['artist_name'] || 'Unknown') as string,
                        language: (song['language'] || song['genre'] || '-') as string,
                        handle: (song['duration'] || song['length'] || '-') as string,
                        borderColor: c.border,
                        gradient: c.gradient,
                        onPlay: () => handlePlay(song),
                        onFavorite: () => handleToggleFavorite(song),
                        isFavorite: favorites.has(songId),
                      };
                    })} 
                    radius={300} 
                    damping={0.45} 
                    fadeOut={0.6} 
                    ease="power3.out" 
                    columns={5} 
                  />
                </motion.div>

                {/* Pagination for Recommendations */}
                {Math.ceil(recommendedFromModal.length / itemsPerPage) > 1 && (
                  <div className="flex justify-end items-center mt-12 gap-2">
                    <button
                      onClick={() => dispatch(setRecommendedPage(Math.max(1, recommendedPage - 1)))}
                      disabled={recommendedPage === 1}
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {getPageNumbers().map((pageNum, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof pageNum === 'number' ? dispatch(setRecommendedPage(pageNum)) : null}
                        disabled={typeof pageNum !== 'number'}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                          pageNum === recommendedPage 
                            ? 'bg-accent text-white shadow-lg scale-105' 
                            : typeof pageNum === 'number'
                            ? 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white'
                            : 'bg-transparent text-muted-foreground cursor-default'
                        }`}
                      >
                        {typeof pageNum === 'number' ? pageNum : <MoreHorizontal className="w-4 h-4" />}
                      </button>
                    ))}

                    <button
                      onClick={() => dispatch(setRecommendedPage(Math.min(Math.ceil(recommendedFromModal.length / itemsPerPage), recommendedPage + 1)))}
                      disabled={recommendedPage === Math.ceil(recommendedFromModal.length / itemsPerPage)}
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : chromaItems.length > 0 ? (
              // NORMAL SONGS ENVIRONMENT
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <ChromaGrid items={currentItems} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" columns={5} />
                
                {totalPages > 1 && (
                  <div className="flex justify-end items-center mt-12 gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {getPageNumbers().map((pageNum, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof pageNum === 'number' ? setCurrentPage(pageNum) : null}
                        disabled={typeof pageNum !== 'number'}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                          pageNum === currentPage 
                            ? 'bg-accent text-white shadow-lg scale-105' 
                            : typeof pageNum === 'number'
                            ? 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white'
                            : 'bg-transparent text-muted-foreground cursor-default'
                        }`}
                      >
                        {typeof pageNum === 'number' ? pageNum : <MoreHorizontal className="w-4 h-4" />}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              // NO SONGS FOUND
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 glass rounded-3xl shadow-elegant">
                <Music className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No songs found</h3>
                <p className="text-muted-foreground">Check back later or adjust your search.</p>
              </motion.div>
            )}
          </div>
        </main>

        {/* Admin Modals */}
        <ConfirmModal 
          open={isDeleteModalOpen}
          title="Permanently Delete Song?"
          description={`This will remove "${selectedSong?.songname || selectedSong?.title}" from the global library. This action cannot be undone.`}
          confirmLabel="Delete Forever"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />

        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-2xl glass border border-white/10 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Music className="w-32 h-32 text-accent" />
                </div>
                
                <h2 className="text-3xl font-display font-bold text-white mb-8">
                  {selectedSong?._id ? 'Refine Track Details' : 'Onboard New Masterpiece'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2 block pl-1">Track Identifier</label>
                      <input 
                        type="text" 
                        value={songFormData.songname || ''}
                        onBlur={() => validateField('songname', songFormData.songname)}
                        onChange={(e) => {
                          setSongFormData({ ...songFormData, songname: e.target.value });
                          if (formErrors.songname) setFormErrors({ ...formErrors, songname: '' });
                        }}
                        placeholder="e.g. Bohemian Rhapsody"
                        className={`w-full bg-white/5 border ${formErrors.songname ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-white outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all`}
                      />
                      {formErrors.songname && <p className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.songname}</p>}
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2 block pl-1">Primary Artist</label>
                      <Select
                        options={[...artists, { label: 'Others (Add New)', value: 'others' }]}
                        value={isCustomArtist ? { label: 'Others (Add New)', value: 'others' } : artists.find(a => a.value === songFormData.artist) || null}
                        onChange={(opt: any) => {
                          if (opt && opt.value === 'others') {
                            setIsCustomArtist(true);
                            setSongFormData({ ...songFormData, artist: '' });
                          } else {
                            setIsCustomArtist(false);
                            setSongFormData({ ...songFormData, artist: opt ? opt.value : '' });
                          }
                          if (formErrors.artist) setFormErrors({ ...formErrors, artist: '' });
                        }}
                        placeholder="Select or add Artist..."
                        styles={customSelectStyles}
                      />
                      {isCustomArtist && (
                        <input 
                          type="text" 
                          value={songFormData.artist || ''}
                          onBlur={() => validateField('artist', songFormData.artist)}
                          onChange={(e) => {
                            setSongFormData({ ...songFormData, artist: e.target.value });
                            if (formErrors.artist) setFormErrors({ ...formErrors, artist: '' });
                          }}
                          placeholder="Type new artist name..."
                          className={`mt-3 w-full bg-white/5 border ${formErrors.artist ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-white outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all`}
                        />
                      )}
                      {formErrors.artist && <p className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.artist}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2 block pl-1">Dialect / Language</label>
                      <Select
                        options={[...languages, { label: 'Others (Add New)', value: 'others' }]}
                        value={isCustomLanguage ? { label: 'Others (Add New)', value: 'others' } : languages.find(l => l.value === songFormData.language) || null}
                        onChange={(opt: any) => {
                          if (opt && opt.value === 'others') {
                            setIsCustomLanguage(true);
                            setSongFormData({ ...songFormData, language: '' });
                          } else {
                            setIsCustomLanguage(false);
                            setSongFormData({ ...songFormData, language: opt ? opt.value : '' });
                          }
                          if (formErrors.language) setFormErrors({ ...formErrors, language: '' });
                        }}
                        placeholder="Select or add Language..."
                        styles={customSelectStyles}
                      />
                      {isCustomLanguage && (
                        <input 
                          type="text" 
                          value={songFormData.language || ''}
                          onBlur={() => validateField('language', songFormData.language)}
                          onChange={(e) => {
                            setSongFormData({ ...songFormData, language: e.target.value });
                            if (formErrors.language) setFormErrors({ ...formErrors, language: '' });
                          }}
                          placeholder="Type new language..."
                          className={`mt-3 w-full bg-white/5 border ${formErrors.language ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3.5 text-white outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all`}
                        />
                      )}
                      {formErrors.language && <p className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.language}</p>}
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mb-2 block pl-1">Audio Master (MP3)</label>
                      <div className={`relative w-full bg-white/5 border ${formErrors.audio_file ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-3 transition-all flex items-center gap-3`}>
                        <input 
                          type="file" 
                          accept="audio/mpeg, audio/mp3"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setSongFormData({ ...songFormData, audio_file: file });
                            validateField('audio_file', file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <Music className="w-4 h-4 text-accent" />
                        </div>
                        <span className={`text-sm ${songFormData.audio_file ? 'text-white' : 'text-white/30'}`}>
                          {songFormData.audio_file ? songFormData.audio_file.name : 'Choose audio file...'}
                        </span>
                      </div>
                      {formErrors.audio_file && <p className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.audio_file}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting} className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all disabled:opacity-50">Cancel</button>
                  <button 
                    onClick={handleSaveSong} 
                    disabled={isSubmitting}
                    className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-accent to-[#FF9FFC]/80 text-white font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        Finalizing...
                      </>
                    ) : (
                      'Onboard Masterpiece'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Recommendations Modal */}
        <AnimatePresence>
          {isRecommendationsModalOpen && (
            <GetRecommendations
              isModal={true}
              onClose={() => {
                setIsRecommendationsModalOpen(false);
                // Recommendations will be shown on page after modal closes
              }}
              onRecommend={(payload) => {
                if (!isAuthenticated) {
                  toast.error("Please login to get recommendations");
                  navigate('/auth');
                  return;
                }
                if (!payload) {
                  dispatch(setRecommendedFromModal([]));
                  dispatch(setModalAnalysis(null));
                  return;
                }
                if (Array.isArray(payload)) {
                  dispatch(setRecommendedFromModal(payload));
                  dispatch(setModalAnalysis(null));
                  return;
                }
                const p = payload as Record<string, any>;
                if (p.recommendations) {
                  dispatch(setRecommendedFromModal(p.recommendations));
                  dispatch(setModalAnalysis(p));
                } else if (p instanceof Object && p.length) {
                  dispatch(setRecommendedFromModal(p as any[]));
                  dispatch(setModalAnalysis(null));
                } else {
                  dispatch(setRecommendedFromModal([]));
                  dispatch(setModalAnalysis(p));
                }
              }}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Songs;
