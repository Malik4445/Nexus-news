import React, { useState } from 'react';
import { Type, Moon, Sun, Coffee, Bookmark, Share2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Post } from '../types';
import { useBookmarks } from '../context/BookmarkContext';

export type CanvasTheme = 'default' | 'sepia' | 'oled';
export type FontSize = 'normal' | 'large' | 'xlarge';

interface ReaderControlsProps {
  post: Post;
  canvasTheme: CanvasTheme;
  setCanvasTheme: (theme: CanvasTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  onOpenShare: () => void;
}

const ReaderControls: React.FC<ReaderControlsProps> = ({
  post,
  canvasTheme,
  setCanvasTheme,
  fontSize,
  setFontSize,
  onOpenShare,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(post.id);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${post.title}. ${post.body}`);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 md:p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      {/* Left: Reading Canvas Presets */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
          Theme:
        </span>
        <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setCanvasTheme('default')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              canvasTheme === 'default'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Clean Light / System"
          >
            Clean
          </button>
          <button
            onClick={() => setCanvasTheme('sepia')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              canvasTheme === 'sepia'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-amber-800 dark:text-amber-300 hover:opacity-80'
            }`}
            title="Warm Sepia Newsprint"
          >
            <Coffee size={13} />
            Sepia
          </button>
          <button
            onClick={() => setCanvasTheme('oled')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              canvasTheme === 'oled'
                ? 'bg-black text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
            title="OLED Pure Dark"
          >
            <Moon size={13} />
            OLED
          </button>
        </div>
      </div>

      {/* Middle: Font Size Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
          Text Size:
        </span>
        <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              fontSize === 'normal'
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all ${
              fontSize === 'large'
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-2.5 py-1 rounded-lg text-base font-bold transition-all ${
              fontSize === 'xlarge'
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            A++
          </button>
        </div>
      </div>

      {/* Right: Audio Listen + Save + Share */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isPlayingAudio
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isPlayingAudio ? "Stop reading" : "Listen to article audio"}
        >
          {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} className="text-brand-500" />}
          <span>{isPlayingAudio ? "Listening..." : "Listen"}</span>
        </button>

        <button
          onClick={() => toggleBookmark(post)}
          className={`p-2 rounded-xl border transition-all ${
            saved
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-600'
          }`}
          title={saved ? "Remove from saved" : "Save for later"}
        >
          <Bookmark size={16} className={saved ? "fill-white" : ""} />
        </button>

        <button
          onClick={onOpenShare}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-all"
          title="Share article"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReaderControls;
