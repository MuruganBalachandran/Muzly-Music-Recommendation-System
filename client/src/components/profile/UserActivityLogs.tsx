//region imports
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Calendar, Loader, Search, ChevronLeft, ChevronRight, Lock, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/store/hooks";
//endregion

//region constants
const API_BASE = import.meta.env.VITE_NODE_API_BASE || 'http://127.0.0.1:5000/api/v1';
const ITEMS_PER_PAGE = 10;
//endregion

//region interfaces
interface AuthActivity {
  _id: string;
  action: string;
  userEmail: string;
  ipAddress: string;
  status: string;
  createdAt: string;
}

interface SongActivity {
  _id: string;
  action: string;
  songName: string;
  artist: string;
  userEmail: string;
  ipAddress: string;
  status: string;
  createdAt: string;
}

interface SystemActivity {
  _id: string;
  action: string;
  resource: string;
  userEmail: string;
  ipAddress: string;
  status: string;
  createdAt: string;
}

interface PaginationData<T> {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

type ActivityTab = 'auth' | 'songs' | 'system';
//endregion

//region component
export function UserActivityLogs() {
  //region state
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  
  const [authLogs, setAuthLogs] = useState<AuthActivity[]>([]);
  const [songLogs, setSongLogs] = useState<SongActivity[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemActivity[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [authTotal, setAuthTotal] = useState(0);
  const [authPages, setAuthPages] = useState(1);
  const [songTotal, setSongTotal] = useState(0);
  const [songPages, setSongPages] = useState(1);
  const [systemTotal, setSystemTotal] = useState(0);
  const [systemPages, setSystemPages] = useState(1);
  
  const [activeTab, setActiveTab] = useState<ActivityTab>('auth');
  //endregion

  //region effects
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchActivities();
  }, [search, currentPage, activeTab]);
  //endregion

  //region handlers
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search })
      });

      // Use different endpoint based on user role
      const endpoint = isAdmin 
        ? `${API_BASE}/activity/all/${activeTab}?${params}`
        : `${API_BASE}/activity/me/${activeTab}?${params}`;
      
      console.log('🔍 [UserActivityLogs] Fetching from:', endpoint);
      console.log('🔍 [UserActivityLogs] Is Admin:', isAdmin);
      console.log('🔍 [UserActivityLogs] Active Tab:', activeTab);
      console.log('🔍 [UserActivityLogs] Current Page:', currentPage);
      
      const response = await fetch(endpoint, { credentials: 'include' });
      console.log('🔍 [UserActivityLogs] Response Status:', response.status);
      
      const data = await response.json();
      console.log('🔍 [UserActivityLogs] Response Data:', data);

      if (data.success && data.data) {
        const paginationData = data.data as PaginationData<any>;
        console.log('🔍 [UserActivityLogs] Pagination Data:', paginationData);
        
        switch (activeTab) {
          case 'auth':
            console.log('🔍 [UserActivityLogs] Setting auth logs:', paginationData.data?.length);
            setAuthLogs(paginationData.data || []);
            setAuthTotal(paginationData.total || 0);
            setAuthPages(paginationData.pages || 1);
            break;
          case 'songs':
            console.log('🔍 [UserActivityLogs] Setting song logs:', paginationData.data?.length);
            setSongLogs(paginationData.data || []);
            setSongTotal(paginationData.total || 0);
            setSongPages(paginationData.pages || 1);
            break;
          case 'system':
            console.log('🔍 [UserActivityLogs] Setting system logs:', paginationData.data?.length);
            setSystemLogs(paginationData.data || []);
            setSystemTotal(paginationData.total || 0);
            setSystemPages(paginationData.pages || 1);
            break;
        }
      } else {
        console.error('🔍 [UserActivityLogs] Response not successful:', data);
      }
    } catch (err) {
      console.error("🔍 [UserActivityLogs] Failed to load activities", err);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, activeTab, isAdmin]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    const maxPages = activeTab === 'auth' ? authPages : activeTab === 'songs' ? songPages : systemPages;
    if (currentPage < maxPages) setCurrentPage(currentPage + 1);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'auth':
        return { logs: authLogs, total: authTotal, pages: authPages };
      case 'songs':
        return { logs: songLogs, total: songTotal, pages: songPages };
      case 'system':
        return { logs: systemLogs, total: systemTotal, pages: systemPages };
      default:
        return { logs: [], total: 0, pages: 1 };
    }
  };

  const { logs, total, pages } = getCurrentData();
  //endregion

  //region render
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
        />
      </div>

      {/* Results Info */}
      <div className="text-xs text-muted-foreground">
        Showing {logs.length} of {total} activities
      </div>

      {/* Activity Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as ActivityTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
          <TabsTrigger value="auth" className="gap-2">
            <Lock className="w-4 h-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="songs" className="gap-2">
            <Music className="w-4 h-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Globe className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Auth Activities Tab */}
        <TabsContent value="auth" className="space-y-4">
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
                  <p className="text-muted-foreground text-sm">Loading activities...</p>
                </motion.div>
              ) : authLogs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <p className="text-muted-foreground">No auth activities recorded yet.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {authLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{log.action}</p>
                        <p className="text-xs text-muted-foreground">IP: {log.ipAddress}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                          log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.status}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Song Activities Tab */}
        <TabsContent value="songs" className="space-y-4">
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
                  <p className="text-muted-foreground text-sm">Loading activities...</p>
                </motion.div>
              ) : songLogs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <p className="text-muted-foreground">No song activities recorded yet.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {songLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-white">{log.songName}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">by {log.artist} • {log.action}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                          log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.status}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* System Activities Tab */}
        <TabsContent value="system" className="space-y-4">
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
                  <p className="text-muted-foreground text-sm">Loading activities...</p>
                </motion.div>
              ) : systemLogs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <p className="text-muted-foreground">No system activities recorded yet.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {systemLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{log.action}</p>
                        <p className="text-xs text-muted-foreground">Resource: {log.resource}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                          log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.status}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
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
        <div className="glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
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
    </div>
  );
  //endregion
}
//endregion
