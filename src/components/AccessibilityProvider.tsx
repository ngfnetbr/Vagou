"use client";

import React, { useEffect } from 'react';
import { useAccessibilityStore, FontSizeScale } from '@/hooks/use-accessibility-store';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const FONT_SCALE_CLASSES: Record<FontSizeScale, string> = {
    'default': '',
    'medium': 'font-scale-medium',
    'large': 'font-scale-large',
};

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { isHighContrastEnabled, fontSizeScale } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // 1. High Contrast
    if (isHighContrastEnabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // 2. Font Size Scale
    // Remove previous font scale classes
    Object.values(FONT_SCALE_CLASSES).forEach(cls => {
        if (cls) root.classList.remove(cls);
    });
    
    // Add current font scale class
    const currentScaleClass = FONT_SCALE_CLASSES[fontSizeScale];
    if (currentScaleClass) {
        root.classList.add(currentScaleClass);
    }
    
  }, [isHighContrastEnabled, fontSizeScale]);

  // The provider itself doesn't render anything visible, it just manages global classes on <html>
  return <>{children}</>;
};