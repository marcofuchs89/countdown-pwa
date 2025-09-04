import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Button, Card } from "../components/SharedComponents";

export default function CountdownListScreen({ 
  countdowns, 
  onSelectCountdown, 
  onEditCountdown, 
  onDeleteCountdown, 
  onCreateNew 
}) {
  const { theme, toggleTheme } = useTheme();
  const [countdownStatuses, setCountdownStatuses] = useState({});

  useEffect(() => {
    // Calculate days remaining for each countdown
    const statuses = {};
    const today = new Date();
    
    countdowns.forEach(countdown => {
      const targetDate = new Date(countdown.targetDate);
      const diff = targetDate - today;
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const isExpired = daysLeft < 0;
      
      statuses[countdown.id] = {
        daysLeft: Math.abs(daysLeft),
        isExpired
      };
    });
    
    setCountdownStatuses(statuses);
  }, [countdowns]);

  const handleDelete = (e, countdownId) => {
    e.stopPropagation();
    if (confirm('Sind Sie sicher, dass Sie diesen Countdown löschen möchten?')) {
      onDeleteCountdown(countdownId);
    }
  };

  const handleEdit = (e, countdown) => {
    e.stopPropagation();
    onEditCountdown(countdown);
  };

  if (countdowns.length === 0) {
    return (
      <div style={styles.container(theme)}>
        <div style={styles.header(theme)}>
          <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />
          <h1 style={styles.title(theme)}>Meine Countdowns</h1>
          <button 
            onClick={toggleTheme}
            style={styles.themeToggle(theme)}
            title={theme.name === 'dark' ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
          >
            {theme.name === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div style={styles.emptyState(theme)}>
          <p style={styles.emptyMessage(theme)}>Noch keine Countdowns erstellt</p>
          <Button variant="primary" size="large" onClick={onCreateNew}>
            ➕ Ersten Countdown erstellen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container(theme)}>
      <div style={styles.header(theme)}>
        <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />
        <h1 style={styles.title(theme)}>Meine Countdowns</h1>
        <button 
          onClick={toggleTheme}
          style={styles.themeToggle(theme)}
          title={theme.name === 'dark' ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
        >
          {theme.name === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div style={styles.countdownList}>
        {countdowns.map(countdown => {
          const status = countdownStatuses[countdown.id] || { daysLeft: 0, isExpired: false };
          
          return (
            <Card
              key={countdown.id}
              style={{
                ...styles.countdownCard(theme),
                ...(status.isExpired ? styles.expiredCard(theme) : {})
              }}
              onClick={() => onSelectCountdown(countdown)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.countdownName(theme)}>{countdown.name}</h3>
                <div style={styles.cardActions}>
                  <button
                    onClick={(e) => handleEdit(e, countdown)}
                    style={styles.actionButton(theme)}
                    title="Bearbeiten"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, countdown.id)}
                    style={styles.deleteButton(theme)}
                    title="Löschen"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div style={styles.countdownInfo}>
                <p style={styles.targetDate(theme)}>
                  Ziel: {new Date(countdown.targetDate).toLocaleDateString('de-DE')}
                </p>
                <p style={{
                  ...styles.daysLeft(theme),
                  color: status.isExpired ? theme.colors.danger : theme.colors.primary
                }}>
                  {status.isExpired ? 
                    `${status.daysLeft} Tage überfällig` : 
                    `${status.daysLeft} Tage verbleibend`
                  }
                </p>
                {countdown.showWorkdays && (
                  <p style={styles.workdaysNote(theme)}>📊 Mit Arbeitstagen</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      <Button variant="success" size="large" onClick={onCreateNew} style={styles.createButton}>
        ➕ Neuen Countdown erstellen
      </Button>
    </div>
  );
}

const styles = {
  container: (theme) => ({
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.fonts.primary,
    maxWidth: '100vw',
    boxSizing: 'border-box'
  }),
  header: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    position: 'relative',
    width: '100%',
    maxWidth: '600px'
  }),
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
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    margin: '0'
  }),
  themeToggle: (theme) => ({
    position: 'absolute',
    top: '0',
    right: '0',
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
  emptyState: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    textAlign: 'center'
  }),
  emptyMessage: (theme) => ({
    fontSize: '1.1rem',
    color: theme.colors.textSecondary,
    margin: '0'
  }),
  countdownList: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  countdownCard: (theme) => ({
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  }),
  expiredCard: (theme) => ({
    borderLeft: `4px solid ${theme.colors.danger}`,
    backgroundColor: theme.name === 'dark' ? '#2d1a1a' : '#fff8f8'
  }),
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  countdownName: (theme) => ({
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: '0',
    flex: 1
  }),
  cardActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: (theme) => ({
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  }),
  deleteButton: (theme) => ({
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  }),
  countdownInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  targetDate: (theme) => ({
    fontSize: '0.9rem',
    color: theme.colors.textSecondary,
    margin: '0'
  }),
  daysLeft: (theme) => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0'
  }),
  workdaysNote: (theme) => ({
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
    margin: '0'
  }),
  createButton: {
    marginTop: '20px'
  }
};
