export interface CategoryTheme {
  name: string;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  hoverBorder: string;
  dotColor: string;
  gradient: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  Crypto: {
    name: 'Crypto',
    label: 'Crypto Assets',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderAccent: 'border-amber-500/40',
    hoverBorder: 'hover:border-amber-500/50',
    dotColor: 'bg-amber-500',
    gradient: 'from-amber-500/20 to-transparent'
  },
  Technology: {
    name: 'Technology',
    label: 'Future Tech',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-500/40',
    hoverBorder: 'hover:border-indigo-500/50',
    dotColor: 'bg-indigo-500',
    gradient: 'from-indigo-500/20 to-transparent'
  },
  Politics: {
    name: 'Politics',
    label: 'Global Affairs',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    badgeText: 'text-rose-600 dark:text-rose-400',
    borderAccent: 'border-rose-500/40',
    hoverBorder: 'hover:border-rose-500/50',
    dotColor: 'bg-rose-500',
    gradient: 'from-rose-500/20 to-transparent'
  },
  Business: {
    name: 'Business',
    label: 'Markets & Finance',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-500/40',
    hoverBorder: 'hover:border-emerald-500/50',
    dotColor: 'bg-emerald-500',
    gradient: 'from-emerald-500/20 to-transparent'
  },
  Lifestyle: {
    name: 'Lifestyle',
    label: 'Modern Living',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderAccent: 'border-purple-500/40',
    hoverBorder: 'hover:border-purple-500/50',
    dotColor: 'bg-purple-500',
    gradient: 'from-purple-500/20 to-transparent'
  }
};

export const getCategoryTheme = (category?: string): CategoryTheme => {
  if (!category) return CATEGORY_THEMES['Technology'];
  const match = Object.keys(CATEGORY_THEMES).find(
    k => k.toLowerCase() === category.trim().toLowerCase()
  );
  return match ? CATEGORY_THEMES[match] : CATEGORY_THEMES['Technology'];
};
