import { useState } from "react";
import RiskPieChart from "../components/charts/RiskPieChart";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
 
} from "recharts";

export default function Analytics({ history }) {
  const [filter, setFilter] = useState("ALL");

  const total = history.length;

  const highCount = history.filter((h) => h.decision === "HIGH").length;
  const normalCount = total - highCount;

  const avgProbability =
    total > 0
      ? (
          (history.reduce((sum, h) => sum + Number(h.probability), 0) /
            total) *
          100
        ).toFixed(1)
      : 0;

  // ✅ Filtered History
  const filteredHistory =
    filter === "ALL"
      ? history
      : history.filter((h) => h.appliance === filter);

  // ✅ Prepare Data for Line Chart
  const chartData = filteredHistory.map((item, index) => ({
    name: `${index + 1}`, // prediction number
    probability: (item.probability * 100).toFixed(1),
    appliance: item.appliance,
    decision: item.decision,
  }));

  function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded-lg shadow">
        <p className="font-bold">🔍 Prediction Details</p>

        <p className="text-sm">
          Appliance: <b>{data.appliance}</b>
        </p>

        <p className="text-sm">
          Decision:{" "}
          <b className={data.decision === "HIGH" ? "text-red-600" : "text-green-600"}>
            {data.decision}
          </b>
        </p>

        <p className="text-sm">
          Probability: <b>{data.probability}%</b>
        </p>
      </div>
    );
  }

  return null;
}


  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        📊 Energy Risk Simulation Analytics
      </h2>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">Total Simulations</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="p-4 bg-red-50 shadow rounded-xl">
          <p className="text-gray-500 text-sm">HIGH-risk simulations</p>
          <p className="text-2xl font-bold text-red-600">{highCount}</p>
        </div>

        <div className="p-4 bg-green-50 shadow rounded-xl">
          <p className="text-gray-500 text-sm">NORMAL Events</p>
          <p className="text-2xl font-bold text-green-600">{normalCount}</p>
        </div>

        <div className="p-4 bg-purple-50 shadow rounded-xl">
          <p className="text-gray-500 text-sm">Average Probability</p>
          <p className="text-2xl font-bold text-purple-600">
            {avgProbability}%
          </p>
        </div>
      </div>

      {/* ✅ Filter Dropdown */}
      <div className="mb-6">
        <label className="font-semibold mr-2">Filter by Appliance:</label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="ALL">All Appliances</option>

          {[...new Set(history.map((h) => h.appliance))].map(
            (appliance, i) => (
              <option key={i} value={appliance}>
                {appliance}
              </option>
            )
          )}
        </select>
      </div>

      {/* ✅ Pie Chart */}
      <div className="mb-10 flex justify-center">
        <RiskPieChart history={filteredHistory} />
      </div>

      {/* ✅ Line Chart Upgrade */}
      {filteredHistory.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-bold mb-4">
            📈 Simulated HIGH-risk probability over time
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {/* Grid */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X Axis Label */}
              <XAxis
                dataKey="name"
                label={{
                  value: "Simulation number",
                  position: "bottom",
                  offset: 8,
                }}
              />

              {/* Y Axis Label */}
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "Probability (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              {/* Tooltip */}
              <Tooltip
                content={CustomTooltip}
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Simulation ${label}`}
              />

              

              {/* Line */}
              <Line 
                
                type="monotone"
                dataKey="probability"
                stroke="#2563eb"
                strokeWidth={3}
                
                dot={({ payload }) =>
                  payload.decision === "HIGH" ? (
                    <circle r={6} fill="red" />
                  ) : (
                    <circle r={6} fill="green" />
                  )
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ History Table */}
      {filteredHistory.length === 0 ? (
        <p className="text-gray-400">
          No simulations yet. Go back to the dashboard to run a risk simulation.
        </p>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Appliance</th>
              <th className="p-3 text-left">Probability</th>
              <th className="p-3 text-left">Decision</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.map((item, index) => {
                console.log(item.date);
              const dateObj = new Date(item.date);
              const date = dateObj.toLocaleDateString("en-GB");
              const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            
            return(
              <tr key={index} className="border-t">
                <td className="p-3">{date}</td>
                <td className="p-3">{time}</td>
                <td className="p-3">{item.appliance}</td>
                <td className="p-3">
                  {(item.probability * 100).toFixed(1)}%
                </td>
                <td className="p-3 font-semibold">{item.decision}</td>
              </tr>
            );
})}
          </tbody>
        </table>
      )}

      {/* ✅ Clear History Button */}
      <button
        onClick={() => {
          localStorage.removeItem("predictionHistory");
          window.location.reload();
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Clear History
      </button>
    </div>
  );
}
