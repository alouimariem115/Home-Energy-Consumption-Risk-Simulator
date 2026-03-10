import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PredictionForm from "../components/prediction/PredictionForm";
import PredictionResult from "../components/prediction/PredictionResult";
import toast from "react-hot-toast";
import { predictEnergy } from "../services/predictionService";
import {useAlerts} from "../context/AlertsContext";

export default function Dashboard({history, setHistory}) {
  // Shared state from MainLayout
  const {result, setResult } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const {setAlerts} = useAlerts();
  

  async function handlePrediction(formData) {
    setLoading(true);
    setResult(null);
    setSelectedAppliance(formData.appliance_type);

    // Call backend
    const data = await predictEnergy(formData);
    setResult(data);

if (data.decision === "HIGH") {
    toast.error("⚠ HIGH Energy Risk Detected! Reduce appliance usage.");
    
    const newAlert = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      appliance: formData.appliance_type,
      probability: (data.probability_high * 100).toFixed(1),
      message: "⚠ High energy consumption risk detected",
      seen: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    } else {
      toast.success("✅ Energy usage is NORMAL.");
    }

    // Save into history table
    const newEntry = 
      { id: Date.now(),
        date: new Date().toISOString(),
        appliance: formData.appliance_type,
        probability: (data.probability_high),
        decision: data.decision,
      };

    setHistory(prev => [newEntry, ...prev]);

    setLoading(false);
  }

  return (
    
    <div className="grid grid-cols-3 gap-6">
      <PredictionForm 
      onPredict={handlePrediction} 
      loading={loading} 
      />

      <PredictionResult 
      result={result}
      selectedAppliance={selectedAppliance}
      />
    </div>
  );
}
