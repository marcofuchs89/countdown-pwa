import { useState, useEffect } from "react";

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handler() {
      setShow(true);
    }
    window.addEventListener("swUpdate", handler);
    return () => window.removeEventListener("swUpdate", handler);
  }, []);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <p>Eine neue Version ist verfügbar!</p>
        <button style={styles.button} onClick={() => window.location.reload()}>
          Jetzt aktualisieren
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#333",
    color: "#fff",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 1000
  },
  box: {
    textAlign: "center"
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer"
  }
};
