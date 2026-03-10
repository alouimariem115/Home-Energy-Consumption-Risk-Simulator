

export default function PredictionHistoryTable({ history }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6">
        📊 Prediction History
      </h3>

      {history.length === 0 ? (
        <p className="text-gray-400">
          No predictions yet. Run a prediction first.
        </p>
      ) : (
        <table className="w-full border-collapse overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Appliance</th>
              <th className="p-3">Probability</th>
              <th className="p-3">Decision</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{h.date}</td>
                <td className="p-3">{h.appliance}</td>

                <td className="p-3 font-semibold">
                  {(h.probability * 100).toFixed(1)}%
                </td>

                <td
                  className={`p-3 font-bold ${
                    h.decision === "HIGH"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {h.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
