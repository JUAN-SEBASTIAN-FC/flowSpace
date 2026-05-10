import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Settings, LogOut, User, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { user, business, logout } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 transition-all">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar clientes, citas, productos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50
              text-sm text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
              transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-500 hover:text-primary-600 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-premium border border-gray-100 p-2 animate-slide-up z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-900">Notificaciones</p>
              </div>
              <div className="py-10 text-center px-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                  <Bell size={24} />
                </div>
                <p className="text-sm text-gray-500">No hay notificaciones nuevas</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 pl-1.5 pr-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">
                {business?.type || 'Admin'}
              </p>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-gray-400 transition-transform" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-premium border border-gray-100 p-2 animate-slide-up z-50">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="grid gap-1">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
                >
                  <User size={16} className="text-gray-400" />
                  Mi perfil
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
                >
                  <Settings size={16} className="text-gray-400" />
                  Configuración
                </button>
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                      text-red-500 hover:bg-red-50 transition-all duration-150"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
