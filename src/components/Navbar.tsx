import React, { useState } from 'react';
import { Building2, User, LogOut, ChevronDown, LayoutDashboard, Sparkles } from 'lucide-react';
import { AuthUser } from './LoginModal';

interface NavbarProps {
  activeView: 'home' | 'properties' | 'about' | 'contact' | 'admin';
  onChangeView: (view: 'home' | 'properties' | 'about' | 'contact' | 'admin') => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onChangeView,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => onChangeView('home')}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-neutral-950 font-sans whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-serif text-sm shadow-xs group-hover:bg-neutral-800 transition-colors">
              H
            </div>
            <span className="tracking-tight text-neutral-950 text-xl font-bold">homesprit</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onChangeView('home')}
              className={`hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'home'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1 -mb-1'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onChangeView('properties')}
              className={`hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'properties'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1 -mb-1'
                  : ''
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => onChangeView('about')}
              className={`hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'about'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1 -mb-1'
                  : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => onChangeView('contact')}
              className={`hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'contact'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-1 -mb-1'
                  : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions & User Authentication */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Primary Consultation Action */}
            <button
              onClick={() => onChangeView('contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span>Private Advisory</span>
            </button>

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold text-neutral-950 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono capitalize">
                      {currentUser.role.toLowerCase()}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <div className="font-bold text-neutral-950">{currentUser.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{currentUser.email}</div>
                    </div>

                    {(currentUser.role === 'ADMIN' || currentUser.role === 'AGENT') && (
                      <button
                        onClick={() => {
                          onChangeView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onChangeView('properties');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Browse Properties</span>
                    </button>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
