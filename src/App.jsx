import { useState, useEffect } from "react";
import CountdownScreen from "./screens/CountdownScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CountdownListScreen from "./screens/CountdownListScreen";
import UpdatePrompt from "./components/UpdatePrompt";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  const [countdowns, setCountdowns] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'countdown', 'settings'
  const [selectedCountdown, setSelectedCountdown] = useState(null);
  const [editingCountdown, setEditingCountdown] = useState(null);

  useEffect(() => {
    // Migrate old single countdown to new multiple countdown format
    const oldSettings = localStorage.getItem("countdownSettings");
    const newCountdowns = localStorage.getItem("countdowns");
    
    if (oldSettings && !newCountdowns) {
      // Migrate old format
      const parsed = JSON.parse(oldSettings);
      const migratedCountdown = { 
        ...parsed, 
        id: Date.now().toString(),
        showDetailedTime: false // Add default value for new property
      };
      const countdownsArray = [migratedCountdown];
      localStorage.setItem("countdowns", JSON.stringify(countdownsArray));
      localStorage.removeItem("countdownSettings");
      setCountdowns(countdownsArray);
    } else if (newCountdowns) {
      const parsed = JSON.parse(newCountdowns);
      // Ensure all countdowns have the showDetailedTime property
      const updatedCountdowns = parsed.map(countdown => ({
        ...countdown,
        showDetailedTime: countdown.showDetailedTime ?? false
      }));
      setCountdowns(updatedCountdowns);
      
      // Save updated countdowns if any were missing the property
      if (updatedCountdowns.some((c, i) => c.showDetailedTime !== parsed[i].showDetailedTime)) {
        localStorage.setItem("countdowns", JSON.stringify(updatedCountdowns));
      }
    }
  }, []);

  const saveCountdowns = (newCountdowns) => {
    setCountdowns(newCountdowns);
    localStorage.setItem("countdowns", JSON.stringify(newCountdowns));
  };

  const saveCountdown = (countdownData) => {
    let updatedCountdowns;
    
    if (editingCountdown) {
      // Update existing countdown
      updatedCountdowns = countdowns.map(c => 
        c.id === editingCountdown.id ? { ...countdownData, id: editingCountdown.id } : c
      );
    } else {
      // Create new countdown
      const newCountdown = { ...countdownData, id: Date.now().toString() };
      updatedCountdowns = [...countdowns, newCountdown];
    }
    
    saveCountdowns(updatedCountdowns);
    setCurrentView('list');
    setEditingCountdown(null);
  };

  const deleteCountdown = (countdownId) => {
    const updatedCountdowns = countdowns.filter(c => c.id !== countdownId);
    saveCountdowns(updatedCountdowns);
    setCurrentView('list');
    setEditingCountdown(null);
  };

  const showCountdown = (countdown) => {
    setSelectedCountdown(countdown);
    setCurrentView('countdown');
  };

  const showSettings = (countdown = null) => {
    setEditingCountdown(countdown);
    setCurrentView('settings');
  };

  const showList = () => {
    setCurrentView('list');
    setSelectedCountdown(null);
    setEditingCountdown(null);
  };

  return (
    <ThemeProvider>      
      {currentView === 'list' && (
        <CountdownListScreen
          countdowns={countdowns}
          onSelectCountdown={showCountdown}
          onEditCountdown={showSettings}
          onDeleteCountdown={deleteCountdown}
          onCreateNew={() => showSettings()}
        />
      )}
      
      {currentView === 'countdown' && selectedCountdown && (
        <CountdownScreen
          countdown={selectedCountdown}
          onEdit={() => showSettings(selectedCountdown)}
          onBack={showList}
        />
      )}
      
      {currentView === 'settings' && (
        <SettingsScreen
          onSave={saveCountdown}
          initialSettings={editingCountdown}
          onDelete={() => deleteCountdown(editingCountdown?.id)}
          onCancel={showList}
        />
      )}

      <UpdatePrompt />
    </ThemeProvider>
  );
}
