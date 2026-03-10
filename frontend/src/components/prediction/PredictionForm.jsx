import { useState } from "react";

export default function PredictionForm({ onPredict, loading }) {
  const [formData, setFormData] = useState({
    household_size: "",
    outdoor_temperature: "",
    appliance_type: "",
    timestamp: "",
  });

  const appliances = [
    "Heater",
    "Fridge",
    "Lights",
    "Computer",
    "TV",
    "Microwave",
    "Dishwasher",
    "Washing Machine",
    "Oven",
  ];


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !formData.household_size ||
      !formData.outdoor_temperature ||
      !formData.appliance_type ||
      !formData.timestamp
    ) {
      alert("Please fill in all fields before predicting.");
      return;
    }   
    const size = Number(formData.household_size);

if (!Number.isInteger(size) || size <= 0) {
  alert("Household size must be a positive integer.");
  return;
}
    onPredict(formData);
  }

  return (
    <div className="col-span-2 bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-semibold mb-2">
        Energy Consumption Risk Simulator
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Choose a household size, outdoor temperature, appliance, and time to
        simulate how likely your energy consumption would be classified as
        HIGH. This does not control real devices; it helps you explore
        different what-if scenarios.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
                <label className="text-sm font-medium text-gray-600">
                  Household Size
                </label>
        <input
          type="number"
          name="household_size"
          value={formData.household_size}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          min="1"
          step="1"
          required
          onInvalid={(e) =>
            e.target.setCustomValidity(
              "Household size must be a positive integer (minimum 1)."
            )
          }
          onInput={(e) => e.target.setCustomValidity("")}
          inputMode="numeric"
          placeholder="Enter household size..."
        />
        </div>

        <div>
                <label className="text-sm font-medium text-gray-600">
                  Outdoor Temperature (°C)
                </label>
        <input
          type="number"
          name="outdoor_temperature"
          value={formData.outdoor_temperature}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          placeholder="Enter temperature..."
        />
        </div>

        <div>
                <label className="text-sm font-medium text-gray-600">
                  Appliance Type
                </label>
        <select
          name="appliance_type"
          value={formData.appliance_type}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        >
          <option value="" disabled>
              Select an appliance...
            </option>
          {appliances.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        </div>

        <div>
                <label className="text-sm font-medium text-gray-600">
                  Timestamp
                </label>
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {loading ? "Simulating..." : "Run Risk Simulation"}
        </button>
      </form>
    </div>
  );
}
