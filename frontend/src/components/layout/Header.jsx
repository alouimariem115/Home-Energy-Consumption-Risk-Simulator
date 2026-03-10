
import {useAlerts} from "../../context/AlertsContext";



export default function Header() {
  const { unseenCount } = useAlerts();
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Smart Home Energy Risk Simulator
      </h2>

      <div className="text-gray-500">👤 Mariem
      {unseenCount > 0 && (
              <span className="relative bottom-3 left-0 bg-red-500 text-white text-xs px-2 rounded-full">
                {unseenCount}
              </span>
              )}
              </div>
    </div>
  );
}
