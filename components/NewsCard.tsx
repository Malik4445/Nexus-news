import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Clock, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { getCategoryTheme } from '../utils/categoryThemes';
import { useBookmarks } from '../context/BookmarkContext';

interface NewsCardProps {
  post: Post;
  featured?: boolean;
  searchQuery?: string;
}

const HighlightedText: React.FC<{ text: string; highlight?: string }> = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const terms = highlight.split(/\s+/).filter(t => t.length > 0).map(escapeRegExp);
  if (terms.length === 0) return <>{text}</>;
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-slate-900 dark:text-yellow-200 rounded-sm px-0.5 mx-0.5 font-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const calculateReadingTime = (text: string = '') => {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
};

const NewsCard: React.FC<NewsCardProps> = ({ post, featured = false, searchQuery = '' }) => {
  const theme = getCategoryTheme(post.category);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(post.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(post);
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col ${theme.hoverBorder} ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <Link to={`/article/${post.id}`} className="block relative overflow-hidden flex-shrink-0">
        <div className={`relative overflow-hidden ${featured ? 'h-72 md:h-96' : 'h-52 md:h-48'}`}>
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          {/* Category Chip */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${theme.badgeBg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dotColor}`} />
              <HighlightedText text={post.category} highlight={searchQuery} />
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            aria-label={saved ? "Remove from bookmarks" : "Save article"}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
              saved 
                ? 'bg-brand-600 text-white shadow-lg scale-105' 
                : 'bg-black/40 hover:bg-black/70 text-white/90 hover:text-white'
            }`}
          >
            <Bookmark size={16} className={saved ? "fill-white" : ""} />
          </button>

          {/* AI Badge if summarized */}
          {post.aiSummary && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
              <Sparkles size={11} className="text-amber-400" />
              <span>AI Digest Ready</span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col justify-between p-6 flex-grow">
        <div>
          <Link to={`/article/${post.id}`} className="block group/title">
            <h3 className={`font-serif font-black leading-snug mb-3 group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-[1.25rem] text-slate-900 dark:text-white'}`}>
              <HighlightedText text={post.title} highlight={searchQuery} />
            </h3>
          </Link>

          <p className={`line-clamp-2 text-sm md:text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 mb-4`}>
            <HighlightedText text={post.excerpt} highlight={searchQuery} />
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 text-xs">
          <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-brand-500" />
              {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            <span>•</span>
            <span>{calculateReadingTime(post.body)}</span>
          </div>

          <Link
            to={`/article/${post.id}`}
            aria-label={`Read article: ${post.title}`}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
