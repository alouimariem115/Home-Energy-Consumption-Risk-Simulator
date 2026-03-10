import { formatFeatureName } from "../../utils/formatFeature";

export default function ShapExplanation({ features }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="bg-gray-100 p-4 rounded-xl">
      <h2 className="font-bold mb-3">
        🔍 Top factors influencing HIGH energy risk
      </h2>
      {/* Legend */}
      <div className="flex gap-4 text-sm mb-3">
        <span className="text-red-600 font-medium">⬆ increases risk</span>
        <span className="text-green-600 font-medium">⬇ decreases risk</span>
      </div>
      <ul className="space-y-3">
        {features.map((f, i) => {
          const contribution = f.impact;
          const barWidth = Math.min(Math.abs(contribution) * 100, 100);
          return (
            <li key={i} className="bg-white p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">
                  {formatFeatureName(f.Feature)}
                </span>
                <span
                  className={
                    contribution > 0
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {contribution.toFixed(3)}
                </span>
              </div>
              {/* Impact bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    contribution > 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        Positive values push the AI toward a HIGH risk decision for this
        scenario, while negative values push it toward NORMAL.
      </p>
    </div>
  );
}
