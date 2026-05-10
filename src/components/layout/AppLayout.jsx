import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function AppLayout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header />
        <main className="flex-1 p-6 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}