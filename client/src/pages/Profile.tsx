import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { User, Music, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiquidEther from "@/components/animations/LiquidEther";
import { auth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { UserActivityLogs } from "@/components/profile/UserActivityLogs";
import ClickSpark from "@/components/animations/ClickSpark";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser as setReduxUser } from "@/store/slices/authSlice";
import { getProfileStats } from "@/lib/api";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [userName, setUserName] = useState(user?.name || 'Music Lover');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/auth");
    } else {
      setUserName(user.name);
      fetchStats();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchStats = async () => {
    try {
      const data = await getProfileStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load profile stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (newName: string) => {
    try {
      if (!user) return;
      await auth.updateProfile(newName);
      setUserName(newName);
      dispatch(setReduxUser({ ...user, name: newName }));
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ClickSpark sparkColor='#FF9FFC' sparkSize={12} sparkRadius={20} sparkCount={8} duration={500}>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-background">
          <LiquidEther colors={['#1a1a1a', '#0f0f0f', '#262626']} mouseForce={15} cursorSize={80} autoDemo={true} autoIntensity={1.5} />
        </div>
        <Header />
        <main className="pt-24 pb-12">
          <div className="w-[90%] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 shadow-elegant mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-6 rounded-full bg-gradient-accent shadow-float">
                    <User className="w-16 h-16 text-primary-foreground" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-display font-bold mb-2">{userName}</h1>
                    <p className="text-muted-foreground mb-1">{user.email}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {user.role === 'admin' ? 'Platform Administrator' : 'Music Enthusiast'} • Member since Nov 2024
                    </p>
                    <Button onClick={() => setEditDialogOpen(true)} className="rounded-full bg-gradient-accent text-primary-foreground shadow-float hover:shadow-elegant hover:scale-105 transition-smooth">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Songs Discovered */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="glass rounded-2xl p-6 shadow-float text-center hover:border-accent/40 transition-smooth">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-accent shadow-float mb-3">
                    <Music className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stats?.songsDiscovered || 0}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Discovered</p>
                </motion.div>

                {/* Favorites */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="glass rounded-2xl p-6 shadow-float text-center hover:border-accent/40 transition-smooth">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-accent shadow-float mb-3">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stats?.favoritesCount || 0}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Favorites</p>
                </motion.div>

                {/* Listening Time */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="glass rounded-2xl p-6 shadow-float text-center hover:border-accent/40 transition-smooth">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-accent shadow-float mb-3">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stats?.listeningTimeHours || '0.0'}h</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Listen Time</p>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="glass rounded-2xl p-8 shadow-elegant">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <Music className="w-6 h-6 text-accent" />
                  Activity Logs
                </h2>
                <UserActivityLogs />
              </motion.div>
            </motion.div>
          </div>
        </main>
        <Footer />
        <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} currentEmail={user.email} currentName={userName} onSave={handleSaveProfile} />
      </div>
    </ClickSpark>
  );
};
;

export default Profile;
