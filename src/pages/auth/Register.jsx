import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, Mail, Lock, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', businessName: '', email: '', password: '', confirmPassword: ''
  });

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('¡Cuenta creada! Ahora configurá tu negocio.');
    navigate('/onboarding');
    setLoading(false);
  };

  return (
    <div className="card p-8 animate-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/20">
          <Store size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          {step === 1 ? 'Crear cuenta' : 'Datos del negocio'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {step === 1 ? 'Comenzá gratis en 2 pasos' : 'Paso 2 de 2'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label className="input-label">Nombre completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.name} onChange={update('name')} className="input-field pl-10" placeholder="María González" required />
              </div>
            </div>
            <div>
              <label className="input-label">Correo electrónico</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={update('email')} className="input-field pl-10" placeholder="tu@negocio.com" required />
              </div>
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.password} onChange={update('password')} className="input-field pl-10" placeholder="Mínimo 8 caracteres" required minLength={8} />
              </div>
            </div>
            <div>
              <label className="input-label">Confirmar contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className="input-field pl-10" placeholder="Repetí tu contraseña" required />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="input-label">Nombre de tu negocio</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.businessName} onChange={update('businessName')} className="input-field pl-10" placeholder="Style Studio" required />
              </div>
            </div>
            <div>
              <label className="input-label">Tipo de negocio</label>
              <select className="input-field" required>
                <option value="">Seleccionar tipo...</option>
                <option>Peluquería</option>
                <option>Clínica</option>
                <option>Gimnasio</option>
                <option>Consultorio</option>
                <option>Taller</option>
                <option>Restaurante</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="input-label">Teléfono (WhatsApp)</label>
              <input type="tel" className="input-field" placeholder="+54 11 1234-5678" />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Creando...' : step === 1 ? 'Continuar' : 'Crear cuenta'}
        </button>
      </form>

      {step === 2 && (
        <button onClick={() => setStep(1)} className="btn-ghost w-full mt-4 flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Volver
        </button>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Iniciar sesión</Link>
      </p>
    </div>
  );
}