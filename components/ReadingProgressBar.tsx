import React, { useEffect, useState } from 'react';

const ReadingProgressBar: React.FC = () => {
  const [width, setWidth] = useState(0);

  const scrollHeight = () => {
    const el = document.documentElement;
    const ScrollTop = el.scrollTop || document.body.scrollTop;
    const ScrollHeight = el.scrollHeight || document.body.scrollHeight;
    const percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100;
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHeight);
    return () => window.removeEventListener('scroll', scrollHeight);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[60] pointer-events-none">
      <div 
        className="h-full bg-brand-600 transition-all duration-150 ease-out" 
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;