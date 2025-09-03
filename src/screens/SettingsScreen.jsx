import { useState } from "react";

export default function SettingsScreen({ onSave, initialSettings, onDelete }) {
  const [name, setName] = useState(initialSettings?.name || "");
  const [targetDate, setTargetDate] = useState(initialSettings?.targetDate || "");
  const [showWorkdays, setShowWorkdays] = useState(initialSettings?.showWorkdays || false);
  const [includeHolidays, setIncludeHolidays] = useState(initialSettings?.includeHolidays || false);
  const [bundesland, setBundesland] = useState(initialSettings?.bundesland || "BY");
  const [urlaubstage, setUrlaubstage] = useState(initialSettings?.urlaubstage || 30);
  const [genommen, setGenommen] = useState(initialSettings?.genommen || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, targetDate, showWorkdays, includeHolidays, bundesland, urlaubstage, genommen });
  };

  return (
    <div style={styles.container}>
      <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />
      <h1 style={styles.title}>Countdown Einstellungen</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />

        <label style={styles.label}>Enddatum:</label>
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required style={styles.input} />

        <label style={styles.checkbox}>
          <input type="checkbox" checked={showWorkdays} onChange={() => setShowWorkdays(!showWorkdays)} />
          Arbeitstage berechnen
        </label>

        {showWorkdays && (
          <>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={includeHolidays}
                onChange={() => setIncludeHolidays(!includeHolidays)}
              />
              Feiertage berücksichtigen
            </label>

            {includeHolidays && (
              <>
                <label style={styles.label}>Bundesland:</label>
                <select
                  value={bundesland}
                  onChange={(e) => setBundesland(e.target.value)}
                  style={styles.input}
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
                </select>
              </>
            )}

            <label style={styles.label}>Urlaubstage pro Jahr:</label>
            <input
              type="number"
              value={urlaubstage}
              onChange={(e) => setUrlaubstage(Number(e.target.value))}
              style={styles.input}
            />

            <label style={styles.label}>Bereits genommene Urlaubstage:</label>
            <input
              type="number"
              value={genommen}
              onChange={(e) => setGenommen(Number(e.target.value))}
              style={styles.input}
            />
          </>
        )}


        <div style={styles.buttonRow}>
          <button type="submit" style={styles.button}>Speichern</button>
          {initialSettings && (
            <button type="button" style={{ ...styles.button, backgroundColor: "red" }} onClick={onDelete}>
              Löschen
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#000000",
    margin: 0,
    padding: "20px",
    color: "#ffffff"
  },
  icon: { width: "80px", height: "80px", marginBottom: "15px" },
  title: { fontSize: "26px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", width: "280px" },
  input: {
    marginBottom: "12px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000000"
  },
  label: { fontWeight: "bold", marginBottom: "5px" },
  checkbox: { marginBottom: "12px", fontSize: "16px" },
  buttonRow: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  }
};

