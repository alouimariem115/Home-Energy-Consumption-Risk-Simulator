import { useState, useEffect } from "react";

export default function Settings() {
  const [threshold, setThreshold] = useState(0.1);

  // ✅ Load threshold from backend
  useEffect(() => {
    fetch("http://localhost:8000/get-threshold")
      .then(res => res.json())
      .then(data => {
        setThreshold(data.current_threshold);
      })
      .catch(err => console.error(err));
  }, []);

  // ✅ Save threshold to backend
  async function handleSave() {
    try {
      const response = await fetch("http://localhost:8000/set-threshold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  threshold: threshold
}),
      });
      
 // 🔎 Check if request failed
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(errorText);
    }
      const data = await response.json();
      alert("✅ Threshold updated to " + data.current_threshold);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update threshold");
    }
  }

  // ✅ Reset threshold
  async function handleReset() {
    try {
      const response = await fetch("http://localhost:8000/reset-threshold", {
        method: "POST",
      });

      const data = await response.json();
      setThreshold(data.current_threshold);
      alert("🔄 Threshold reset to default");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to reset threshold");
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">
          Decision Threshold Control
        </h3>

        <p className="text-gray-600 text-sm">
          The AI flags HIGH consumption when probability exceeds this threshold.
        </p>

        <input
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full"
        />

        <p className="text-xl font-bold text-primary">
          Current Threshold: {threshold.toFixed(2)}
        </p>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white py-2 rounded-xl font-semibold hover:opacity-90"
        >
          Save Threshold
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-gray-500 text-white py-2 rounded-xl font-semibold hover:opacity-90"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}