import RecommendationBox from "./RecommendationBox";
import ShapExplanation from "./ShapExplanation";

export default function PredictionResult({ result, selectedAppliance }) {
  if (!result)
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        Submit data to see prediction.
      </div>
    );

  const probabilityHigh = result.probability_high * 100;
  const confidence =
    result.decision === "HIGH"
      ? probabilityHigh
      : 100 - probabilityHigh;

  const thresholdPercent = (result.threshold_used * 100).toFixed(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
      <h3 className="text-lg font-semibold">Risk Simulation Result</h3>
      <div className="flex items-center gap-6 mb-2">
        <div className="text-5xl font-bold text-primary">
          {probabilityHigh.toFixed(1)}%
        </div>

        {/* Decision */}
        <div
          className={`px-5 py-2 rounded-xl text-white text-lg font-bold ${
            result.decision === "HIGH" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {result.decision}
        </div>
      </div>

      {/* Risk Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>LOW</span>
          <span>
            HIGH (threshold {thresholdPercent}
            %)
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              probabilityHigh >= Number(thresholdPercent)
                ? "bg-red-500"
                : "bg-green-500"
            }`}
            style={{ width: `${probabilityHigh}%` }}
          ></div>
        </div>
      </div>

      {/* Confidence and threshold */}
      <div className="flex items-center gap-3 mb-2 mt-2">
        <p className="text-gray-700">
          <span className="font-semibold">Model confidence:</span>{" "}
          {confidence.toFixed(1)}%
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Decision threshold:</span>{" "}
          {thresholdPercent}%
        </p>
      </div>

      <p className="text-sm text-gray-600">
        The AI predicts the probability of HIGH consumption. If this probability
        is above the decision threshold, the outcome is classified as HIGH;
        otherwise it is NORMAL.
      </p>

      <RecommendationBox
        decision={result.decision}
        appliance={selectedAppliance}
      />
      <ShapExplanation features={result.top_features} />
    </div>
  );
}
