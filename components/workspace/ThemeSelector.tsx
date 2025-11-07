import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Palette, Sparkles, Leaf, Rocket, Calendar, PartyPopper } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Theme } from '../../types';

const categoryIcons = {
  core: Palette,
  nature: Leaf,
  cosmic: Rocket,
  seasonal: Calendar,
  festive: PartyPopper,
};

const categoryLabels = {
  core: 'Core Themes',
  nature: 'Nature Collection',
  cosmic: 'Cosmic & Fantasy',
  seasonal: 'Seasonal Vibes',
  festive: 'Festive Celebrations',
};

const ThemePreview = ({ theme, isSelected, onClick }: {
  theme: any;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary border-primary shadow-lg' 
          : 'hover:shadow-lg border-border'
      }`}>
        {/* Theme Preview Colors */}
        <div className="h-16 flex">
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.primary }}
          />
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.accent }}
          />
        </div>
        
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{theme.name}</h4>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-5 w-5 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-3 w-3 text-primary-foreground" />
              </motion.div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {theme.description}
          </p>
          
          {theme.category === 'festive' && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              Special
            </Badge>
          )}
        </CardContent>

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && !isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-background/90 px-3 py-1 rounded-full text-sm font-medium"
              >
                Select Theme
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export function ThemeSelector() {
  const { theme: currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Group themes by category
  const groupedThemes = themes.reduce((acc, theme) => {
    const category = (theme as any).category || 'core';
    if (!acc[category]) acc[category] = [];
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, any[]>);

  const handleThemeSelect = (themeId: Theme) => {
    setTheme(themeId);
    // Add a slight delay before closing for visual feedback
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Themes
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose Your Theme
          </DialogTitle>
          <DialogDescription>
            Personalize your Honourus workspace with vibrant themes
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto space-y-6 max-h-[60vh] pr-2">
          {Object.entries(groupedThemes).map(([category, categoryThemes]) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(groupedThemes).indexOf(category) * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <Badge variant="outline" className="ml-2">
                    {categoryThemes.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryThemes.map((theme) => (
                    <ThemePreview
                      key={theme.id}
                      theme={theme}
                      isSelected={currentTheme === theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                    />
                  ))}
                </div>
                
                {category !== 'festive' && <Separator className="mt-6" />}
              </motion.div>
            );
          })}
          
          {/* Special Festive Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Festive Collection</span>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                Limited Time
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Celebrate the seasons with our special festive themes! Perfect for holidays and special occasions.
            </p>
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Current: <span className="font-medium capitalize">{currentTheme}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}