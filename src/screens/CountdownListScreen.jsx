import { useState, useEffect } from "react";
import { calculateDetailedTime, getCompactTime } from "../utils/timeCalculator";
import { useTheme } from "../contexts/ThemeContext";
import { Button, Card } from "../components/SharedComponents";
import ThemeSelector from "../components/ThemeSelector";

export default function CountdownListScreen({ 
  countdowns, 
  onSelectCountdown, 
  onEditCountdown, 
  onDeleteCountdown, 
  onCreateNew 
}) {
  const { theme, toggleMode } = useTheme();
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
      
      // Calculate detailed time if enabled for this countdown
      let detailedTime = null;
      if (countdown.showDetailedTime) {
        detailedTime = calculateDetailedTime(countdown.targetDate);
      }
      
      statuses[countdown.id] = {
        daysLeft: Math.abs(daysLeft),
        isExpired,
        detailedTime
      };
    });
    
    setCountdownStatuses(statuses);
    
    // Set up interval for real-time updates if any countdown has detailed time enabled
    const hasDetailedTime = countdowns.some(c => c.showDetailedTime);
    if (hasDetailedTime) {
      const interval = setInterval(() => {
        const updatedStatuses = {};
        countdowns.forEach(countdown => {
          const targetDate = new Date(countdown.targetDate);
          const diff = targetDate - new Date();
          const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
          const isExpired = daysLeft < 0;
          
          let detailedTime = null;
          if (countdown.showDetailedTime) {
            detailedTime = calculateDetailedTime(countdown.targetDate);
          }
          
          updatedStatuses[countdown.id] = {
            daysLeft: Math.abs(daysLeft),
            isExpired,
            detailedTime
          };
        });
        setCountdownStatuses(updatedStatuses);
      }, 1000);
      
      return () => clearInterval(interval);
    }
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
          <div style={styles.themeControls}>
            <ThemeSelector compact={true} />
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
        
        <div style={styles.emptyState(theme)}>
          <p style={styles.emptyMessage(theme)}>Noch keine Countdowns erstellt</p>
          <Button variant="primary" size="large" onClick={onCreateNew}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ersten Countdown erstellen
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
        <div style={styles.themeControls}>
          <ThemeSelector compact={true} />
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 2 4 4-14 14H4v-4L18 2z"></path>
                      <path d="m14.5 5.5 4 4"></path>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, countdown.id)}
                    style={styles.deleteButton(theme)}
                    title="Löschen"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
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
                  {countdown.showDetailedTime && status.detailedTime ? (
                    status.isExpired ? 
                      `${getCompactTime(status.detailedTime)} überfällig` :
                      getCompactTime(status.detailedTime)
                  ) : (
                    status.isExpired ? 
                      `${status.daysLeft} Tage überfällig` : 
                      `${status.daysLeft} Tage verbleibend`
                  )}
                </p>
                <div style={styles.countdownFeatures}>
                  {countdown.showWorkdays && (
                    <span style={styles.featureBadge(theme)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      Arbeitstage
                    </span>
                  )}
                  {countdown.showDetailedTime && (
                    <span style={styles.featureBadge(theme)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      Detailzeit
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Button variant="success" size="large" onClick={onCreateNew} style={styles.createButton}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Neuen Countdown erstellen
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
  header: () => ({
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
  themeControls: {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  emptyState: () => ({
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
  countdownCard: () => ({
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
  actionButton: () => ({
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  }),
  deleteButton: () => ({
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
  daysLeft: () => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0'
  }),
  countdownFeatures: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap'
  },
  featureBadge: (theme) => ({
    fontSize: '0.75rem',
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '2px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
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
