'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar({ onOpenCreateModal }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const syncUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    syncUser();

    window.addEventListener('storage', syncUser);
    window.addEventListener('auth-change', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('auth-change', syncUser);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  if (!mounted || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isLinkActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tight leading-none">
              Event<span className="gradient-text">Pulse</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold leading-tight">
              Tech Event Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800 text-sm font-medium">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isLinkActive('/')
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Explore Events
          </Link>
          <Link
            href="/dashboard"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isLinkActive('/dashboard')
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            My Tickets
          </Link>
          <Link
            href="/saved"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isLinkActive('/saved')
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Saved Events
          </Link>
          <Link
            href="/profile"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isLinkActive('/profile')
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Host Event button */}
              <button
                onClick={onOpenCreateModal}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950"
              >
                <span>+</span> Host Event
              </button>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-1.5 rounded-full hover:border-indigo-500 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-200 pr-2 max-w-[100px] truncate">
                    {user.name || 'User'}
                  </span>
                  <span className="text-slate-400 text-xs pr-1">▾</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-800 mb-1">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      🎟️ My Tickets Dashboard
                    </Link>
                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      ❤️ Saved Events
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      ⚙️ Account Settings
                    </Link>
                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                    >
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="gradient-glow-btn text-xs font-bold text-white px-4 py-2 rounded-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Events
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            My Tickets
          </Link>
          <Link
            href="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Saved Events
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Profile
          </Link>
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCreateModal) onOpenCreateModal();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800"
            >
              + Host New Event
            </button>
          )}
        </div>
      )}
    </header>
  );
}
