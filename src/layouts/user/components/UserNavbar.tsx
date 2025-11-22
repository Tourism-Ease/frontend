// src/layouts/user/components/UserNavbar.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { X, Plane, User, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import AuthModal from "../../../features/user/auth/components/AuthModal";

const navLinks = [
  { name: "Trips", path: "/trips" },
  { name: "Packages", path: "/packages" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    openAuthModal,
    authModal,
    closeAuthModal,
  } = useAuth(); // Add authModal and closeAuthModal
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  // const [authOpen, setAuthOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setIsTransparent(window.scrollY < 100);
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsTransparent(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileOpen &&
        menuRef.current &&
        toggleRef.current &&
        !menuRef.current.contains(target) &&
        !toggleRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleLoginClick = () => {
    openAuthModal("login");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleImageLoad = (userId: string) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: true }));
  };

  const handleImageError = (userId: string) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: false }));
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user) return "US";
    return (
      `${user.firstName?.charAt(0) || ""}${
        user.lastName?.charAt(0) || ""
      }`.toUpperCase() || "US"
    );
  };

  // Get user full name for display
  const getUserFullName = () => {
    if (!user) return "User";
    return `${user.firstName} ${user.lastName}`;
  };

  // Check if user has avatar and it's loaded
  const hasAvatar = user?.avatarUrl && imageLoaded[user.id] !== false;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-white border-b border-gray-200 shadow-sm"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Plane
              className={cn(
                "h-6 w-6",
                isTransparent ? "text-white" : "text-gray-800"
              )}
            />
            <span
              className={cn(
                "text-xl font-extrabold uppercase tracking-widest",
                isTransparent ? "text-white" : "text-gray-800"
              )}
            >
              safarny
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-[#00B6DE] text-white shadow-sm"
                    : isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              // Show loading state while checking auth
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span
                  className={cn(
                    "text-sm",
                    isTransparent ? "text-white" : "text-gray-600"
                  )}
                >
                  Loading...
                </span>
              </div>
            ) : isAuthenticated && user ? (
              // User is authenticated - show profile dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full cursor-pointer p-0 overflow-hidden"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Spinner size="sm" />
                      </div>
                    ) : hasAvatar ? (
                      /* User has profile image - show it directly */
                      <img
                        src={user.avatarUrl}
                        alt={getUserFullName()}
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-all duration-200"
                        onLoad={() => handleImageLoad(user.id)}
                        onError={() => handleImageError(user.id)}
                      />
                    ) : (
                      /* Fallback to initials - FIXED: changed bg-linear-to-br to bg-gradient-to-br */
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase border-2 border-blue-400">
                        {getUserInitials()}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-48 bg-white shadow-md rounded-md border border-gray-200 p-2 animate-in fade-in-0 zoom-in-95"
                >
                  <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-2 py-1">
                    {user.firstName} {user.lastName}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                className=" bg-[#00B6DE] text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}

            {/* Mobile menu toggle with animation */}
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              className={`md:hidden cursor-pointer ${
                isTransparent ? "text-white" : "text-gray-800"
              } ${mobileOpen ? "hidden" : ""}`}
              onClick={() => setMobileOpen(true)}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Bottom Search */}
        <div
          className={cn(
            "w-full border-t transition-all duration-300",
            isTransparent
              ? "bg-transparent border-transparent"
              : "bg-gray-50 border-gray-200"
          )}
        ></div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)} // close when clicking outside
            >
              {/* Close Button - FIXED: changed right-18 to right-4 and text color */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-2.5 right-6 z-50 p-2 cursor-pointer"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Menu Card */}
              <motion.div
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 w-[80%] bg-white rounded-xl shadow-xl p-4 flex flex-col space-y-3"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "w-full text-center py-3 rounded-lg text-lg font-medium transition-all border",
                      location.pathname === link.path
                        ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-white text-gray-800 border-0 hover:bg-gray-100"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Top-level Auth Modal - FIXED: using authModal from context instead of local state */}
      <AuthModal
        isOpen={authModal.isOpen}
        setIsOpen={(open) => !open && closeAuthModal()}
      />
    </>
  );
}
