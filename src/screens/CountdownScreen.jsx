import { useState, useEffect } from "react";
import { calculateRemainingWorkdays, calculateRemainingWorkdaysWithHolidays } from "../utils/workdayCalculator";

export default function CountdownScreen({ settings, onEdit }) {
  const today = new Date();
  const targetDate = new Date(settings.targetDate);

  const diff = targetDate - today;
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const [workdaysLeft, setWorkdaysLeft] = useState(null);

  useEffect(() => {
    async function calcWorkdays() {
      if (settings.showWorkdays) {
        if (settings.includeHolidays) {
          const days = await calculateRemainingWorkdaysWithHolidays(settings, today, targetDate);
          setWorkdaysLeft(days);
        } else {
          setWorkdaysLeft(calculateRemainingWorkdays(settings, today, targetDate));
        }
      }
    }
    calcWorkdays();
  }, [settings, today, targetDate]);

  return (
    <div style={styles.container}>
      <img src="/icons/icon-192x192.png" alt="App Icon" style={styles.icon} />

      <h2 style={styles.title}>{settings.name}</h2>
      <h2 style={styles.text}>{daysLeft} Kalendertage</h2>
      {settings.showWorkdays && (
        <h2 style={styles.text}>
          {workdaysLeft !== null ? `${workdaysLeft} Arbeitstage` : "Berechne..."}
        </h2>
      )}

      <button onClick={onEdit} style={styles.editButton}>⚙️ Einstellungen</button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",        // volle Höhe
    width: "100vw",         // volle Breite
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#000000",
    margin: 0,              // wichtig: kein Margin
    padding: 0              // wichtig: kein Padding
  },
  icon: { width: "80px", height: "80px", marginBottom: "20px" },
  title: { fontSize: "28px", marginBottom: "15px", color: "#007bff" },
  text: { fontSize: "20px", margin: "8px 0" },
  editButton: {
    marginTop: "25px",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  }
};

