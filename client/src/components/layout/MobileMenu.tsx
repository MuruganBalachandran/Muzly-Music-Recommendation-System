//region imports
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NavLink } from '@/components/layout/NavLink';
//endregion

//region interfaces
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userRole?: string;
  onLogout: () => void;
}
//endregion

//region component
/**
 * Mobile navigation menu with slide-in animation
 * Displays navigation links and auth actions
 */
export function MobileMenu({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  userRole,
  onLogout 
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-card border-l border-border z-50 md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col p-4 space-y-2">
              <NavLink
                to="/"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                activeClassName="text-foreground bg-white/10 font-semibold"
              >
                Home
              </NavLink>
              <NavLink
                to="/songs"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                activeClassName="text-foreground bg-white/10 font-semibold"
              >
                Songs
              </NavLink>
              <NavLink
                to="/library"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                activeClassName="text-foreground bg-white/10 font-semibold"
              >
                Library
              </NavLink>
              <NavLink
                to="/about"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                activeClassName="text-foreground bg-white/10 font-semibold"
              >
                About
              </NavLink>
              <NavLink
                to="/profile"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                activeClassName="text-foreground bg-white/10 font-semibold"
              >
                Profile
              </NavLink>

              {/* Admin Link */}
              {userRole === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-accent hover:bg-accent/10 transition-all border border-accent/30"
                  activeClassName="bg-accent/20 border-accent/50 font-semibold"
                >
                  Admin Dashboard
                </NavLink>
              )}
            </nav>

            {/* Auth Actions */}
            <div className="p-4 border-t border-border mt-auto">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={onClose}
                  className="block w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white text-center rounded-xl font-semibold transition-all"
                >
                  Login
                </NavLink>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
//endregion
