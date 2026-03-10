import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function MainLayout() {
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);

  return (
    <DashboardLayout>
      {/* Pass state to child pages */}
      <Outlet context={{ history, setHistory, result, setResult }} />
    </DashboardLayout>
  );
}
