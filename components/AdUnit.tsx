import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { AdUnitProps } from '../types';

const AdUnit: React.FC<AdUnitProps> = ({ slotId, type, className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  if (type === 'anchor') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pointer-events-none">
        <div className="container mx-auto max-w-4xl pointer-events-auto">
          <div className="relative group bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all z-10 shadow-lg"
              aria-label="Close Ad"
            >
              <X size={14} />
            </button>
            <div className="flex items-center justify-between px-6 py-3 min-h-[60px] md:min-h-[80px]">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.2em] mb-1">Sponsored</span>
                <div className="h-[2px] w-8 bg-brand-600/30 rounded-full"></div>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-col items-center opacity-40">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Anchor Unit</span>
                  <span className="text-[8px] font-mono text-slate-500">{slotId}</span>
                </div>
              </div>
              <div className="hidden md:block w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const baseStyles = "relative flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-3xl transition-all duration-300 overflow-hidden group hover:border-brand-500/30";
  
  let dimensionStyles = "";
  let label = "Advertisement";
  let subLabel = "Standard Placement";

  if (type === 'leaderboard') {
    dimensionStyles = "w-full h-[60px] md:h-[90px] mb-6";
    label = "Leaderboard Display";
    subLabel = "728 x 90 Standard";
  } else if (type === 'in-feed') {
    dimensionStyles = "w-full h-full min-h-[320px]";
    label = "Native In-Feed";
    subLabel = "Dynamic Content Unit";
  } else if (type === 'sidebar') {
    // Reduced from 600px to 450px for better viewport balance
    dimensionStyles = "w-full h-[300px] md:h-[450px]";
    label = "Premium Sidebar";
    subLabel = "300 x 450 Display";
  }

  return (
    <div className={`${className} my-4`}>
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
          Sponsored Content <Info size={10} className="opacity-50" />
        </span>
      </div>
      <div id={slotId} className={`${baseStyles} ${dimensionStyles}`}>
        {/* Decorative pattern for a "real" ad feel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
          <svg width="100%" height="100%">
            <pattern id={`pattern-${slotId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="currentColor" strokeWidth="1" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#pattern-${slotId})`} />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2 text-center px-6 relative z-10">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity">
            <Info size={20} />
          </div>
          <div className="opacity-40 group-hover:opacity-80 transition-opacity">
            <span className="block text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{label}</span>
            <span className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 italic mb-2">{subLabel}</span>
            <div className="h-[1px] w-8 bg-slate-300 dark:bg-slate-600 mx-auto"></div>
            <span className="block text-[8px] text-slate-400 dark:text-slate-600 font-mono mt-2 tracking-tighter">{slotId}</span>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        <div className="absolute top-4 right-4 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default AdUnit;