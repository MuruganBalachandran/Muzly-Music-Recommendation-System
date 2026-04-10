//region imports
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, Mail, Calendar } from "lucide-react";
import { AdminTableHeader } from "@/components/admin/AdminTableHeader";
import { AdminTableRow } from "@/components/admin/AdminTableRow";
import { getAdminUsers } from "@/lib/api";
//endregion

//region interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}
//endregion

//region component
/**
 * Admin Users Table component for viewing and managing users
 * @returns {JSX.Element} AdminUsersTable component
 */
export function AdminUsersTable() {
  //region state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  //endregion

  //region effects
  useEffect(() => {
    fetchUsers();
  }, [search]);
  //endregion

  //region handlers
  /**
   * Fetch users from API with optional search filter
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers(search);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get badge color based on user role
   * @param {string} role - User role
   * @returns {string} Tailwind CSS classes for badge styling
   */
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'user':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };
  //endregion

  //region render
  return (
    <div className="glass rounded-2xl p-8 border border-white/5">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <p className="text-muted-foreground text-sm">Loading users...</p>
            </motion.div>
          ) : users.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <p className="text-muted-foreground">No users found.</p>
            </motion.div>
          ) : (
            <motion.table
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-left"
            >
              <AdminTableHeader columns={["Name", "Email", "Role", "Joined"]} />
              <tbody>
                {users.map((user, idx) => (
                  <AdminTableRow key={user._id} index={idx}>
                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{user.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </AdminTableRow>
                ))}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
  //endregion
}
//endregion
