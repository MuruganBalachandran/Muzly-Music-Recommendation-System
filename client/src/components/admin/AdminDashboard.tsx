//region imports
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Music, Globe, TrendingUp } from "lucide-react";
import LiquidEther from "@/components/animations/LiquidEther";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminActivityTable } from "@/components/admin/AdminActivityTable";
import { AdminSongsTable } from "@/components/admin/AdminSongsTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { getAdminStats } from "@/lib/api";
//endregion

//region interfaces
interface DashboardStats {
  totalSongs: number;
  totalUsers: number;
  totalArtists: number;
  totalLanguages: number;
  recentActivity: number;
}

type DashboardTab = "overview" | "songs" | "users" | "activity";
//endregion

//region component
/**
 * Admin Dashboard component with tabs for overview, songs, users, and activity
 * @returns {JSX.Element} AdminDashboard component
 */
export default function AdminDashboard() {
  //region state
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalSongs: 0,
    totalUsers: 0,
    totalArtists: 0,
    totalLanguages: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  //endregion

  //region effects
  useEffect(() => {
    fetchStats();
  }, []);
  //endregion

  //region handlers
  /**
   * Fetch dashboard statistics from API
   */
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };
  //endregion

  //region render
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-background">
        <LiquidEther colors={['#1a1a1a', '#0a0a0a', '#222']} autoDemo autoIntensity={1.2} />
      </div>
      <Header />

      <main className="pt-24 pb-20">
        <div className="w-[90%] mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-accent" />
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Monitor platform metrics and manage content.</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "songs", label: "Songs", icon: Music },
                { id: "users", label: "Users", icon: Users },
                { id: "activity", label: "Activity", icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as DashboardTab)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-accent text-white shadow-lg'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminStatCard
                    title="Total Songs"
                    value={stats.totalSongs}
                    icon={Music}
                    color="from-blue-500/20 to-blue-600/20"
                    loading={loading}
                  />
                  <AdminStatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="from-purple-500/20 to-purple-600/20"
                    loading={loading}
                  />
                  <AdminStatCard
                    title="Total Artists"
                    value={stats.totalArtists}
                    icon={Music}
                    color="from-pink-500/20 to-pink-600/20"
                    loading={loading}
                  />
                  <AdminStatCard
                    title="Languages"
                    value={stats.totalLanguages}
                    icon={Globe}
                    color="from-green-500/20 to-green-600/20"
                    loading={loading}
                  />
                </div>

                {/* Recent Activity Preview */}
                <div className="glass rounded-2xl p-8 border border-white/5">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recent Activity
                  </h2>
                  <AdminActivityTable limit={5} />
                </div>
              </motion.div>
            )}

            {activeTab === "songs" && (
              <motion.div
                key="songs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdminSongsTable />
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdminUsersTable />
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AdminActivityTable />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
  //endregion
}
//endregion
