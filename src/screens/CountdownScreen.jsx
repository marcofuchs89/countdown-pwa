import { useState, useEffect } from "react";
import { calculateRemainingWorkdays, calculateRemainingWorkdaysWithHolidays } from "../utils/workdayCalculator";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/SharedComponents";

export default function CountdownScreen({ countdown, onEdit, onBack }) {
  const { theme, toggleTheme } = useTheme();
  const today = new Date();
  const targetDate = new Date(countdown.targetDate);

  const diff = targetDate - today;
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  const [workdaysLeft, setWorkdaysLeft] = useState(null);

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
        <button 
          onClick={toggleTheme}
          style={styles.themeToggle(theme)}
          title={theme.name === 'dark' ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
        >
          {theme.name === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={styles.content}>
        <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />

        <h2 style={styles.title(theme)}>{countdown.name}</h2>
        
        {isExpired ? (
          <div style={styles.expiredContainer(theme)}>
            <h2 style={styles.expiredText(theme)}>Abgelaufen!</h2>
            <h2 style={styles.expiredDays(theme)}>{Math.abs(daysLeft)} Tage überfällig</h2>
          </div>
        ) : (
          <h2 style={styles.daysText(theme)}>{daysLeft} Kalendertage</h2>
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
          ⚙️ Bearbeiten
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
    marginBottom: '20px'
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
  workdaysText: (theme) => ({
    fontSize: '1.5rem',
    color: theme.colors.textSecondary,
    margin: '10px 0'
  }),
  expiredContainer: (theme) => ({
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
