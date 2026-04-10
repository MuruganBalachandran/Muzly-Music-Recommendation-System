import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { GetRecommendations } from "@/components/common/GetRecommendations";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Footer } from "@/components/layout/Footer";
import LiquidEther from "@/components/animations/LiquidEther";
import ChromaGrid from "@/components/animations/ChromaGrid";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import ClickSpark from "@/components/animations/ClickSpark";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSong } from "@/store/slices/playerSlice";
import { setRecommendedSongs, setModalAnalysis } from "@/store/slices/uiSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<Record<string, any> | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePlay = (song: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to play songs');
      navigate('/auth');
      return;
    }

    const title = (song['songname'] || song['track_name'] || song['title']) as string | undefined;
    const artist = (song['artist'] || song['artist_name']) as string | undefined;
    
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
    
    dispatch(setSong({ song: playerSong, queue: recommended as any }));
    toast.success(`Now playing: ${title || 'Unknown'} by ${artist || 'Unknown'}`);
  };

  const chromaItems = recommended.slice(0, 10).map((song, i) => ({
    image: song.album_image || song.image || 'https://via.placeholder.com/400',
    title: song.songname || song.title || song.track_name || 'Unknown',
    subtitle: `${song.artist || song.artist_name || song.artistName || 'Unknown'} • ${song.language || song.genre || '-'}`,
    artist: song.artist || song.artist_name || song.artistName || 'Unknown',
    language: song.language || song.genre || '-',
    handle: song.duration || song.length || '-',
    borderColor: song.borderColor || ['#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444','#4F46E5'][i % 6],
    gradient: song.gradient || 'linear-gradient(145deg, #8B5CF6, #000)',
    onPlay: () => handlePlay(song)
  }));

  return (
    <ClickSpark sparkColor='#FF9FFC' sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10">
          <LiquidEther colors={['#1a1a1a', '#0f0f0f', '#262626']} mouseForce={15} cursorSize={80} autoDemo={true} autoSpeed={0.3} autoIntensity={1.5} />
        </div>
        <Header />
        <main>
          <Hero />
          
          <GetRecommendations onRecommend={(payload) => {
            if (!isAuthenticated) {
              toast.error("Please login to get recommendations");
              navigate('/auth');
              return;
            }
            if (!payload) {
              setRecommended([]);
              setAnalysisData(null);
              return;
            }
            if (Array.isArray(payload)) {
              setRecommended(payload);
              setAnalysisData(null);
              return;
            }
            const p = payload as Record<string, any>;
            if (p.recommendations) {
              setRecommended(p.recommendations);
              setAnalysisData(p); // Store full payload with analysis
            } else if (p instanceof Object && p.length) {
              setRecommended(p as any[]);
              setAnalysisData(null);
            } else {
              setRecommended([]);
              setAnalysisData(p);
            }
          }} />
          
          {recommended.length > 0 && (
            <section className="relative py-20 bg-background">
              <div className="w-[90%] mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
                    Recommended <span className="text-white">Songs</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover tracks curated just for you based on your unique taste
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <ChromaGrid items={chromaItems} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" columns={5} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 text-center">
                  <button
                    onClick={() => {
                      // Store recommendations and analysis in Redux and sessionStorage for persistence
                      dispatch(setRecommendedSongs(recommended));
                      if (analysisData) {
                        dispatch(setModalAnalysis(analysisData));
                      }
                      sessionStorage.setItem('recommendedSongs', JSON.stringify(recommended));
                      if (analysisData) {
                        sessionStorage.setItem('recommendedAnalysis', JSON.stringify(analysisData));
                      }
                      navigate('/songs?recommended=true');
                    }}
                    className="text-accent hover:text-accent/80 font-semibold text-lg transition-colors underline decoration-accent/30 hover:decoration-accent"
                  >
                    Suggest More →
                  </button>
                </motion.div>
              </div>
            </section>
          )}

          <div className="relative bg-background">
            <Features />
            <HowItWorks />
          </div>
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Home;
