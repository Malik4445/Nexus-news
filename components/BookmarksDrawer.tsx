import React from 'react';
import { Link } from 'react-router-dom';
import { X, Bookmark, Trash2, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { getCategoryTheme } from '../utils/categoryThemes';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({ isOpen, onClose }) => {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Bookmark size={20} className="fill-brand-600 dark:fill-brand-400" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-white">Reading List</h2>
              <p className="text-xs text-slate-500 font-medium">
                {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={clearBookmarks}
                title="Clear all bookmarks"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <BookOpen size={28} />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                No saved articles yet
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Click the bookmark ribbon on any story card or article header to save it for reading later.
              </p>
            </div>
          ) : (
            bookmarks.map(post => {
              const theme = getCategoryTheme(post.category);
              return (
                <div
                  key={post.id}
                  className="group relative bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all flex gap-4"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                          {post.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeBookmark(post.id);
                          }}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove from saved"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Link
                        to={`/article/${post.id}`}
                        onClick={onClose}
                        className="block font-serif font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <Link
                        to={`/article/${post.id}`}
                        onClick={onClose}
                        className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 hover:underline text-[12px]"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center text-xs text-slate-500">
            Articles are securely saved in your browser storage.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksDrawer;
