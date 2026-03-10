import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function RiskPieChart({ history }) {
  const high = history.filter((h) => h.decision === "HIGH").length;
  const normal = history.filter((h) => h.decision === "NORMAL").length;

  const data = [
    { name: "HIGH", value: high },
    { name: "NORMAL", value: normal },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-xl mb-6">
      <h3 className="font-bold mb-4">⚡ Risk Distribution</h3>

      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" outerRadius={90} label>
          <Cell />
          <Cell />
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
}
