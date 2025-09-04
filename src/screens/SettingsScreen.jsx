import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Button, Card, Input, Label, Select, Checkbox } from "../components/SharedComponents";
import ThemeSelector from "../components/ThemeSelector";

export default function SettingsScreen({ onSave, initialSettings, onDelete, onCancel }) {
  const { theme, toggleMode } = useTheme();
  const [name, setName] = useState(initialSettings?.name || "");
  const [targetDate, setTargetDate] = useState(initialSettings?.targetDate || "");
  const [showWorkdays, setShowWorkdays] = useState(initialSettings?.showWorkdays || false);
  const [showDetailedTime, setShowDetailedTime] = useState(initialSettings?.showDetailedTime || false);
  const [includeHolidays, setIncludeHolidays] = useState(initialSettings?.includeHolidays || false);
  const [bundesland, setBundesland] = useState(initialSettings?.bundesland || "BY");
  const [urlaubstage, setUrlaubstage] = useState(initialSettings?.urlaubstage || 30);
  const [genommen, setGenommen] = useState(initialSettings?.genommen || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, targetDate, showWorkdays, showDetailedTime, includeHolidays, bundesland, urlaubstage, genommen });
  };

  const handleDelete = () => {
    if (confirm('Sind Sie sicher, dass Sie diesen Countdown löschen möchten?')) {
      onDelete();
    }
  };

  return (
    <div style={styles.container(theme)}>
      <div style={styles.header(theme)}>
        <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />
        <h1 style={styles.title(theme)}>
          {initialSettings ? 'Countdown bearbeiten' : 'Neuen Countdown erstellen'}
        </h1>
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

      <Card style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <Label>Name:</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="z.B. Urlaub, Projektende, Geburtstag"
            />
          </div>

          <div style={styles.inputGroup}>
            <Label>Enddatum:</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div style={styles.checkboxGroup}>
            <Checkbox
              checked={showWorkdays}
              onChange={() => setShowWorkdays(!showWorkdays)}
              label="Arbeitstage berechnen"
            />
          </div>

          <div style={styles.checkboxGroup}>
            <Checkbox
              checked={showDetailedTime}
              onChange={() => setShowDetailedTime(!showDetailedTime)}
              label="Detaillierte Zeit anzeigen (Tage, Stunden, Minuten, Sekunden)"
            />
          </div>

          {showWorkdays && (
            <>
              <div style={styles.checkboxGroup}>
                <Checkbox
                  checked={includeHolidays}
                  onChange={() => setIncludeHolidays(!includeHolidays)}
                  label="Feiertage berücksichtigen"
                />
              </div>

              {includeHolidays && (
                <div style={styles.inputGroup}>
                  <Label>Bundesland:</Label>
                  <Select
                    value={bundesland}
                    onChange={(e) => setBundesland(e.target.value)}
                  >
                    <option value="BW">Baden-Württemberg</option>
                    <option value="BY">Bayern</option>
                    <option value="BE">Berlin</option>
                    <option value="BB">Brandenburg</option>
                    <option value="HB">Bremen</option>
                    <option value="HH">Hamburg</option>
                    <option value="HE">Hessen</option>
                    <option value="MV">Mecklenburg-Vorpommern</option>
                    <option value="NI">Niedersachsen</option>
                    <option value="NW">Nordrhein-Westfalen</option>
                    <option value="RP">Rheinland-Pfalz</option>
                    <option value="SL">Saarland</option>
                    <option value="SN">Sachsen</option>
                    <option value="ST">Sachsen-Anhalt</option>
                    <option value="SH">Schleswig-Holstein</option>
                    <option value="TH">Thüringen</option>
                  </Select>
                </div>
              )}

              <div style={styles.inputGroup}>
                <Label>Urlaubstage pro Jahr:</Label>
                <Input
                  type="number"
                  value={urlaubstage}
                  onChange={(e) => setUrlaubstage(Number(e.target.value))}
                  min="0"
                  max="365"
                />
              </div>

              <div style={styles.inputGroup}>
                <Label>Bereits genommene Urlaubstage:</Label>
                <Input
                  type="number"
                  value={genommen}
                  onChange={(e) => setGenommen(Number(e.target.value))}
                  min="0"
                  max={urlaubstage}
                />
              </div>
            </>
          )}

          <div style={styles.buttonGroup}>
            <Button variant="secondary" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              {initialSettings ? 'Aktualisieren' : 'Erstellen'}
            </Button>
            {initialSettings && (
              <Button variant="danger" onClick={handleDelete}>
                Löschen
              </Button>
            )}
          </div>
        </form>
      </Card>
      
      <Card style={styles.formCard}>
        <ThemeSelector />
      </Card>
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
    '@media (max-width: 768px)': {
      padding: '10px'
    }
  }),
  header: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    position: 'relative',
    width: '100%',
    maxWidth: '500px'
  }),
  icon: {
    width: '80px',
    height: '80px',
    marginBottom: '20px',
    borderRadius: '16px',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '@media (max-width: 480px)': {
      width: '60px',
      height: '60px'
    }
  },
  title: (theme) => ({
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    margin: '0',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem'
    },
    '@media (max-width: 480px)': {
      fontSize: '1.3rem'
    }
  }),
  themeToggle: (theme) => ({
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    backgroundColor: theme.colors.surface,
    ':hover': {
      backgroundColor: theme.colors.hover
    }
  }),
  themeControls: {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  formCard: {
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
    '@media (max-width: 768px)': {
      padding: '20px'
    },
    '@media (max-width: 480px)': {
      padding: '15px'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '@media (max-width: 480px)': {
      flexDirection: 'column'
    }
  }
};

