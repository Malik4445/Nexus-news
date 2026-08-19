export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  body: string;
  author: string;
  timestamp: number;
  aiSummary?: string;
}

// Added AdUnitProps interface to resolve type errors in AdUnit.tsx
export interface AdUnitProps {
  slotId: string;
  type: 'anchor' | 'leaderboard' | 'in-feed' | 'sidebar';
  className?: string;
}