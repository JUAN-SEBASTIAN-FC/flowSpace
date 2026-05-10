import React, { useState } from 'react';
import {
  Store, Clock, Users, CreditCard, Palette, Save,
  Edit, Trash2, Plus, Upload, Check, Settings as SettingsIcon,
  ChevronRight, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import { PageHeader, PageSection } from '../../components/ui/PageComponents';

export default function Settings() {
  // --- Estado de la configuración ---
  const [activeTab, setActiveTab] = useState('negocio');
  const [loading, setLoading] = useState(false);

  // Datos de ejemplo (sustituir por datos reales del backend)
  const [businessName, setBusinessName] = useState('Gentleman Barber Shop');
  const [email, setEmail] = useState('contacto@gentlemanbarber.com');
  const [phone, setPhone] = useState('+54 11 1234-5678');
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop');
  const [theme, setTheme] = useState('primary-indigo');

  // Servicios
  const [services, setServices] = useState([
    { id: 1, name: 'Corte de Cabello Clásico', price: 1500, duration: 45, active: true },
    { id: 2, name: 'Recorte de Barba + Spa', price: 1000, duration: 30, active: true },
    { id: 3, name: 'Corte Gentleman (Cabello + Barba)', price: 2200, duration: 75, active: true },
  ]);

  // Empleados
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Facundo Rossi', role: 'Barbero Senior', services: 12, active: true },
    { id: 2, name: 'Julián Gómez', role: 'Barbero Junior', services: 8, active: true },
    { id: 3, name: 'Martín Paez', role: 'Estilista', services: 10, active: false },
  ]);

  // --- Handlers ---
  const handleSave = () => {
    setLoading(true);
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      toast.success('Configuración guardada exitosamente');
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setLogoUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setLogo(file);
    }
  };

  const toggleEmployee = (id) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  const toggleTab = (tab) => setActiveTab(tab);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <PageHeader
        title="Configuración"
        subtitle="Administra tu negocio, servicios y preferencias del sistema."
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save size={18} />
          )}
          <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Sidebar de Configuración */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="card p-2 sticky top-24">
            <nav className="space-y-1">
              {[
                { id: 'negocio', label: 'Mi Negocio', icon: Store },
                { id: 'horarios', label: 'Horarios', icon: Clock },
                { id: 'servicios', label: 'Servicios', icon: Plus },
                { id: 'empleados', label: 'Equipo', icon: Users },
                { id: 'pagos', label: 'Pagos y Facturas', icon: CreditCard },
                { id: 'apariencia', label: 'Apariencia', icon: Palette },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleTab(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group
                    ${activeTab === item.id
                      ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={activeTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={`${activeTab === item.id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Mi Negocio */}
            {activeTab === 'negocio' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <PageSection title="Perfil del Negocio">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full flex items-center gap-6 pb-4 border-b border-gray-50">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-primary-500 transition-colors">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Store size={32} className="text-gray-400" />
                          )}
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-2xl">
                            <Upload size={20} className="text-white" />
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                          </label>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Logo del Negocio</h4>
                        <p className="text-xs text-gray-500 mt-1">Recomendado: 400x400px, PNG o JPG.</p>
                        <button className="text-xs font-semibold text-primary-600 mt-2 hover:underline">Eliminar logo</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="input-label">Nombre del Negocio</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="input-field"
                        placeholder="Ej. Gentleman Barber Shop"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="input-label">Email de Contacto</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="ejemplo@negocio.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="input-label">Teléfono</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                        placeholder="+54..."
                      />
                    </div>
                  </div>
                </PageSection>

                <PageSection title="Ubicación">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="input-label">Dirección</label>
                      <input type="text" className="input-field" placeholder="Av. Siempre Viva 123" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="input-label">Ciudad</label>
                        <input type="text" className="input-field" placeholder="Buenos Aires" />
                      </div>
                      <div className="space-y-2">
                        <label className="input-label">Código Postal</label>
                        <input type="text" className="input-field" placeholder="1425" />
                      </div>
                    </div>
                  </div>
                </PageSection>
              </div>
            )}

            {/* Servicios */}
            {activeTab === 'servicios' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Gestión de Servicios</h3>
                  <button className="btn-primary flex items-center gap-2 py-1.5 px-3 text-sm">
                    <Plus size={16} />
                    Nuevo Servicio
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="card p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                          <SettingsIcon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{service.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 font-medium">${service.price}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500 font-medium">{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={service.active ? "success" : "danger"}>
                          {service.active ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-600">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empleados */}
            {activeTab === 'empleados' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Equipo de Trabajo</h3>
                  <button className="btn-primary flex items-center gap-2 py-1.5 px-3 text-sm">
                    <Plus size={16} />
                    Añadir Miembro
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((emp) => (
                    <div key={emp.id} className="card p-5 relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1 h-full ${emp.active ? 'bg-success' : 'bg-gray-300'}`}></div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <Users size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">{emp.name}</h4>
                            <p className="text-xs text-gray-500">{emp.role}</p>
                          </div>
                        </div>
                        <Badge variant={emp.active ? "success" : "danger"}>
                          {emp.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <SettingsIcon size={12} /> {emp.services} servicios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Full-time
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => toggleEmployee(emp.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                            ${emp.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {emp.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button className="text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
                          Editar Perfil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apariencia */}
            {activeTab === 'apariencia' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <PageSection title="Personalización Visual">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Color de Marca Principal</h4>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { id: 'primary-indigo', color: '#6366f1' },
                          { id: 'primary-blue', color: '#3b82f6' },
                          { id: 'primary-green', color: '#22c55e' },
                          { id: 'primary-purple', color: '#a855f7' },
                          { id: 'primary-rose', color: '#f43f5e' },
                        ].map((item) => (
                          <div key={item.id} className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => setTheme(item.id)}
                              className={`w-12 h-12 rounded-2xl border-4 transition-all flex items-center justify-center
                                ${theme === item.id
                                  ? 'border-white ring-2 ring-primary-500 scale-110 shadow-lg'
                                  : 'border-transparent hover:scale-105'}`}
                              style={{ backgroundColor: item.color }}
                            >
                              {theme === item.id && <Check size={20} className="text-white" />}
                            </button>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.id.split('-')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Palette size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Vista Previa</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="h-4 w-2/3 bg-gray-100 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-50 rounded mb-4"></div>
                        <button className="btn-primary py-1.5 px-4 text-xs" style={{ backgroundColor: theme.includes('indigo') ? '' : `var(--${theme}-500)` }}>
                          Botón de Prueba
                        </button>
                      </div>
                    </div>
                  </div>
                </PageSection>
              </div>
            )}

            {/* Otros tabs (horarios, pagos) */}
            {(activeTab === 'horarios' || activeTab === 'pagos') && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="card p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <SettingsIcon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Módulo en Construcción</h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-2">
                    Estamos trabajando para traerte la mejor experiencia en la gestión de {activeTab}.
                  </p>
                  <button
                    onClick={() => setActiveTab('negocio')}
                    className="mt-6 text-sm font-bold text-primary-600 flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Volver al perfil <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}