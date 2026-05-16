import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useApp } from '../../context/AppContext';
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight,
  Clock, User, Scissors, X, Calendar as CalendarIcon, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  attended: 'info',
  cancelled: 'danger',
  no_show: 'danger',
};

const statusLabels = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  attended: 'Atendida',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export default function Appointments() {
  const { appointments, clients, addAppointment, updateAppointmentStatus, deleteAppointment } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('day');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePreviousDay = () => {
    setSelectedDate(prev => new Date(prev.getTime() - 24*60*60*1000));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => new Date(prev.getTime() + 24*60*60*1000));
  };

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    service: '',
    date: selectedDate.toISOString().split('T')[0],
    time: '',
    employee: '',
    status: 'pending'
  });

  const dateString = selectedDate.toISOString().split('T')[0];
  const filtered = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDate = apt.date === dateString;
    const client = clients.find(c => c.id === apt.clientId);
    const matchesSearch = !searchTerm || (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesDate && matchesSearch;
  });

  const handleSaveAppointment = () => {
    if (!formData.clientId || !formData.date || !formData.time) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    addAppointment(formData);
    toast.success('Cita creada exitosamente');
    setShowModal(false);
    setFormData({ clientId: '', service: '', date: '', time: '', employee: '', status: 'pending' });
  };

  const changeStatus = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    toast.success(`Cita actualizada a ${statusLabels[newStatus]}`);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      deleteAppointment(id);
      toast.error('Cita eliminada');
    }
  };

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Gestioná tus citas y horarios">
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['day', 'week', 'month'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={16} /> Nueva cita
          </button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="input-field pl-9" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="input-field w-auto">
          <option>Todos los empleados</option>
          <option>María</option>
          <option>Sofía</option>
          <option>Valentina</option>
        </select>
        <div className="flex gap-1.5">
          {['all', 'pending', 'confirmed', 'attended', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filterStatus === s
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === 'all' ? 'Todos' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 mb-4 flex items-center justify-between">
        <button 
          onClick={handlePreviousDay}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            {selectedDate.toLocaleDateString('es-AR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <p className="text-sm text-gray-500">{filtered.length} citas</p>
        </div>
        <button 
          onClick={handleNextDay}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No hay citas"
            description="No se encontraron citas con los filtros seleccionados"
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(apt => {
              const client = clients.find(c => c.id === apt.clientId);
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                >
                  <div className="w-16 text-center shrink-0">
                    <p className="text-lg font-bold text-gray-900 font-display">{apt.time}</p>
                  </div>
                  <div className={`w-1.5 h-12 rounded-full shrink-0 ${
                    apt.status === 'confirmed' ? 'bg-green-400' :
                    apt.status === 'pending' ? 'bg-amber-400' :
                    apt.status === 'attended' ? 'bg-blue-400' :
                    'bg-red-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-gray-400 shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{client?.name || 'Cliente desconocido'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scissors size={14} className="text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600">{apt.service}</span>
                      <span className="text-xs text-gray-400">· {apt.employee}</span>
                    </div>
                  </div>
                  <Badge variant={statusColors[apt.status]}>
                    {statusLabels[apt.status]}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => changeStatus(apt.id, 'confirmed')}
                      className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
                      title="Confirmar"
                    >
                      <Clock size={14} />
                    </button>
                    <button 
                      onClick={() => changeStatus(apt.id, 'cancelled')}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" 
                      title="Cancelar"
                    >
                      <X size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" 
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva cita"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSaveAppointment} className="btn-primary">Guardar cita</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="input-label">Cliente</label>
            <select 
              className="input-field" 
              value={formData.clientId} 
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Seleccionar cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Servicio</label>
            <input 
              className="input-field" 
              placeholder="Ej: Corte + Peinado" 
              value={formData.service}
              onChange={e => setFormData({...formData, service: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Fecha</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="input-label">Hora</label>
              <input 
                type="time" 
                className="input-field" 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="input-label">Empleado</label>
            <select 
              className="input-field" 
              value={formData.employee}
              onChange={e => setFormData({...formData, employee: e.target.value})}
            >
              <option value="">Seleccionar empleado...</option>
              <option value="María">María</option>
              <option value="Sofía">Sofía</option>
              <option value="Valentina">Valentina</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
