import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Store, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular login
    await new Promise(r => setTimeout(r, 800));

    login(
      { name: 'María González', email },
      { name: 'Style Studio', type: 'Peluquería' }
    );

    toast.success('¡Bienvenida de vuelta!');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="card p-8 animate-in">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/20">
          <Store size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">FlowSpace</h1>
        <p className="text-sm text-gray-500 mt-1">Plataforma de Gestión Inteligente</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="input-label">Correo electrónico</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="tu@negocio.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="input-label">Contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field pl-10 pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Recordarme
          </label>
          <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">¿No tenés cuenta?</span>
        </div>
      </div>

      <Link
        to="/register"
        className="btn-secondary w-full py-3 text-center block text-base"
      >
        Crear cuenta gratis
      </Link>
    </div>
  );
}