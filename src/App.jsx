import { useState, useEffect } from "react";
import CountdownScreen from "./screens/CountdownScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UpdatePrompt from "./components/UpdatePrompt";


export default function App() {
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("countdownSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("countdownSettings", JSON.stringify(newSettings));
    setShowSettings(false);
  };

  const deleteSettings = () => {
    localStorage.removeItem("countdownSettings");
    setSettings(null);
    setShowSettings(true);
  };
    return (
    <>
      {(!settings || showSettings) ? (
        <SettingsScreen
          onSave={saveSettings}
          initialSettings={settings}
          onDelete={deleteSettings}
        />
      ) : (
        <CountdownScreen
          settings={settings}
          onEdit={() => setShowSettings(true)}
        />
      )}

      <UpdatePrompt />
    </>
  );

}
