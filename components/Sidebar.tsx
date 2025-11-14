"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  Shirt,
  Settings,
  Banknote,
  Boxes,
  LogOut,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Admin");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Get admin name from localStorage
    const name = localStorage.getItem("adminName") || "Admin";
    setAdminName(name);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('aside') && !target.closest('[data-mobile-menu-button]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("adminName");
    
    // Redirect to login
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Users", icon: Users, href: "/users" },
    { name: "Designs", icon: Shirt, href: "/designs" },
    { name: "Orders", icon: Banknote, href: "/orders" },
    { name: "Inventory", icon: Boxes, href: "/inventory" }
  ];

  // Delay rendering until mounted to avoid hydration mismatches
  // Also check for login page AFTER mount to avoid pathname hydration issues
  // Placeholder must match EXACTLY the full render's wrapper structure
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50 relative" suppressHydrationWarning>
        <div className="flex-1 w-full lg:w-auto p-4 lg:p-6 overflow-y-auto">{children}</div>
      </div>
    );
  }

  // Hide sidebar on login page (check after mount to avoid hydration mismatch)
  if (pathname === "/login") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 relative" suppressHydrationWarning>
        {/* Mobile Menu Button */}
        <button
          type="button"
          data-mobile-menu-button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-yellow-300 rounded-lg shadow-lg hover:bg-yellow-400 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Desktop */}
        <aside
          className={`${
            isOpen ? "w-64" : "w-20"
          } hidden lg:flex bg-yellow-300 text-black flex-col transition-all`}
        >
          <div className="flex items-center justify-between p-4 font-bold text-xl group">
            {isOpen ? (
              <img src="images/logo1.png" width={100} alt="Hive 3D Logo" />
            ) : (
              <img src="images/logo1.png" width={50} alt="Hive 3D Logo" />
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded hover:bg-yellow-400 ml-[16px]"
              aria-label="Toggle sidebar"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          </div>
          <nav className="flex-1 px-2 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map(({ name, icon: Icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                      pathname === href
                        ? "bg-yellow-400 font-semibold"
                        : "hover:bg-yellow-300"
                    }`}
                  >
                    <Icon size={20} />
                    {isOpen && <span>{name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Admin Info and Logout at the bottom */}
          <div className="border-t border-yellow-400/50 p-4 mt-auto">
            {isOpen ? (
              <>
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Logged in as</p>
                  <p className="font-semibold text-sm text-black truncate">
                    {adminName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center rounded-lg px-3 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </aside>

        {/* Sidebar - Mobile (Overlay) */}
        <aside
          className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-yellow-300 text-black flex flex-col transition-transform duration-300 z-50 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 font-bold text-xl border-b border-yellow-400/50">
            <img src="images/logo1.png" width={100} alt="Hive 3D Logo" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-yellow-400"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-2 overflow-y-auto py-4">
            <ul className="space-y-2">
              {navItems.map(({ name, icon: Icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                      pathname === href
                        ? "bg-yellow-400 font-semibold"
                        : "hover:bg-yellow-300"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Admin Info and Logout at the bottom */}
          <div className="border-t border-yellow-400/50 p-4">
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Logged in as</p>
              <p className="font-semibold text-sm text-black truncate">
                {adminName}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
