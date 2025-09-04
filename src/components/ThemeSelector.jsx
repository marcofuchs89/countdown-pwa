import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeSelector({ compact = false }) {
  const { theme, setTheme, currentThemeName, currentMode, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState(null);

  const themeDisplayNames = {
    default: 'Default',
    atomone: 'Atom One',
    catppuccin: 'Catppuccin',
    github: 'GitHub',
    gruvbox: 'Gruvbox',
    monokai: 'Monokai',
    solarized: 'Solarized'
  };

  const getThemeColors = (themeName, mode) => {
    const themeMap = {
      default: {
        light: { primary: '#0d6efd', success: '#198754', danger: '#dc3545' },
        dark: { primary: '#0d6efd', success: '#198754', danger: '#dc3545' }
      },
      atomone: {
        light: { primary: '#4078f2', success: '#50a14f', danger: '#e45649' },
        dark: { primary: '#61afef', success: '#98c379', danger: '#e06c75' }
      },
      catppuccin: {
        light: { primary: '#1e66f5', success: '#40a02b', danger: '#d20f39' },
        dark: { primary: '#8aadf4', success: '#a6da95', danger: '#ed8796' }
      },
      github: {
        light: { primary: '#0969da', success: '#1a7f37', danger: '#cf222e' },
        dark: { primary: '#2f81f7', success: '#3fb950', danger: '#f85149' }
      },
      gruvbox: {
        light: { primary: '#076678', success: '#79740e', danger: '#cc241d' },
        dark: { primary: '#83a598', success: '#b8bb26', danger: '#fb4934' }
      },
      monokai: {
        light: { primary: '#f92672', success: '#a6e22e', danger: '#f92672' },
        dark: { primary: '#f92672', success: '#a6e22e', danger: '#f92672' }
      },
      solarized: {
        light: { primary: '#268bd2', success: '#859900', danger: '#dc322f' },
        dark: { primary: '#268bd2', success: '#859900', danger: '#dc322f' }
      }
    };
    return themeMap[themeName]?.[mode] || themeMap.default[mode];
  };

  const handleThemeSelect = (themeName) => {
    setTheme(themeName);
    setIsOpen(false);
    setHoveredTheme(null);
  };

  const currentColors = getThemeColors(currentThemeName, currentMode);

  if (compact) {
    return (
      <div style={styles.compactContainer(theme)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={styles.compactTrigger(theme)}
          title="Farbschema wählen"
        >
          <span style={styles.compactThemeName(theme)}>
            {themeDisplayNames[currentThemeName]}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
        
        {isOpen && (
          <>
            <div style={styles.backdrop} onClick={() => setIsOpen(false)} />
            <div style={styles.compactDropdown(theme)}>
              {availableThemes.map(themeName => {
                const colors = getThemeColors(themeName, currentMode);
                return (
                  <button
                    key={themeName}
                    onClick={() => handleThemeSelect(themeName)}
                    onMouseEnter={() => setHoveredTheme(themeName)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    style={{
                      ...styles.compactOption(theme),
                      ...(currentThemeName === themeName ? styles.compactOptionActive(theme) : {}),
                      ...(hoveredTheme === themeName ? styles.compactOptionHovered(theme) : {})
                    }}
                  >
                    <span style={styles.compactOptionText(theme)}>
                      {themeDisplayNames[themeName]}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container(theme)}>
      <h3 style={styles.title(theme)}>Farbschema wählen</h3>
      <div style={styles.themeGrid}>
        {availableThemes.map(themeName => {
          const colors = getThemeColors(themeName, currentMode);
          return (
            <button
              key={themeName}
              onClick={() => handleThemeSelect(themeName)}
              onMouseEnter={() => setHoveredTheme(themeName)}
              onMouseLeave={() => setHoveredTheme(null)}
              style={{
                ...styles.themeOption(theme),
                ...(currentThemeName === themeName ? styles.themeOptionActive(theme) : {}),
                ...(hoveredTheme === themeName ? styles.themeOptionHovered(theme) : {})
              }}
            >
              <div style={styles.themePreview}>
                <div style={{ ...styles.previewColor, backgroundColor: colors.primary }} />
                <div style={{ ...styles.previewColor, backgroundColor: colors.success }} />
                <div style={{ ...styles.previewColor, backgroundColor: colors.danger }} />
              </div>
              <span style={styles.themeName(theme)}>
                {themeDisplayNames[themeName]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    margin: '20px 0'
  }),
  title: (theme) => ({
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: '15px'
  }),
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px'
  },
  themeOption: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }),
  themeOptionActive: (theme) => ({
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  }),
  themeOptionHovered: (theme) => ({
    borderColor: theme.colors.primary,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.colors.shadow}`
  }),
  themePreview: {
    display: 'flex',
    gap: '4px',
    marginBottom: '8px'
  },
  previewColor: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.1)'
  },
  themeName: (theme) => ({
    fontSize: '0.9rem',
    color: theme.colors.text,
    fontWeight: '500'
  }),
  
  // Compact styles for header usage
  compactContainer: (theme) => ({
    position: 'relative',
    display: 'inline-block'
  }),
  compactTrigger: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.medium,
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: theme.colors.text,
    transition: 'all 0.2s ease',
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    ':hover': {
      borderColor: theme.colors.primary
    }
  }),
  compactThemeName: (theme) => ({
    fontSize: '0.85rem',
    color: theme.colors.text,
    fontWeight: '500'
  }),
  compactPreview: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center'
  },
  compactColorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.1)'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998
  },
  compactDropdown: (theme) => ({
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.medium,
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    zIndex: 999,
    minWidth: '140px',
    overflow: 'hidden'
  }),
  compactOption: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  }),
  compactOptionActive: (theme) => ({
    backgroundColor: theme.colors.primary + '15',
    color: theme.colors.primary
  }),
  compactOptionHovered: (theme) => ({
    backgroundColor: theme.colors.hover
  }),
  compactOptionText: (theme) => ({
    fontSize: '0.85rem',
    color: 'inherit',
    marginLeft: '8px',
    fontWeight: '500'
  })
};
