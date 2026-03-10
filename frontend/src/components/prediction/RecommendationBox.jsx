export default function RecommendationBox({ decision, appliance }) {
  if (decision !== "HIGH") return null;

  let recommendation = "";

  switch (appliance) {
    case "Heater":
      recommendation = "Reduce heater usage or delay until off-peak hours.";
      break;
    case "Oven":
      recommendation = "Avoid using oven during peak hours. Consider later usage.";
      break;
    case "Microwave":
      recommendation = "Energy spike detected. Limit repeated microwave usage.";
      break;
    default:
      recommendation =
        "High energy risk detected. Consider delaying appliance usage.";
  }

  return (
    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-300">
      <h3 className="text-lg font-semibold text-red-700">
        💡 Recommendation
      </h3>
      <p className="text-sm text-gray-700 mt-2">{recommendation}</p>
    </div>
  );
}
