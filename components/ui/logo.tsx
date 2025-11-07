import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/006f800231c09fc27cdf6be476b7c9ba0b815b75.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white';
}

export function Logo({ size = 'md', showText = true, className = '', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl', 
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const isWhite = variant === 'white';
  const logoClasses = isWhite ? 'brightness-0 invert' : '';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ImageWithFallback 
        src={logoImage} 
        alt="Honourus Logo" 
        className={`${sizeClasses[size]} object-contain ${logoClasses}`}
      />
      {showText && (
        <span className={`font-semibold ${isWhite ? 'text-white' : 'text-foreground'} ${textSizeClasses[size]}`}>
          Honourus
        </span>
      )}
    </div>
  );
}