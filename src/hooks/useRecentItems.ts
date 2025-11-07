import { useState, useEffect, useCallback } from 'react';

interface RecentItem {
  id: string;
  type: 'view' | 'task' | 'team' | 'user';
  name: string;
  timestamp: number;
  metadata?: any;
}

const MAX_RECENT_ITEMS = 10;
const STORAGE_KEY = 'honourus_recent_items';

export function useRecentItems() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        setRecentItems(items);
      }
    } catch (error) {
      console.error('Error loading recent items:', error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentItems));
    } catch (error) {
      console.error('Error saving recent items:', error);
    }
  }, [recentItems]);

  const addRecentItem = useCallback((item: Omit<RecentItem, 'timestamp'>) => {
    setRecentItems(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(i => !(i.type === item.type && i.id === item.id));
      
      // Add new item at the beginning
      const newItems = [
        { ...item, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_ITEMS);

      return newItems;
    });
  }, []);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getRecentByType = useCallback((type: RecentItem['type']) => {
    return recentItems.filter(item => item.type === type);
  }, [recentItems]);

  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
    getRecentByType,
  };
}
