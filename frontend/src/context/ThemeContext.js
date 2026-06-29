import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const THEMES = {
  violet: {
    label:'Violet', primary:'#4F46E5', secondary:'#7C3AED',
    bg:'#EEF2FF', border:'#e0e7ff', text:'#1e1b4b',
    shadow:'#c7d2fe', primaryRgb:'99,102,241', dark:'#3730a3',
    hero:'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca,#7C3AED)',
  },
  blue: {
    label:'Bleu', primary:'#2563EB', secondary:'#0891B2',
    bg:'#EFF6FF', border:'#dbeafe', text:'#1e3a5f',
    shadow:'#bfdbfe', primaryRgb:'37,99,235', dark:'#1d4ed8',
    hero:'linear-gradient(135deg,#0c1a4b,#1e3a8a,#1d4ed8,#0891B2)',
  },
  green: {
    label:'Vert', primary:'#16A34A', secondary:'#059669',
    bg:'#F0FDF4', border:'#dcfce7', text:'#14532d',
    shadow:'#bbf7d0', primaryRgb:'22,163,74', dark:'#166534',
    hero:'linear-gradient(135deg,#052e16,#14532d,#166534,#059669)',
  },
  orange: {
    label:'Orange', primary:'#EA580C', secondary:'#F97316',
    bg:'#FFF7ED', border:'#fed7aa', text:'#431407',
    shadow:'#fdba74', primaryRgb:'234,88,12', dark:'#c2410c',
    hero:'linear-gradient(135deg,#431407,#7c2d12,#c2410c,#F97316)',
  },
  red: {
    label:'Rouge', primary:'#DC2626', secondary:'#B91C1C',
    bg:'#FEF2F2', border:'#fecaca', text:'#450a0a',
    shadow:'#fca5a5', primaryRgb:'220,38,38', dark:'#991b1b',
    hero:'linear-gradient(135deg,#450a0a,#7f1d1d,#991b1b,#B91C1C)',
  },
  yellow: {
    label:'Jaune', primary:'#D97706', secondary:'#CA8A04',
    bg:'#FFFBEB', border:'#fde68a', text:'#451a03',
    shadow:'#fcd34d', primaryRgb:'217,119,6', dark:'#a16207',
    hero:'linear-gradient(135deg,#451a03,#78350f,#a16207,#CA8A04)',
  },
};

function applyColorTheme(key) {
  const t = THEMES[key] || THEMES.violet;
  const r = document.documentElement;
  r.style.setProperty('--theme-primary',     t.primary);
  r.style.setProperty('--theme-secondary',   t.secondary);
  r.style.setProperty('--theme-bg',          t.bg);
  r.style.setProperty('--theme-border',      t.border);
  r.style.setProperty('--theme-text',        t.text);
  r.style.setProperty('--theme-shadow',      t.shadow);
  r.style.setProperty('--theme-primary-rgb', t.primaryRgb);
  r.style.setProperty('--theme-dark',        t.dark);
  r.style.setProperty('--theme-hero',        t.hero);
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('nurseprep-theme') || 'light');
  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('nurseprep-color') || 'violet';
    applyColorTheme(saved);
    return saved;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (user && theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('nurseprep-theme', theme);
  }, [theme, user]);

  useEffect(() => {
    applyColorTheme(colorTheme);
    localStorage.setItem('nurseprep-color', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, isDark: theme === 'dark' && !!user,
      colorTheme, setColorTheme, THEMES,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
