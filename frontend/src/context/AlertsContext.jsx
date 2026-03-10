import { createContext, useContext, useState, useEffect } from "react";

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  // Load alerts from localStorage at startup
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("energy_alerts")) || [];
    setAlerts(saved);
  }, []);

  // Save alerts every time they change
  useEffect(() => {
    localStorage.setItem("energy_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Count unseen alerts
  const unseenCount = alerts.filter((a) => !a.seen).length;

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts, unseenCount }}>
      {children}
    </AlertsContext.Provider>
  );
}

// Hook shortcut
export function useAlerts() {
  return useContext(AlertsContext);
}
