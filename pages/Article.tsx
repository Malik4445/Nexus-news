import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, ChevronRight, Hash, Sparkles, Loader2, Bookmark, ArrowUpRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Post } from '../types';
import { getPostById, getPosts, updatePostSummary } from '../services/supabase';
import { useSearch } from '../context/SearchContext';
import { useBookmarks } from '../context/BookmarkContext';
import { getCategoryTheme } from '../utils/categoryThemes';
import ShareDrawer from '../components/ShareDrawer';
import ReaderControls, { CanvasTheme, FontSize } from '../components/ReaderControls';
import UpNextBar from '../components/UpNextBar';

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  // Reader customizations
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('default');
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  const { setSearchQuery } = useSearch();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();

  const CATEGORIES = [
    { name: 'Crypto', label: 'Crypto Assets' },
    { name: 'Technology', label: 'Future Tech' },
    { name: 'Politics', label: 'Global Affairs' },
    { name: 'Lifestyle', label: 'Modern Living' },
    { name: 'Business', label: 'Markets & Finance' }
  ];

  useEffect(() => {
    const fetchData = async (idVal: string) => {
      setLoading(true);
      try {
        const currentPost = await getPostById(idVal);
        const allPosts = await getPosts();
        setPost(currentPost);
        setTrendingPosts(allPosts.filter(p => p.id !== idVal).slice(0, 4));
        
        if (currentPost?.aiSummary) {
          setSummary(currentPost.aiSummary);
        } else {
          setSummary(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
    return `${minutes} min read`;
  };

  const handleGenerateSummary = async () => {
    if (!post || isSummarizing) return;
    
    if (post.aiSummary) {
      setSummary(post.aiSummary);
      return;
    }

    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a punchy 3-bullet point summary of this news article for a "TL;DR" section. Article title: ${post.title}. Content: ${post.body.substring(0, 4000)}`,
        config: { 
          systemInstruction: "You are an Executive Editor. Provide a high-fidelity 3-bullet point summary. Focus on impact and facts.",
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      const generatedSummary = response.text || "Summary unavailable.";
      setSummary(generatedSummary);
      await updatePostSummary(post.id, generatedSummary);
      
    } catch (error) {
      console.error("AI Error:", error);
      setSummary("Could not generate summary at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSearchQuery(cat);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      <div className="w-12 h-12 border-[4px] border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-serif font-black mb-3 text-slate-900 dark:text-white">Article Not Found</h1>
      <p className="text-slate-500 mb-6">The story you requested may have been archived or moved.</p>
      <Link to="/" className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-500 transition-colors">
        Return to Home
      </Link>
    </div>
  );

  const theme = getCategoryTheme(post.category);
  const nextRecommended = trendingPosts.length > 0 ? trendingPosts[0] : undefined;

  // Custom typography styles based on user toolbar selection
  const fontClass = 
    fontSize === 'xlarge' ? 'text-[22px] md:text-[25px] leading-[1.8]' :
    fontSize === 'large' ? 'text-[20px] md:text-[22px] leading-[1.7]' :
    'text-[18px] md:text-[20px] leading-[1.65]';

  // Canvas theme wrapper classes
  const canvasClass = 
    canvasTheme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] transition-colors duration-300' :
    canvasTheme === 'oled' ? 'bg-black text-slate-200 transition-colors duration-300' :
    'bg-white dark:bg-slate-900 transition-colors duration-300';

  const bodyTextColor =
    canvasTheme === 'sepia' ? 'text-[#362712]' :
    canvasTheme === 'oled' ? 'text-slate-200' :
    'text-slate-800 dark:text-slate-200';

  return (
    <div className={`min-h-screen pb-20 md:pb-12 ${canvasClass}`}>
      <div className="container mx-auto px-4 py-6 md:py-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center min-h-[44px] text-sm font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Headlines
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <article className="lg:col-span-8">
            
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest ${theme.badgeBg}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${theme.dotColor}`} />
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(post.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <h1 className="text-2xl md:text-5xl lg:text-5xl font-serif font-black text-slate-900 dark:text-white leading-[1.15] mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between border-y border-slate-200 dark:border-slate-800 py-4 gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center font-bold text-sm text-slate-800 dark:text-slate-200">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2.5 text-brand-600 font-semibold text-xs border border-slate-200 dark:border-slate-700">
                      <User size={16} />
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <Clock size={14} className="mr-1.5 text-brand-500" />
                    {calculateReadingTime(post.body)}
                  </div>
                </div>
              </div>
            </header>

            {/* Reader Controls Toolbar (Sepia / Font / Audio / Save / Share) */}
            <ReaderControls
              post={post}
              canvasTheme={canvasTheme}
              setCanvasTheme={setCanvasTheme}
              fontSize={fontSize}
              setFontSize={setFontSize}
              onOpenShare={() => setIsShareOpen(true)}
            />

            {/* Featured Hero Photo */}
            <div className="mb-10 relative">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto aspect-video object-cover rounded-3xl shadow-xl"
              />
              
              {/* AI Key Insights Box */}
              <div className="mt-6 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                    <Sparkles size={18} />
                    <span className="font-black text-xs uppercase tracking-widest">
                      Nexus Intelligence Digest
                    </span>
                  </div>
                  {!summary && (
                    <button 
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      {isSummarizing ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        'Generate AI TL;DR'
                      )}
                    </button>
                  )}
                </div>
                
                {summary ? (
                  <div className="text-sm md:text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed space-y-2">
                    {summary.split('\n').filter(l => l.trim()).map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <p>{line.replace(/^[•*-]\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Press "Generate AI TL;DR" to produce an executive instant bullet breakdown powered by Gemini.
                  </p>
                )}
              </div>
            </div>

            {/* Article Body */}
            <div className={`font-serif ${fontClass} ${bodyTextColor} space-y-6`}>
              {post.body.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Article Footer & Tags */}
            <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Tags:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.badgeBg}`}>
                  #{post.category}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  #GlobalNews
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleBookmark(post)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    isBookmarked(post.id)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Bookmark size={14} className={isBookmarked(post.id) ? "fill-white" : ""} />
                  {isBookmarked(post.id) ? "Bookmarked" : "Save Article"}
                </button>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-sm"
                >
                  <Share2 size={14} />
                  Share Story
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-28 space-y-8">
              
              {/* The Hot List */}
              <div className="bg-slate-900 dark:bg-slate-800/90 text-white p-7 rounded-3xl shadow-xl border border-slate-800">
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-800">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h3 className="font-serif font-black text-xl uppercase tracking-tighter">
                    Trending Stories
                  </h3>
                </div>
                <div className="space-y-6">
                  {trendingPosts.map((tPost) => {
                    const tTheme = getCategoryTheme(tPost.category);
                    return (
                      <Link key={tPost.id} to={`/article/${tPost.id}`} className="group block">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${tTheme.badgeBg}`}>
                          {tPost.category}
                        </span>
                        <h4 className="text-sm font-bold leading-snug group-hover:text-brand-400 transition-colors mt-2">
                          {tPost.title}
                        </h4>
                        <div className="flex items-center mt-2.5 text-[11px] font-bold text-slate-400 group-hover:translate-x-1 transition-transform">
                          <span>Read Story</span> <ChevronRight size={13} className="ml-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Topics Nav */}
              <div className="bg-white dark:bg-slate-800/50 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Explore Topics
                </h3>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.name} 
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex items-center justify-between py-3 px-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-all group border-b border-slate-100 dark:border-slate-800 last:border-0 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Hash size={14} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                        <span className="text-sm font-bold">{cat.label}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Up Next Bar */}
      <UpNextBar nextPost={nextRecommended} />

      {/* Share Drawer */}
      <ShareDrawer 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        title={post?.title || ''} 
        url={window.location.href} 
      />
    </div>
  );
};

export default Article;
