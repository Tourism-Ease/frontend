import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { X, Plane, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../hooks/useAuth";
import AuthModal from "../../../features/user/auth/components/AuthModal";

const navLinks = [
  { name: "Trips", path: "/trips" },
  { name: "About", path: "/about" },
  { name: "Packages", path: "/Packages" },
  { name: "Contact", path: "/contact" },
];

export default function UserNavbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [authOpen, setAuthOpen] = useState(false); // <- using combined modal

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
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll back
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

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md",
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
                isTransparent ? "text-white" : "text-primary"
              )}
            />
            <span
              className={cn(
                "text-xl font-bold",
                isTransparent ? "text-white" : "text-gray-800"
              )}
            >
              TourEase
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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user.avatarUrl ? (
                    /* === REAL PROFILE IMAGE === */
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="
              w-10 h-10 rounded-full object-cover cursor-pointer
              border-2 border-gray-300 hover:border-blue-500
              transition-all duration-200 select-none shrink-0
            "
                    />
                  ) : (
                    /* === FALLBACK WITH INITIALS === */
                    <div
                      className="
              w-10 h-10 rounded-full cursor-pointer shrink-0
              bg-gray-300 text-gray-700
              flex items-center justify-center
              text-sm font-bold uppercase
              border-2 border-gray-300 hover:border-blue-500
              transition-all duration-200
            "
                    >
                      {user.firstName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="
          w-48 bg-white dark:bg-gray-800 shadow-md rounded-md 
          border border-gray-200 dark:border-gray-700 p-2
          animate-in fade-in-0 zoom-in-95
          animate-out fade-out-0 zoom-out-95
        "
                >
                  <DropdownMenuLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-2 py-1">
                    {user.firstName} {user.lastName}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="cursor-pointer" size="sm" onClick={() => setAuthOpen(true)}>
                Login
              </Button>
            )}
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
              {/* Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-2.5 right-18 z-50 p-2 cursor-pointer"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>

              {/* Menu Card */}
              <motion.div
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-xl shadow-xl p-4 flex flex-col space-y-3"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "w-full text-center py-3 rounded-lg text-lg font-medium transition-all border",
                      location.pathname === link.path
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
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

      {/* Top-level Auth Modal */}
      <AuthModal isOpen={authOpen} setIsOpen={setAuthOpen} />
    </>
  );
}
