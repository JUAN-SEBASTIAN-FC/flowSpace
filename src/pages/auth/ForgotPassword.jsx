import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    toast.success('Revisá tu correo para restablecer tu contraseña.');
    setLoading(false);
  };

  return (
    <div className="card p-8 animate-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/20">
          <Store size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Recuperar contraseña</h1>
        <p className="text-sm text-gray-500 mt-1">
          {sent ? 'Correo enviado ✅' : 'Te enviaremos un enlace de recuperación'}
        </p>
      </div>

      {sent ? (
        <>
          <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 mb-4">
            Enviamos un correo a <strong>{email}</strong> con las instrucciones.
            Si no lo ves, revisá tu carpeta de spam.
          </div>
          <Link to="/login" className="btn-primary w-full py-3 text-center block">
            Volver al inicio de sesión
          </Link>
        </>
      ) : (
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
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}

      <Link to="/login" className="btn-ghost w-full mt-4 flex items-center justify-center gap-2">
        <ArrowLeft size={16} /> Volver al inicio de sesión
      </Link>
    </div>
  );
}