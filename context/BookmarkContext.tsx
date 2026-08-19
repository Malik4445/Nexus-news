import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post } from '../types';

interface BookmarkContextType {
  bookmarks: Post[];
  isBookmarked: (postId: string) => boolean;
  toggleBookmark: (post: Post) => void;
  removeBookmark: (postId: string) => void;
  clearBookmarks: () => void;
  bookmarkCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = 'nexus_news_saved_articles_v1';

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load bookmarks', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarks]);

  const isBookmarked = (postId: string) => {
    return bookmarks.some(b => b.id === postId);
  };

  const toggleBookmark = (post: Post) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === post.id)) {
        return prev.filter(b => b.id !== post.id);
      } else {
        return [post, ...prev];
      }
    });
  };

  const removeBookmark = (postId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== postId));
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      clearBookmarks,
      bookmarkCount: bookmarks.length
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
