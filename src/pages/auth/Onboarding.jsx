import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Store, Scissors, Stethoscope, Dumbbell, StethoscopeIcon,
  Wrench, Utensils, Check, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const businessTypes = [
  { id: 'peluqueria',   label: 'Peluquería',   icon: Scissors,  color: 'bg-pink-50 text-pink-600' },
  { id: 'clinica',      label: 'Clínica',       icon: Stethoscope, color: 'bg-blue-50 text-blue-600' },
  { id: 'gimnasio',     label: 'Gimnasio',      icon: Dumbbell, color: 'bg-orange-50 text-orange-600' },
  { id: 'consultorio',  label: 'Consultorio',   icon: StethoscopeIcon, color: 'bg-teal-50 text-teal-600' },
  { id: 'taller',       label: 'Taller',        icon: Wrench, color: 'bg-amber-50 text-amber-600' },
  { id: 'restaurante',  label: 'Restaurante',   icon: Utensils, color: 'bg-red-50 text-red-600' },
];

const allModules = [
  { id: 'appointments', label: 'Agenda de citas',     recommended: true },
  { id: 'clients',      label: 'Clientes',            recommended: true },
  { id: 'inventory',    label: 'Inventario',          recommended: false },
  { id: 'billing',      label: 'Facturación',         recommended: true },
  { id: 'reminders',    label: 'Recordatorios',       recommended: false },
  { id: 'whatsapp',     label: 'WhatsApp integrado',  recommended: true },
  { id: 'reports',      label: 'Reportes',            recommended: false },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedModules, setSelectedModules] = useState(
    allModules.filter(m => m.recommended).map(m => m.id)
  );
  const [businessName, setBusinessName] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const toggleModule = (id) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    login(
      { name: 'María González', email: 'maria@stylestudio.com' },
      { name: businessName || 'Mi Negocio', type: businessTypes.find(b => b.id === selectedType)?.label || 'Negocio' }
    );
    toast.success('¡Tu negocio está listo para operar!');
    navigate('/dashboard');
  };

  return (
    <div className="card p-8 animate-in">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${s <= step ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <h1 className="text-xl font-bold text-gray-900 font-display text-center mb-2">
            ¿Qué tipo de negocio tenés?
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">Elegí la opción que mejor describa tu actividad</p>
          <div className="grid grid-cols-2 gap-3">
            {businessTypes.map(bt => (
              <button
                key={bt.id}
                onClick={() => setSelectedType(bt.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-150
                  ${selectedType === bt.id
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <div className={`p-3 rounded-xl ${bt.color}`}>
                  <bt.icon size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">{bt.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedType}
            className="btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2"
          >
            Continuar <ChevronRight size={16} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-xl font-bold text-gray-900 font-display text-center mb-2">
            Datos de tu negocio
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">Así van a ver tu negocio tus clientes</p>
          <div className="space-y-4">
            <div>
              <label className="input-label">Nombre del negocio</label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="input-field"
                placeholder="Style Studio"
              />
            </div>
            <div>
              <label className="input-label">Teléfono WhatsApp</label>
              <input type="tel" className="input-field" placeholder="+54 11 1234-5678" />
            </div>
            <div>
              <label className="input-label">Dirección</label>
              <input className="input-field" placeholder="Av. Principal 123" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">Atrás</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Continuar <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-xl font-bold text-gray-900 font-display text-center mb-2">
            Activá tus módulos
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">Podés cambiarlos después desde Configuración</p>
          <div className="space-y-2">
            {allModules.map(mod => (
              <button
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-150
                  ${selectedModules.includes(mod.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                  ${selectedModules.includes(mod.id)
                    ? 'bg-primary-600 border-primary-600'
                    : 'border-gray-300'}`}
                >
                  {selectedModules.includes(mod.id) && <Check size={12} className="text-white" />}
                </div>
                <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                {mod.recommended && (
                  <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium ml-auto">
                    Recomendado
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">Atrás</button>
            <button onClick={handleFinish} className="btn-primary flex-1">
              Comenzar a usar FlowSpace
            </button>
          </div>
        </>
      )}
    </div>
  );
}