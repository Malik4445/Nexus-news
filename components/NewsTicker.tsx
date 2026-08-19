import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, ArrowUpRight, ArrowDownRight, ChevronRight, Zap } from 'lucide-react';
import { Post } from '../types';

interface NewsTickerProps {
  posts?: Post[];
}

interface MarketItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const MARKET_DATA: MarketItem[] = [
  { symbol: 'BTC', price: '$96,480', change: '+2.8%', isPositive: true },
  { symbol: 'ETH', price: '$3,420', change: '+3.4%', isPositive: true },
  { symbol: 'SOL', price: '$218.50', change: '+5.1%', isPositive: true },
  { symbol: 'S&P 500', price: '5,980.2', change: '+0.6%', isPositive: true },
  { symbol: 'NASDAQ', price: '19,140.5', change: '-0.2%', isPositive: false },
  { symbol: 'GOLD', price: '$2,892/oz', change: '+0.4%', isPositive: true },
];

const NewsTicker: React.FC<NewsTickerProps> = ({ posts = [] }) => {
  const [activeHeadlineIndex, setActiveHeadlineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const headlinePosts = posts.length > 0 ? posts.slice(0, 5) : [];

  useEffect(() => {
    if (headlinePosts.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveHeadlineIndex(prev => (prev + 1) % headlinePosts.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [headlinePosts.length, isPaused]);

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 select-none">
      <div className="container mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left: Breaking News Flash */}
        <div 
          className="flex items-center gap-3 min-w-0 flex-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold uppercase tracking-wider text-[10px] flex-shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            <Zap size={11} className="text-rose-400" />
            <span>Live Pulse</span>
          </div>

          {headlinePosts.length > 0 ? (
            <div className="relative overflow-hidden h-6 flex-1 flex items-center">
              {headlinePosts.map((post, idx) => (
                <div
                  key={post.id}
                  className={`absolute inset-0 flex items-center gap-2 transition-all duration-500 ${
                    idx === activeHeadlineIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider hidden sm:inline">
                    [{post.category}]
                  </span>
                  <Link
                    to={`/article/${post.id}`}
                    className="truncate hover:text-brand-400 font-medium text-slate-200 transition-colors flex items-center gap-1"
                  >
                    {post.title}
                    <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 truncate text-[11px]">
              Global markets surge as tech innovation accelerates worldwide.
            </div>
          )}
        </div>

        {/* Right: Live Market Ticker pills */}
        <div className="hidden lg:flex items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0 py-0.5 border-l border-slate-800 pl-4">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
            <TrendingUp size={12} className="text-brand-400" />
            Markets
          </span>
          {MARKET_DATA.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 font-mono text-[11px]"
            >
              <span className="font-semibold text-slate-300">{item.symbol}</span>
              <span className="text-slate-400">{item.price}</span>
              <span className={`flex items-center font-bold text-[10px] ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.isPositive ? (
                  <ArrowUpRight size={11} />
                ) : (
                  <ArrowDownRight size={11} />
                )}
                {item.change}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NewsTicker;
