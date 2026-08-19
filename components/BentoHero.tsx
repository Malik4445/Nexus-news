import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Clock, TrendingUp, Sparkles, Bookmark, ArrowRight, Flame } from 'lucide-react';
import { getCategoryTheme } from '../utils/categoryThemes';
import { useBookmarks } from '../context/BookmarkContext';

interface BentoHeroProps {
  posts: Post[];
}

const calculateReadingTime = (text: string = '') => {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const BentoHero: React.FC<BentoHeroProps> = ({ posts }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  if (!posts || posts.length === 0) return null;

  const leadStory = posts[0];
  const secondaryStories = posts.slice(1, 3);
  const trendingList = posts.slice(3, 7);

  const leadTheme = getCategoryTheme(leadStory.category);
  const leadSaved = isBookmarked(leadStory.id);

  return (
    <section className="mb-14">
      {/* Editorial Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-brand-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 dark:text-white">
            Editorial Showcase
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Curated for you
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lead Spotlight Story (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="group relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl h-full flex flex-col justify-end min-h-[460px] md:min-h-[520px]">
            <img
              src={leadStory.imageUrl}
              alt={leadStory.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            {/* Dramatic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Top controls */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md ${leadTheme.badgeBg}`}>
                <span className={`h-2 w-2 rounded-full ${leadTheme.dotColor}`} />
                {leadStory.category}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(leadStory);
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${
                  leadSaved
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'bg-black/40 hover:bg-black/70 text-white'
                }`}
                title={leadSaved ? "Saved" : "Save article"}
              >
                <Bookmark size={18} className={leadSaved ? "fill-white" : ""} />
              </button>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                  Lead Story
                </span>
                <span className="text-slate-300 text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {calculateReadingTime(leadStory.body)}
                </span>
              </div>

              <Link to={`/article/${leadStory.id}`}>
                <h2 className="font-serif font-black text-2xl md:text-4xl lg:text-5xl leading-tight mb-4 text-white group-hover:text-brand-300 transition-colors">
                  {leadStory.title}
                </h2>
              </Link>

              <p className="text-slate-300 text-sm md:text-base line-clamp-2 mb-6 font-light leading-relaxed max-w-2xl">
                {leadStory.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-300">
                <span className="font-medium">By {leadStory.author}</span>
                <Link
                  to={`/article/${leadStory.id}`}
                  className="inline-flex items-center gap-2 font-bold text-brand-300 hover:text-white transition-colors"
                >
                  Read Full Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Secondary Spotlight & Trending Rail (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Secondary Story Cards */}
          {secondaryStories.map((secStory) => {
            const secTheme = getCategoryTheme(secStory.category);
            const isSaved = isBookmarked(secStory.id);

            return (
              <div
                key={secStory.id}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5"
              >
                <div className="relative w-full sm:w-44 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={secStory.imageUrl}
                    alt={secStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${secTheme.badgeBg}`}>
                      {secStory.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 font-medium text-[11px]">
                        <Clock size={12} />
                        {calculateReadingTime(secStory.body)}
                      </span>
                      <button
                        onClick={() => toggleBookmark(secStory)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                        }`}
                      >
                        <Bookmark size={15} className={isSaved ? "fill-brand-600" : ""} />
                      </button>
                    </div>

                    <Link to={`/article/${secStory.id}`}>
                      <h3 className="font-serif font-bold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug mb-2">
                        {secStory.title}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {secStory.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{secStory.author}</span>
                    <Link
                      to={`/article/${secStory.id}`}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1"
                    >
                      Read <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Trending Hot Headlines mini box if available */}
          {trendingList.length > 0 && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-rose-500 fill-rose-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                    Most Read Today
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">LIVE RANKING</span>
              </div>

              <div className="space-y-3.5">
                {trendingList.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id}
                    to={`/article/${item.id}`}
                    className="group flex items-start gap-3.5 hover:bg-slate-800/60 p-2 rounded-xl transition-colors"
                  >
                    <span className="font-serif font-black text-xl text-brand-500 w-6 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-xs md:text-sm text-slate-200 group-hover:text-brand-300 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {item.category} • {calculateReadingTime(item.body)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default BentoHero;
