import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X, Bookmark } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useBookmarks } from '../context/BookmarkContext';
import ReadingProgressBar from './ReadingProgressBar';
import BookmarksDrawer from './BookmarksDrawer';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  
  const { searchQuery, setSearchQuery } = useSearch();
  const { bookmarkCount } = useBookmarks();
  const navigate = useNavigate();

  // Unified Categories list
  const CATEGORIES = ['Crypto', 'Technology', 'Politics', 'Business', 'Lifestyle'];

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate('/');
      setIsSearchOpen(false); 
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSearchQuery(cat);
    navigate('/');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ReadingProgressBar />
      
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group" 
              onClick={() => setSearchQuery('')}
            >
              <div className="h-9 w-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-serif text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Nexus<span className="text-brand-600">News</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
              <Link 
                to="/" 
                onClick={() => setSearchQuery('')} 
                className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                All Stories
              </Link>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => handleCategoryClick(cat)} 
                  className={`px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${
                    searchQuery.toLowerCase() === cat.toLowerCase() ? 'bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400 font-bold' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Search Toggle */}
              <button 
                onClick={toggleSearch}
                className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                aria-label="Search"
                title="Search stories"
              >
                <Search size={19} />
              </button>

              {/* Bookmarks Drawer Trigger */}
              <button
                onClick={() => setIsBookmarksOpen(true)}
                className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                aria-label="Reading list"
                title="Saved Articles"
              >
                <Bookmark size={19} className={bookmarkCount > 0 ? "fill-brand-600 text-brand-600 dark:fill-brand-400 dark:text-brand-400" : ""} />
                {bookmarkCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-brand-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-in zoom-in">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                aria-label="Toggle Dark Mode"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                aria-label="Open menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar Flyout */}
        {isSearchOpen && (
          <div className="px-4 pb-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
            <div className="container mx-auto max-w-3xl pt-2">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search articles by title, category, or keyword..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bookmarks Drawer Modal */}
      <BookmarksDrawer 
        isOpen={isBookmarksOpen} 
        onClose={() => setIsBookmarksOpen(false)} 
      />

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 pt-20 px-6 md:hidden animate-in fade-in">
          <nav className="flex flex-col gap-1 mt-6">
            <Link 
              to="/" 
              onClick={() => { setSearchQuery(''); setIsMenuOpen(false); }} 
              className="text-xl font-serif font-bold text-slate-900 dark:text-white py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <span>All Stories</span>
            </Link>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => handleCategoryClick(cat)} 
                className="text-left text-xl font-serif font-bold text-slate-900 dark:text-white py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <span>{cat}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
