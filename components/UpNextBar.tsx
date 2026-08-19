import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronUp, X, Sparkles } from 'lucide-react';
import { Post } from '../types';
import { getCategoryTheme } from '../utils/categoryThemes';

interface UpNextBarProps {
  nextPost?: Post;
}

const UpNextBar: React.FC<UpNextBarProps> = ({ nextPost }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!nextPost) return;

    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = scrollTotal > 0 ? (currentScroll / scrollTotal) * 100 : 0;

      // Show when scrolled past 65% of the article
      if (progress > 60 && !isDismissed) {
        setIsVisible(true);
      } else if (progress <= 50 && !isDismissed) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPost, isDismissed]);

  if (!nextPost || isDismissed || !isVisible) return null;

  const theme = getCategoryTheme(nextPost.category);

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-lg z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
        
        {/* Thumbnail */}
        <img
          src={nextPost.imageUrl}
          alt={nextPost.title}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">
              Up Next
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
              {nextPost.category}
            </span>
          </div>

          <Link
            to={`/article/${nextPost.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="block font-serif font-bold text-xs md:text-sm text-slate-100 hover:text-brand-300 transition-colors line-clamp-1"
          >
            {nextPost.title}
          </Link>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/article/${nextPost.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
          >
            Read <ArrowRight size={14} />
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpNextBar;
