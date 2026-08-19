import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import BentoHero from '../components/BentoHero';
import NewsTicker from '../components/NewsTicker';
import { Post } from '../types';
import { getPosts } from '../services/supabase';
import { useSearch } from '../context/SearchContext';
import { getCategoryTheme } from '../utils/categoryThemes';
import { TrendingUp, Sparkles, Filter, Newspaper, Layers, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Crypto', 'Technology', 'Politics', 'Business', 'Lifestyle'];

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { searchQuery, setSearchQuery } = useSearch();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter based on search query or category pill
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category.toLowerCase() === activeCategory.toLowerCase();

    if (!searchQuery.trim()) {
      return matchesCategory;
    }

    const searchableText = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
    const matchesSearch = searchQuery.toLowerCase().split(/\s+/).every(term => searchableText.includes(term));

    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      
      {/* Live Market & Breaking News Ticker */}
      <NewsTicker posts={posts} />

      <div className="container mx-auto px-4 py-6 md:py-10">
        
        {/* Magazine Masthead / Title banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-brand-600 animate-ping" />
              <span className="text-brand-600 dark:text-brand-400 font-black tracking-[0.3em] text-[10px] uppercase">
                Nexus Global Wire
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-serif font-black text-slate-900 dark:text-white leading-[1.1]">
              {searchQuery ? `Search: "${searchQuery}"` : "The Daily Pulse"}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-left md:text-right">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                Worldwide Dispatch
              </span>
              <span className="text-sm md:text-base font-serif font-bold text-slate-700 dark:text-slate-300">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5 flex-shrink-0">
            <Filter size={13} />
            Topics:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            const theme = cat !== 'All' ? getCategoryTheme(cat) : null;

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {theme && (
                  <span className={`h-2 w-2 rounded-full ${theme.dotColor}`} />
                )}
                <span>{cat}</span>
                {cat !== 'All' && (
                  <span className="text-[10px] opacity-70">
                    ({posts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading state skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="md:col-span-2 md:row-span-2 h-[420px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Show Bento Hero for default view (when not searching and category is All) */}
            {!searchQuery && activeCategory === 'All' && filteredPosts.length >= 3 && (
              <BentoHero posts={filteredPosts} />
            )}

            {/* Stories Grid */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-brand-600 dark:text-brand-400" />
                <h2 className="text-xl md:text-2xl font-serif font-black text-slate-900 dark:text-white">
                  {!searchQuery && activeCategory === 'All' ? 'Latest Dispatches' : `${activeCategory} Stories`}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {/* When Bento Hero is active, slice from index 3 so stories don't duplicate */}
                {(!searchQuery && activeCategory === 'All' && filteredPosts.length >= 3
                  ? filteredPosts.slice(3)
                  : filteredPosts
                ).map((post) => (
                  <NewsCard key={post.id} post={post} searchQuery={searchQuery} />
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">
                    No Stories Found
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    Try adjusting your search terms or selecting another category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                    className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>

                {posts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <TrendingUp className="text-brand-500" size={24} />
                      <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                        Recommended Reading
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                      {posts.slice(0, 6).map((post) => (
                        <NewsCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
