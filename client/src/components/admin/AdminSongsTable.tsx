//region imports
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { getSongs, deleteSong } from "@/lib/api";
import { toast } from "react-toastify";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AdminTableHeader } from "@/components/admin/AdminTableHeader";
import { AdminTableRow } from "@/components/admin/AdminTableRow";
//endregion

//region component
/**
 * Admin Songs Table component for managing songs
 * @returns {JSX.Element} AdminSongsTable component
 */
export function AdminSongsTable() {
  //region state
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  //endregion

  //region effects
  useEffect(() => {
    fetchSongs();
  }, [page, search]);
  //endregion

  //region handlers
  /**
   * Fetch songs from API with pagination and search
   */
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await getSongs(page, 10, search);
      setSongs(res.data);
      setTotalPages(Math.ceil(res.total / 10));
    } catch (err) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete button click
   * @param {string} id - Song ID to delete
   */
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  /**
   * Confirm and execute song deletion
   */
  const confirmDelete = async () => {
    try {
      await deleteSong(deleteId);
      toast.success("Song deleted successfully");
      setIsDeleteOpen(false);
      fetchSongs();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };
  //endregion

  //region render
  return (
    <>
      <div className="glass rounded-2xl p-8 border border-white/5">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-accent/50 text-white placeholder:text-white/30 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                <p className="text-muted-foreground text-sm">Loading songs...</p>
              </motion.div>
            ) : songs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <p className="text-muted-foreground">No songs found.</p>
              </motion.div>
            ) : (
              <motion.table
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-left"
              >
                <AdminTableHeader columns={["Song", "Artist", "Language", "Actions"]} />
                <tbody>
                  {songs.map((song, idx) => (
                    <AdminTableRow key={song._id} index={idx}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                            <img
                              src={song.album_image || song.image || 'https://via.placeholder.com/100'}
                              alt={song.songname}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{song.songname || song.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{song.genre || 'General'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-white">{song.artist}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                          {song.language}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteClick(song._id)}
                          className="p-2 text-white/40 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </AdminTableRow>
                  ))}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-mono text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 text-white/50 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={isDeleteOpen}
        title="Delete Song"
        description="Are you sure you want to delete this song? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
  //endregion
}
//endregion
