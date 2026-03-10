import { Link} from "react-router-dom";
import { useAlerts } from "../../context/AlertsContext";

export default function Sidebar() {
  const { unseenCount } = useAlerts();
  
  return (
    <aside className="w-20 bg-primary text-white flex flex-col items-center py-6 space-y-8">
      <h1 className="text-2xl font-bold">⚡</h1>

      <Link to="/" className="text-xl">
        🏠
      </Link>

      <Link to="/analytics" className="text-xl">
        📊
      </Link>
      
      <Link to="/alerts" className="relative text-xl" title="Saved HIGH-risk simulations">
        💾
        {unseenCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {unseenCount}
          </span>
        )}
      </Link>
      
      <Link to="/settings" className="text-xl">
        ⚙️
      </Link>
    </aside>
  );
}
