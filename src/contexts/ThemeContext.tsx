import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{
    id: Theme;
    name: string;
    description: string;
    primary: string;
    accent: string;
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  // Core Themes
  {
    id: 'light' as Theme,
    name: 'Light',
    description: 'Clean and bright workspace',
    primary: '#2563eb',
    accent: '#f59e0b',
    category: 'core',
  },
  {
    id: 'dark' as Theme,
    name: 'Dark',
    description: 'Easy on the eyes',
    primary: '#3b82f6',
    accent: '#f59e0b',
    category: 'core',
  },
  
  // Nature Themes
  {
    id: 'ocean' as Theme,
    name: 'Ocean Depths',
    description: 'Deep blue professional theme',
    primary: '#3b82f6',
    accent: '#1e40af',
    category: 'nature',
  },
  {
    id: 'forest' as Theme,
    name: 'Emerald Forest',
    description: 'Natural and calming green vibes',
    primary: '#10b981',
    accent: '#059669',
    category: 'nature',
  },
  {
    id: 'desert' as Theme,
    name: 'Golden Desert',
    description: 'Warm sandy tones and sunset colors',
    primary: '#f59e0b',
    accent: '#dc2626',
    category: 'nature',
  },
  {
    id: 'arctic' as Theme,
    name: 'Arctic Breeze',
    description: 'Cool, crisp and refreshing',
    primary: '#06b6d4',
    accent: '#0ea5e9',
    category: 'nature',
  },
  {
    id: 'volcanic' as Theme,
    name: 'Volcanic Fire',
    description: 'Intense heat and molten energy',
    primary: '#dc2626',
    accent: '#f59e0b',
    category: 'nature',
  },
  
  // Cosmic & Fantasy
  {
    id: 'purple' as Theme,
    name: 'Mystic Purple',
    description: 'Creative and magical',
    primary: '#8b5cf6',
    accent: '#7c3aed',
    category: 'cosmic',
  },
  {
    id: 'cosmic' as Theme,
    name: 'Cosmic Galaxy',
    description: 'Journey through the stars',
    primary: '#7c3aed',
    accent: '#06b6d4',
    category: 'cosmic',
  },
  {
    id: 'butterfly' as Theme,
    name: 'Butterfly Garden',
    description: 'Delicate and colorful',
    primary: '#f59e0b',
    accent: '#ec4899',
    category: 'cosmic',
  },
  
  // Seasonal Themes
  {
    id: 'spring' as Theme,
    name: 'Cherry Blossom',
    description: 'Fresh blooms and new beginnings',
    primary: '#ec4899',
    accent: '#fbbf24',
    category: 'seasonal',
  },
  {
    id: 'winter' as Theme,
    name: 'Winter Wonderland',
    description: 'Crisp snow and icy blues',
    primary: '#0284c7',
    accent: '#7dd3fc',
    category: 'seasonal',
  },
  
  // Festive Themes
  {
    id: 'halloween' as Theme,
    name: 'Halloween Spook 🎃',
    description: 'Spooky orange and black vibes',
    primary: '#ff6b35',
    accent: '#ff9800',
    category: 'festive',
  },
  {
    id: 'christmas' as Theme,
    name: 'Christmas Joy 🎄',
    description: 'Festive red and green celebration',
    primary: '#dc2626',
    accent: '#fbbf24',
    category: 'festive',
  },
  {
    id: 'diwali' as Theme,
    name: 'Diwali Lights 🪔',
    description: 'Golden celebration of lights',
    primary: '#ffd700',
    accent: '#ff6b35',
    category: 'festive',
  },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('honourus-theme');
      return (stored as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'ocean', 'purple', 'forest', 'halloween', 'christmas', 'diwali', 'winter', 'spring', 'desert', 'cosmic', 'arctic', 'volcanic', 'butterfly');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Debug log
    console.log('🎨 Theme applied:', theme);
    console.log('📋 HTML classes:', root.className);
    
    // Save to localStorage
    localStorage.setItem('honourus-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}