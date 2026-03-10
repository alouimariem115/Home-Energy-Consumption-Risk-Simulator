import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProbabilityTrendChart({ history }) {
  const data = history
    .slice(0, 10)
    .reverse()
    .map((h, index) => ({
      name: index + 1,
      probability: (h.probability * 100).toFixed(1),
    }));

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-6">
      <h2 className="font-bold mb-4">📈 Probability Trend (Last 10)</h2>

      <LineChart width={500} height={250} data={data}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line dataKey="probability" />
      </LineChart>
    </div>
  );
}

