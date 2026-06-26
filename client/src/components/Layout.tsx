import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#02040a] overflow-hidden relative">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-64 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none" style={{ animation: 'ambient-drift 20s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(124,58,237,0.025)_0%,transparent_70%)] pointer-events-none" style={{ animation: 'ambient-drift 25s ease-in-out infinite 5s' }} />

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative z-10">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
