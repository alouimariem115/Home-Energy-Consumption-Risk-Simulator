import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">
        <Header />
        {children}
      </main>
    </div>
  );
}
