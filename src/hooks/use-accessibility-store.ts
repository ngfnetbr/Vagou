import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FontSizeScale = 'default' | 'medium' | 'large';

interface AccessibilityState {
  isHighContrastEnabled: boolean;
  fontSizeScale: FontSizeScale;
  toggleHighContrast: () => void;
  setFontSize: (scale: FontSizeScale) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      isHighContrastEnabled: false,
      fontSizeScale: 'default',
      
      toggleHighContrast: () => set((state) => ({ 
        isHighContrastEnabled: !state.isHighContrastEnabled 
      })),
      
      setFontSize: (scale) => set({ fontSizeScale: scale }),
    }),
    {
      name: 'vagou-accessibility-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);