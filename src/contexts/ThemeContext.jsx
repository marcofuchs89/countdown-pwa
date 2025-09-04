import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Base structure shared by all themes
const baseTheme = {
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  }
};

// Theme definitions
const themes = {
  default: {
    light: {
      ...baseTheme,
      name: 'default-light',
      displayName: 'Default Light',
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#212529',
        textSecondary: '#6c757d',
        border: '#dee2e6',
        hover: '#e9ecef',
        shadow: 'rgba(0, 0, 0, 0.1)',
        accent: '#e7f1ff'
      }
    },
    dark: {
      ...baseTheme,
      name: 'default-dark',
      displayName: 'Default Dark',
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        background: '#212529',
        surface: '#343a40',
        text: '#ffffff',
        textSecondary: '#adb5bd',
        border: '#495057',
        hover: '#495057',
        shadow: 'rgba(0, 0, 0, 0.3)',
        accent: '#373b3e'
      }
    }
  },
  atomone: {
    light: {
      ...baseTheme,
      name: 'atomone-light',
      displayName: 'Atom One Light',
      colors: {
        primary: '#4078f2',
        secondary: '#969896',
        success: '#50a14f',
        danger: '#e45649',
        warning: '#986801',
        info: '#0184bc',
        background: '#fafafa',
        surface: '#f0f0f0',
        text: '#383a42',
        textSecondary: '#696c77',
        border: '#e5e5e6',
        hover: '#e8e8e9',
        shadow: 'rgba(56, 58, 66, 0.15)',
        accent: '#e8e8e9'
      }
    },
    dark: {
      ...baseTheme,
      name: 'atomone-dark',
      displayName: 'Atom One Dark',
      colors: {
        primary: '#61afef',
        secondary: '#5c6370',
        success: '#98c379',
        danger: '#e06c75',
        warning: '#e5c07b',
        info: '#56b6c2',
        background: '#282c34',
        surface: '#21252b',
        text: '#abb2bf',
        textSecondary: '#5c6370',
        border: '#3e4451',
        hover: '#2c313c',
        shadow: 'rgba(0, 0, 0, 0.4)',
        accent: '#21252b'
      }
    }
  },
  catppuccin: {
    light: {
      ...baseTheme,
      name: 'catppuccin-light',
      displayName: 'Catppuccin Latte',
      colors: {
        primary: '#1e66f5',
        secondary: '#6c6f85',
        success: '#40a02b',
        danger: '#d20f39',
        warning: '#df8e1d',
        info: '#179299',
        background: '#eff1f5',
        surface: '#e6e9ef',
        text: '#4c4f69',
        textSecondary: '#6c6f85',
        border: '#dce0e8',
        hover: '#ccd0da',
        shadow: 'rgba(76, 79, 105, 0.15)',
        accent: '#dce0e8'
      }
    },
    dark: {
      ...baseTheme,
      name: 'catppuccin-dark',
      displayName: 'Catppuccin Macchiato',
      colors: {
        primary: '#8aadf4',
        secondary: '#a5adcb',
        success: '#a6da95',
        danger: '#ed8796',
        warning: '#eed49f',
        info: '#8bd5ca',
        background: '#24273a',
        surface: '#1e2030',
        text: '#cad3f5',
        textSecondary: '#a5adcb',
        border: '#363a4f',
        hover: '#494d64',
        shadow: 'rgba(0, 0, 0, 0.3)',
        accent: '#181926'
      }
    }
  },
  github: {
    light: {
      ...baseTheme,
      name: 'github-light',
      displayName: 'GitHub Light',
      colors: {
        primary: '#0969da',
        secondary: '#656d76',
        success: '#1a7f37',
        danger: '#cf222e',
        warning: '#bf8700',
        info: '#0550ae',
        background: '#ffffff',
        surface: '#f6f8fa',
        text: '#1f2328',
        textSecondary: '#656d76',
        border: '#d0d7de',
        hover: '#f3f4f6',
        shadow: 'rgba(31, 35, 40, 0.12)',
        accent: '#dbeafe'
      }
    },
    dark: {
      ...baseTheme,
      name: 'github-dark',
      displayName: 'GitHub Dark',
      colors: {
        primary: '#2f81f7',
        secondary: '#7d8590',
        success: '#3fb950',
        danger: '#f85149',
        warning: '#d29922',
        info: '#58a6ff',
        background: '#0d1117',
        surface: '#161b22',
        text: '#e6edf3',
        textSecondary: '#7d8590',
        border: '#30363d',
        hover: '#21262d',
        shadow: 'rgba(0, 0, 0, 0.3)',
        accent: '#161b22'
      }
    }
  },
  gruvbox: {
    light: {
      ...baseTheme,
      name: 'gruvbox-light',
      displayName: 'Gruvbox Light',
      colors: {
        primary: '#076678',
        secondary: '#928374',
        success: '#79740e',
        danger: '#cc241d',
        warning: '#b57614',
        info: '#458588',
        background: '#fbf1c7',
        surface: '#f2e5bc',
        text: '#3c3836',
        textSecondary: '#504945',
        border: '#d5c4a1',
        hover: '#ebdbb2',
        shadow: 'rgba(60, 56, 54, 0.15)',
        accent: '#ebdbb2'
      }
    },
    dark: {
      ...baseTheme,
      name: 'gruvbox-dark',
      displayName: 'Gruvbox Dark',
      colors: {
        primary: '#83a598',
        secondary: '#928374',
        success: '#b8bb26',
        danger: '#fb4934',
        warning: '#fabd2f',
        info: '#8ec07c',
        background: '#282828',
        surface: '#1d2021',
        text: '#ebdbb2',
        textSecondary: '#a89984',
        border: '#504945',
        hover: '#3c3836',
        shadow: 'rgba(0, 0, 0, 0.5)',
        accent: '#1d2021'
      }
    }
  },
  monokai: {
    light: {
      ...baseTheme,
      name: 'monokai-light',
      displayName: 'Monokai Light',
      colors: {
        primary: '#f92672',
        secondary: '#75715e',
        success: '#a6e22e',
        danger: '#f92672',
        warning: '#fd971f',
        info: '#66d9ef',
        background: '#fafafa',
        surface: '#f8f8f2',
        text: '#272822',
        textSecondary: '#75715e',
        border: '#e6db74',
        hover: '#f4f4f0',
        shadow: 'rgba(39, 40, 34, 0.15)',
        accent: '#f4f4f0'
      }
    },
    dark: {
      ...baseTheme,
      name: 'monokai-dark',
      displayName: 'Monokai Dark',
      colors: {
        primary: '#f92672',
        secondary: '#75715e',
        success: '#a6e22e',
        danger: '#f92672',
        warning: '#fd971f',
        info: '#66d9ef',
        background: '#272822',
        surface: '#1e1f1c',
        text: '#f8f8f2',
        textSecondary: '#75715e',
        border: '#49483e',
        hover: '#383830',
        shadow: 'rgba(0, 0, 0, 0.5)',
        accent: '#1e1f1c'
      }
    }
  },
  solarized: {
    light: {
      ...baseTheme,
      name: 'solarized-light',
      displayName: 'Solarized Light',
      colors: {
        primary: '#268bd2',
        secondary: '#93a1a1',
        success: '#859900',
        danger: '#dc322f',
        warning: '#b58900',
        info: '#2aa198',
        background: '#fdf6e3',
        surface: '#eee8d5',
        text: '#657b83',
        textSecondary: '#93a1a1',
        border: '#eee8d5',
        hover: '#eee8d5',
        shadow: 'rgba(101, 123, 131, 0.15)',
        accent: '#eee8d5'
      }
    },
    dark: {
      ...baseTheme,
      name: 'solarized-dark',
      displayName: 'Solarized Dark',
      colors: {
        primary: '#268bd2',
        secondary: '#586e75',
        success: '#859900',
        danger: '#dc322f',
        warning: '#b58900',
        info: '#2aa198',
        background: '#002b36',
        surface: '#073642',
        text: '#839496',
        textSecondary: '#586e75',
        border: '#073642',
        hover: '#073642',
        shadow: 'rgba(0, 0, 0, 0.4)',
        accent: '#073642'
      }
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState('default');
  const [currentMode, setCurrentMode] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme-name');
    const savedMode = localStorage.getItem('app-theme-mode');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeName(savedTheme);
    }
    
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setCurrentMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme-name', currentThemeName);
    localStorage.setItem('app-theme-mode', currentMode);
    document.body.className = `theme-${currentThemeName}-${currentMode}`;
  }, [currentThemeName, currentMode]);

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
    }
  };

  const theme = themes[currentThemeName][currentMode];

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleMode, 
      setTheme, 
      currentThemeName, 
      currentMode,
      availableThemes: Object.keys(themes)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
