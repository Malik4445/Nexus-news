import React from 'react';
import { X, Twitter, Facebook, Link as LinkIcon, MessageCircle } from 'lucide-react';

interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const ShareDrawer: React.FC<ShareDrawerProps> = ({ isOpen, onClose, title, url }) => {
  if (!isOpen) return null;

  const shareLinks = [
    { icon: <Twitter size={20} />, label: 'Twitter', color: 'bg-[#1DA1F2]', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`) },
    { icon: <Facebook size={20} />, label: 'Facebook', color: 'bg-[#1877F2]', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
    { icon: <MessageCircle size={20} />, label: 'WhatsApp', color: 'bg-[#25D366]', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`) },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 z-[80] rounded-t-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold dark:text-white">Share Story</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full dark:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-10">
          {shareLinks.map((link, idx) => (
            <button key={idx} onClick={link.action} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl ${link.color} text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform`}>
                {link.icon}
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{link.label}</span>
            </button>
          ))}
          <button onClick={copyLink} className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <LinkIcon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Copy</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareDrawer;