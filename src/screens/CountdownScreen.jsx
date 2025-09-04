import { useState, useEffect, useMemo } from "react";
import { calculateRemainingWorkdays, calculateRemainingWorkdaysWithHolidays } from "../utils/workdayCalculator";
import { calculateDetailedTime, formatDetailedTime } from "../utils/timeCalculator";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/SharedComponents";
import ThemeSelector from "../components/ThemeSelector";

export default function CountdownScreen({ countdown, onEdit, onBack }) {
  const { theme, toggleMode } = useTheme();
  
  const today = useMemo(() => new Date(), []);
  const targetDate = useMemo(() => new Date(countdown.targetDate), [countdown.targetDate]);

  const diff = targetDate - today;
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  const [workdaysLeft, setWorkdaysLeft] = useState(null);
  const [detailedTime, setDetailedTime] = useState(null);

  // Update detailed time every second if enabled
  useEffect(() => {
    if (!countdown.showDetailedTime) {
      setDetailedTime(null);
      return;
    }

    const updateDetailedTime = () => {
      const timeData = calculateDetailedTime(countdown.targetDate);
      setDetailedTime(timeData);
    };

    // Initial calculation
    updateDetailedTime();

    // Set up interval for real-time updates
    const interval = setInterval(updateDetailedTime, 1000);

    return () => clearInterval(interval);
  }, [countdown.showDetailedTime, countdown.targetDate]);

  useEffect(() => {
    async function calcWorkdays() {
      if (countdown.showWorkdays) {
        if (countdown.includeHolidays) {
          const days = await calculateRemainingWorkdaysWithHolidays(countdown, today, targetDate);
          setWorkdaysLeft(days);
        } else {
          setWorkdaysLeft(calculateRemainingWorkdays(countdown, today, targetDate));
        }
      }
    }
    calcWorkdays();
  }, [countdown, today, targetDate]);

  return (
    <div style={styles.container(theme)}>
      <div style={styles.navigation}>
        <Button variant="secondary" onClick={onBack} style={styles.backButton}>
          ← Zurück zur Liste
        </Button>
        <div style={styles.themeControls}>
          <ThemeSelector compact />
          <button 
            onClick={toggleMode}
            style={styles.themeToggle(theme)}
            title={theme.name.includes('dark') ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
          >
            {theme.name.includes('dark') ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        </div>
      </div>
      
      <div style={styles.content}>
        <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />

        <h2 style={styles.title(theme)}>{countdown.name}</h2>
        
        {isExpired ? (
          <div style={styles.expiredContainer(theme)}>
            <h2 style={styles.expiredText(theme)}>Abgelaufen!</h2>
            {countdown.showDetailedTime && detailedTime ? (
              <h2 style={styles.expiredDays(theme)}>
                {formatDetailedTime(detailedTime)}
              </h2>
            ) : (
              <h2 style={styles.expiredDays(theme)}>{Math.abs(daysLeft)} Tage überfällig</h2>
            )}
          </div>
        ) : (
          <div style={styles.timeContainer}>
            {countdown.showDetailedTime && detailedTime ? (
              <div style={styles.detailedTimeContainer(theme)}>
                <div style={styles.timeBreakdown(theme)}>
                  <div style={styles.timeUnit(theme)}>
                    <span style={styles.timeValue(theme)}>{detailedTime.days}</span>
                    <span style={styles.timeLabel(theme)}>Tage</span>
                  </div>
                  <div style={styles.timeUnit(theme)}>
                    <span style={styles.timeValue(theme)}>{detailedTime.hours}</span>
                    <span style={styles.timeLabel(theme)}>Stunden</span>
                  </div>
                  <div style={styles.timeUnit(theme)}>
                    <span style={styles.timeValue(theme)}>{detailedTime.minutes}</span>
                    <span style={styles.timeLabel(theme)}>Minuten</span>
                  </div>
                  <div style={styles.timeUnit(theme)}>
                    <span style={styles.timeValue(theme)}>{detailedTime.seconds}</span>
                    <span style={styles.timeLabel(theme)}>Sekunden</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.standardTimeContainer(theme)}>
                <div style={styles.timeBreakdown(theme)}>
                  <div style={styles.timeUnit(theme)}>
                    <span style={styles.timeValue(theme)}>{daysLeft}</span>
                    <span style={styles.timeLabel(theme)}>Kalendertage</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {countdown.showWorkdays && (
          <h2 style={styles.workdaysText(theme)}>
            {workdaysLeft !== null ? 
              `${workdaysLeft} Arbeitstage` : 
              "Berechne..."
            }
          </h2>
        )}

        <div style={styles.dateInfo(theme)}>
          <p style={styles.targetDateText(theme)}>
            Zieldatum: {targetDate.toLocaleDateString('de-DE')}
          </p>
          <p style={styles.todayText(theme)}>
            Heute: {today.toLocaleDateString('de-DE')}
          </p>
        </div>

        <Button variant="primary" onClick={onEdit} style={styles.editButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Bearbeiten
        </Button>
      </div>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.fonts.primary,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  }),
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  themeControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  backButton: {
    fontSize: '14px'
  },
  themeToggle: (theme) => ({
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'all 0.2s ease',
    boxShadow: `0 2px 4px ${theme.colors.shadow}`
  }),
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center'
  },
  icon: {
    width: '80px',
    height: '80px',
    marginBottom: '20px',
    borderRadius: '16px',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  title: (theme) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: '20px',
    textAlign: 'center'
  }),
  daysText: (theme) => ({
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: '10px 0'
  }),
  timeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px 0'
  },
  detailedTimeContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }),
  standardTimeContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }),
  timeBreakdown: () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '15px',
    marginTop: '20px',
    maxWidth: '400px',
    width: '100%',
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px'
    }
  }),
  timeUnit: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px 10px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)'
    },
    '@media (max-width: 480px)': {
      padding: '10px 5px'
    }
  }),
  timeValue: (theme) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    lineHeight: '1',
    '@media (max-width: 480px)': {
      fontSize: '1.5rem'
    }
  }),
  timeLabel: (theme) => ({
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
    marginTop: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '500',
    '@media (max-width: 480px)': {
      fontSize: '0.7rem'
    }
  }),
  workdaysText: (theme) => ({
    fontSize: '1.5rem',
    color: theme.colors.textSecondary,
    margin: '10px 0'
  }),
  expiredContainer: () => ({
    textAlign: 'center',
    margin: '20px 0'
  }),
  expiredText: (theme) => ({
    fontSize: '2rem',
    color: theme.colors.danger,
    fontWeight: 'bold',
    margin: '10px 0'
  }),
  expiredDays: (theme) => ({
    fontSize: '1.8rem',
    color: theme.colors.danger,
    margin: '10px 0'
  }),
  dateInfo: (theme) => ({
    margin: '30px 0',
    padding: '20px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '300px',
    width: '100%'
  }),
  targetDateText: (theme) => ({
    fontSize: '1rem',
    color: theme.colors.text,
    margin: '5px 0',
    fontWeight: '600'
  }),
  todayText: (theme) => ({
    fontSize: '0.9rem',
    color: theme.colors.textSecondary,
    margin: '5px 0'
  }),
  editButton: {
    marginTop: '30px',
    padding: '15px 30px',
    fontSize: '1.1rem'
  }
};
