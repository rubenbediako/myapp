
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

type FontFace = 'inter' | 'roboto' | 'lato';

interface TextSettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFace: FontFace;
  setFontFace: (face: FontFace) => void;
}

const TextSettingsContext = createContext<TextSettingsContextType | undefined>(undefined);

export const TextSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedSize = localStorage.getItem('app-font-size');
      return storedSize ? Number(storedSize) : 16;
    }
    return 16;
  });

  const [fontFace, setFontFace] = useState<FontFace>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-font-face') as FontFace) || 'inter';
    }
    return 'inter';
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('app-font-size', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.remove('font-inter', 'font-roboto', 'font-lato');
    document.body.classList.add(`font-${fontFace}`);
    localStorage.setItem('app-font-face', fontFace);
  }, [fontFace]);


  const value = useMemo(() => ({
    fontSize,
    setFontSize,
    fontFace,
    setFontFace,
  }), [fontSize, fontFace]);

  return (
    <TextSettingsContext.Provider value={value}>
      {children}
    </TextSettingsContext.Provider>
  );
};

export const useTextSettings = () => {
  const context = useContext(TextSettingsContext);
  if (context === undefined) {
    throw new Error('useTextSettings must be used within a TextSettingsProvider');
  }
  return context;
};
