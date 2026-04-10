//region imports
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/button";
import { Music, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useState } from "react";
import { toast } from "react-toastify";
//endregion

//region component
/**
 * Application header with navigation and authentication
 * Includes mobile-responsive hamburger menu
 */
export const Header = () => {
  //region state
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //endregion

  //region handlers
  const handleAuth = () => {
    if (isAuthenticated) {
      setIsLogoutOpen(true);
    } else {
      navigate("/auth");
    }
  };

  const confirmLogout = async () => {
    setIsLogoutOpen(false);
    await auth.signOut();
    dispatch(clearUser());
    toast.success("Logged out successfully");
    navigate("/auth");
  };
  //endregion

  //region render
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-elegant">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-accent shadow-float transition-smooth group-hover:scale-110 group-hover:glow-accent">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-foreground">
                Muzly.AI
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <NavLink
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  activeClassName="text-foreground font-semibold"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/songs"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  activeClassName="text-foreground font-semibold"
                >
                  Songs
                </NavLink>
                <NavLink
                  to="/library"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  activeClassName="text-foreground font-semibold"
                >
                  Library
                </NavLink>
                <NavLink
                  to="/about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  activeClassName="text-foreground font-semibold"
                >
                  About
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  activeClassName="text-foreground font-semibold"
                >
                  Profile
                </NavLink>

                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="text-xs font-semibold text-accent hover:text-accent transition-smooth border border-accent/30 px-4 py-1.5 rounded-xl bg-accent/10"
                    activeClassName="text-white bg-accent/20 border-accent/50"
                  >
                    Admin
                  </NavLink>
                )}
              </nav>

              <Button
                onClick={handleAuth}
                className="rounded-full px-6 py-2 shadow-float transition-smooth hover:shadow-elegant hover:scale-105 bg-red-600 hover:bg-red-700 text-white font-medium border-0"
              >
                {isAuthenticated ? "Logout" : "Login"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        onLogout={() => setIsLogoutOpen(true)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={isLogoutOpen}
        title="Logout"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </>
  );
  //endregion
};
//endregion
