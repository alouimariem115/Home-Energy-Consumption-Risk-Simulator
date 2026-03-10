import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/settings";

function App() {
    <Toaster position="top-right" />
// Shared History State
  const [history, setHistory] = useState([]);
 // Load history from localStorage once
useEffect(() => {
  const savedHistory = localStorage.getItem("predictionHistory");
  if (savedHistory && savedHistory !== "undefined") {
    try {
      setHistory(JSON.parse(savedHistory));
    } catch {
      setHistory([]);
    }
    }},[]);
// Save history whenever it changes
useEffect(() => {
  localStorage.setItem("predictionHistory", JSON.stringify(history));
}, [history]);



  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard history={history} setHistory={setHistory} />} />
        <Route path="analytics" element={<Analytics history={history} />} />
        <Route path="Alerts" element={<Alerts />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
