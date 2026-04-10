//region imports
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Calendar, Loader, Search, ChevronLeft, ChevronRight, Lock, Globe } from "lucide-react";
import { AdminTableHeader } from "@/components/admin/AdminTableHeader";
import { AdminTableRow } from "@/components/admin/AdminTableRow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface AdminActivityTableProps {
  limit?: number;
}

type ActivityTab = 'auth' | 'songs' | 'system';
//endregion

//region component
export function AdminActivityTable({ limit }: AdminActivityTableProps) {
  //region state
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

      const endpoint = `${API_BASE}/admin/activities/${activeTab}?${params}`;
      console.log('🔍 [AdminActivityTable] Fetching from:', endpoint);
      console.log('🔍 [AdminActivityTable] Active Tab:', activeTab);
      
      const response = await fetch(endpoint, { credentials: 'include' });
      console.log('🔍 [AdminActivityTable] Response Status:', response.status);
      
      const data = await response.json();
      console.log('🔍 [AdminActivityTable] Response Data:', data);

      if (data.success && data.data) {
        const paginationData = data.data as PaginationData<any>;
        console.log('🔍 [AdminActivityTable] Pagination Data:', paginationData);
        
        switch (activeTab) {
          case 'auth':
            console.log('🔍 [AdminActivityTable] Setting auth logs:', paginationData.data?.length);
            setAuthLogs(paginationData.data || []);
            setAuthTotal(paginationData.total || 0);
            setAuthPages(paginationData.pages || 1);
            break;
          case 'songs':
            console.log('🔍 [AdminActivityTable] Setting song logs:', paginationData.data?.length);
            setSongLogs(paginationData.data || []);
            setSongTotal(paginationData.total || 0);
            setSongPages(paginationData.pages || 1);
            break;
          case 'system':
            console.log('🔍 [AdminActivityTable] Setting system logs:', paginationData.data?.length);
            setSystemLogs(paginationData.data || []);
            setSystemTotal(paginationData.total || 0);
            setSystemPages(paginationData.pages || 1);
            break;
        }
      } else {
        console.error('🔍 [AdminActivityTable] Response not successful:', data);
      }
    } catch (err) {
      console.error("🔍 [AdminActivityTable] Failed to load activities", err);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, activeTab]);

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
          placeholder="Search by email, action, or details..."
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
          <div className="glass rounded-2xl p-8 border border-white/5 overflow-x-auto">
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
                <motion.table
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left"
                >
                  <AdminTableHeader columns={["Email", "Action", "Status", "IP Address", "Date"]} />
                  <tbody>
                    {authLogs.map((log, idx) => (
                      <AdminTableRow key={log._id} index={idx}>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{log.userEmail}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                            log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            log.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Song Activities Tab */}
        <TabsContent value="songs" className="space-y-4">
          <div className="glass rounded-2xl p-8 border border-white/5 overflow-x-auto">
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
                <motion.table
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left"
                >
                  <AdminTableHeader columns={["Email", "Song", "Artist", "Action", "Status", "IP Address", "Date"]} />
                  <tbody>
                    {songLogs.map((log, idx) => (
                      <AdminTableRow key={log._id} index={idx}>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{log.userEmail}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{log.songName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground">{log.artist}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                            log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            log.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* System Activities Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="glass rounded-2xl p-8 border border-white/5 overflow-x-auto">
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
                <motion.table
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left"
                >
                  <AdminTableHeader columns={["Email", "Action", "Resource", "Status", "IP Address", "Date"]} />
                  <tbody>
                    {systemLogs.map((log, idx) => (
                      <AdminTableRow key={log._id} index={idx}>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{log.userEmail}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground">{log.resource}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                            log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            log.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </motion.table>
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
