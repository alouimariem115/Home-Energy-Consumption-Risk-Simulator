import { useEffect } from "react";
import { useAlerts } from "../context/AlertsContext";

export default function Alerts() {
  const {alerts, setAlerts} = useAlerts();

  useEffect(() => {
    const updated = alerts.map((a) => ({
      ...a,
      seen: true,
    }));

    setAlerts(updated);
  }, [setAlerts, alerts]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">
        💾 Saved HIGH-risk simulations
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        These are past simulation runs where the model classified the energy
        consumption risk as HIGH. Use them as reference scenarios for
        comparison.
      </p>
  {alerts.length > 0 && (
        <button
          onClick={() => setAlerts([])}
          className="mt-6 mb-6 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Clear saved simulations
        </button>
      )}


      {alerts.length === 0 ? (
        <p className="text-gray-500">
          No HIGH-risk simulations saved yet. Run a simulation on the dashboard
          and any HIGH-risk result will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-red-300 bg-red-50"
            >
              <p className="font-semibold text-red-600">
                 {alert.message}
              </p>

              <p className="text-sm text-gray-600">
                Appliance: <b>{alert.appliance}</b>
              </p>

              <p className="text-sm text-gray-600">
                Probability: <b>{alert.probability}%</b>
              </p>

              <p className="text-sm text-gray-400">
                Date: {alert.date}
              </p>
            </div>
          ))}
        </div>
      )}

    
    </div>
  );
}
