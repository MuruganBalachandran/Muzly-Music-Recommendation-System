import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LiquidEther from "@/components/animations/LiquidEther";
import ClickSpark from "@/components/animations/ClickSpark";
import { getLibraryData } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLibraryActiveTab, setLibraryCurrentPage, setLibrarySearch } from "@/store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { Music, Calendar, Loader, Search, ChevronLeft, ChevronRight, Heart, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 20;

type LibraryTab = 'searched' | 'history' | 'favorites' | 'recommendations';

export default function Library() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { libraryActiveTab, libraryCurrentPage, librarySearch, recommendedSongs, recommendedFromModal } = useAppSelector((state) => state.ui);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(setLibraryCurrentPage(1));
  }, [libraryActiveTab, dispatch]);

  useEffect(() => {
    fetchLibraryData();
  }, [libraryActiveTab, libraryCurrentPage, recommendedSongs, recommendedFromModal]);

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      
      // If viewing recommendations, load from Redux
      if (libraryActiveTab === 'recommendations') {
        const allRecommendations = [...recommendedSongs, ...recommendedFromModal];
        setData(allRecommendations);
        setTotal(allRecommendations.length);
        setPages(Math.ceil(allRecommendations.length / ITEMS_PER_PAGE));
      } else {
        // Load from API for other tabs
        const result = await getLibraryData(libraryActiveTab, libraryCurrentPage, ITEMS_PER_PAGE);
        setData(result.data || []);
        setTotal(result.total || 0);
        setPages(result.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load library data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = (librarySearch || '').toLowerCase();
    if (libraryActiveTab === 'searched' || libraryActiveTab === 'history') {
      return item.query?.toLowerCase().includes(searchLower);
    } else if (libraryActiveTab === 'recommendations') {
      return (
        item.songname?.toLowerCase().includes(searchLower) ||
        item.track_name?.toLowerCase().includes(searchLower) ||
        item.artist?.toLowerCase().includes(searchLower) ||
        item.artist_name?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        item.songName?.toLowerCase().includes(searchLower) ||
        item.artist?.toLowerCase().includes(searchLower)
      );
    }
  });

  const handlePreviousPage = () => {
    if (libraryCurrentPage > 1) dispatch(setLibraryCurrentPage(libraryCurrentPage - 1));
  };

  const handleNextPage = () => {
    if (libraryCurrentPage < pages) dispatch(setLibraryCurrentPage(libraryCurrentPage + 1));
  };

  return (
    <ClickSpark sparkColor='#FF9FFC' sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-background">
          <LiquidEther colors={['#1a1a1a', '#0f0f0f', '#262626']} mouseForce={15} cursorSize={80} autoDemo={true} autoIntensity={1.5} />
        </div>
        <Header />

        <main className="pt-24 pb-12">
          <div className="w-[90%] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h1 className="text-4xl font-display font-bold mb-2">My Library</h1>
                <p className="text-muted-foreground">Your searches, history, and favorite tracks</p>
              </div>

              {/* Search Input */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search library..."
                  value={librarySearch}
                  onChange={(e) => dispatch(setLibrarySearch(e.target.value))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>

              {/* Results Info */}
              <div className="text-xs text-muted-foreground mb-6">
                Showing {filteredData.length} of {total} items
              </div>

              {/* Library Tabs */}
              <Tabs value={libraryActiveTab} onValueChange={(val) => dispatch(setLibraryActiveTab(val as LibraryTab))} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 mb-8">
                  <TabsTrigger value="searched" className="gap-2">
                    <Search className="w-4 h-4" />
                    Searched
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <Clock className="w-4 h-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                {/* Searched Tab */}
                <TabsContent value="searched" className="space-y-4">
                  <div className="glass rounded-2xl p-8 border border-white/5">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <Loader className="w-6 h-6 text-accent animate-spin mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">Loading searches...</p>
                        </motion.div>
                      ) : filteredData.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <p className="text-muted-foreground">No searches yet. Start searching in the Songs page!</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="table"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          {filteredData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{item.query}</p>
                                <p className="text-xs text-muted-foreground">Results: {item.results || 0}</p>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-4">
                  <div className="glass rounded-2xl p-8 border border-white/5">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <Loader className="w-6 h-6 text-accent animate-spin mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">Loading history...</p>
                        </motion.div>
                      ) : filteredData.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <p className="text-muted-foreground">No search history yet.</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="table"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          {filteredData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{item.query}</p>
                                <p className="text-xs text-muted-foreground">Type: {item.type || 'song'}</p>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-4">
                  <div className="glass rounded-2xl p-8 border border-white/5">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <Loader className="w-6 h-6 text-accent animate-spin mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">Loading favorites...</p>
                        </motion.div>
                      ) : filteredData.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <p className="text-muted-foreground">No favorite songs yet. Add some from the Songs page!</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="table"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-2"
                        >
                          {filteredData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Music className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm font-medium text-white">{item.songName}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">by {item.artist} • {item.language || 'Unknown'}</p>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                                <Heart className="w-3 h-3 text-red-400" />
                                {new Date(item.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-4">
                  <div className="glass rounded-2xl p-8 border border-white/5">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <Loader className="w-6 h-6 text-accent animate-spin mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">Loading recommendations...</p>
                        </motion.div>
                      ) : filteredData.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center"
                        >
                          <p className="text-muted-foreground">No recommendations yet. Get recommendations from the Songs page!</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          {filteredData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Music className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{item.songname || item.track_name || item.title}</p>
                                  <p className="text-xs text-muted-foreground truncate">by {item.artist || item.artist_name || 'Unknown'} • {item.language || item.genre || 'Unknown'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                                <Sparkles className="w-3 h-3 text-accent" />
                                {item.emotion || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Pagination */}
              {pages > 1 && (
                <div className="glass rounded-2xl p-6 border border-white/5 flex items-center justify-between mt-8">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === pages}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ClickSpark>
  );
}
