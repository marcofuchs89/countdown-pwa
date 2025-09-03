import { useTheme } from '../contexts/ThemeContext';

// Button Component
export function Button({ children, variant = 'primary', size = 'medium', onClick, type = 'button', disabled = false, style = {} }) {
  const { theme } = useTheme();

  const baseStyle = {
    fontFamily: theme.fonts.primary,
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: '#ffffff',
      boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: '#ffffff',
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: '#ffffff',
    },
    success: {
      backgroundColor: theme.colors.success,
      color: '#ffffff',
    }
  };

  const sizes = {
    small: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: theme.fonts.size.small },
    medium: { padding: `${theme.spacing.md} ${theme.spacing.lg}`, fontSize: theme.fonts.size.medium },
    large: { padding: `${theme.spacing.lg} ${theme.spacing.xl}`, fontSize: theme.fonts.size.large }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...sizes[size]
      }}
    >
      {children}
    </button>
  );
}

// Card Component
export function Card({ children, style = {}, onClick, elevated = true }) {
  const { theme } = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: elevated ? `0 2px 8px ${theme.colors.shadow}` : 'none',
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {children}
    </div>
  );
}

// Input Component
export function Input({ type = 'text', value, onChange, placeholder, required = false, style = {}, ...props }) {
  const { theme } = useTheme();

  const inputStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: theme.fonts.size.medium,
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    transition: 'border-color 0.2s ease',
    width: '100%',
    boxSizing: 'border-box',
    ...style
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={inputStyle}
      {...props}
    />
  );
}

// Select Component
export function Select({ value, onChange, children, style = {}, ...props }) {
  const { theme } = useTheme();

  const selectStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: theme.fonts.size.medium,
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    width: '100%',
    cursor: 'pointer',
    ...style
  };

  return (
    <select
      value={value}
      onChange={onChange}
      style={selectStyle}
      {...props}
    >
      {children}
    </select>
  );
}

// Label Component
export function Label({ children, required = false, style = {} }) {
  const { theme } = useTheme();

  const labelStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: theme.fonts.size.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    display: 'block',
    ...style
  };

  return (
    <label style={labelStyle}>
      {children}
      {required && <span style={{ color: theme.colors.danger, marginLeft: '4px' }}>*</span>}
    </label>
  );
}

// Checkbox Component
export function Checkbox({ checked, onChange, label, style = {} }) {
  const { theme } = useTheme();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    cursor: 'pointer',
    ...style
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    accentColor: theme.colors.primary
  };

  const labelStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: theme.fonts.size.medium,
    color: theme.colors.text,
    cursor: 'pointer',
    userSelect: 'none'
  };

  return (
    <div style={containerStyle} onClick={() => onChange(!checked)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={checkboxStyle}
      />
      <span style={labelStyle}>{label}</span>
    </div>
  );
}
