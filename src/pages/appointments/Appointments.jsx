import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight,
  Clock, User, Scissors, X, Calendar as CalendarIcon
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

const appointments = [
  { id: 1, client: 'Laura Martínez', service: 'Corte + Peinado', employee: 'María', date: '2026-05-09', time: '10:30', status: 'confirmed' },
  { id: 2, client: 'Carlos Ruiz', service: 'Coloración', employee: 'Sofía', date: '2026-05-09', time: '11:00', status: 'confirmed' },
  { id: 3, client: 'Ana López', service: 'Manicura', employee: 'Sofía', date: '2026-05-09', time: '12:15', status: 'pending' },
  { id: 4, client: 'Pedro Sánchez', service: 'Barba', employee: 'María', date: '2026-05-09', time: '14:00', status: 'confirmed' },
  { id: 5, client: 'Lucía Fernández', service: 'Peinado', employee: 'Valentina', date: '2026-05-09', time: '15:30', status: 'attended' },
  { id: 6, client: 'Diego Morales', service: 'Corte', employee: 'María', date: '2026-05-08', time: '16:00', status: 'cancelled' },
];

export default function Appointments() {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('day');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Gestioná tus citas y horarios">
        <div className="flex items-center gap-3">
          {/* View toggle */}
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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Buscar cliente..." />
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

      {/* Calendar Header */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 font-display">Sábado 9 de Mayo, 2026</h2>
          <p className="text-sm text-gray-500">{filtered.length} citas</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Appointments List */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No hay citas"
            description="No se encontraron citas con los filtros seleccionados"
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(apt => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                {/* Time */}
                <div className="w-16 text-center shrink-0">
                  <p className="text-lg font-bold text-gray-900 font-display">{apt.time}</p>
                </div>

                {/* Status indicator */}
                <div className={`w-1.5 h-12 rounded-full shrink-0 ${
                  apt.status === 'confirmed' ? 'bg-green-400' :
                  apt.status === 'pending' ? 'bg-amber-400' :
                  apt.status === 'attended' ? 'bg-blue-400' :
                  'bg-red-400'
                }`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-900">{apt.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors size={14} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600">{apt.service}</span>
                    <span className="text-xs text-gray-400">· {apt.employee}</span>
                  </div>
                </div>

                {/* Status badge */}
                <Badge variant={statusColors[apt.status]}>
                  {statusLabels[apt.status]}
                </Badge>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toast.success('Cita confirmada')}
                    className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
                    title="Confirmar"
                  >
                    <Clock size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Cancelar">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva cita"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button
              onClick={() => { setShowModal(false); toast.success('Cita creada exitosamente'); }}
              className="btn-primary"
            >
              Guardar cita
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="input-label">Cliente</label>
            <select className="input-field">
              <option>Seleccionar cliente...</option>
              <option>Laura Martínez</option>
              <option>Carlos Ruiz</option>
              <option>Ana López</option>
            </select>
          </div>
          <div>
            <label className="input-label">Servicio</label>
            <select className="input-field">
              <option>Seleccionar servicio...</option>
              <option>Corte + Peinado</option>
              <option>Coloración</option>
              <option>Manicura</option>
              <option>Barba</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Fecha</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="input-label">Hora</label>
              <input type="time" className="input-field" />
            </div>
          </div>
          <div>
            <label className="input-label">Empleado</label>
            <select className="input-field">
              <option>Seleccionar empleado...</option>
              <option>María</option>
              <option>Sofía</option>
              <option>Valentina</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}