import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import {
  Bell, Send, Edit, Trash2, Plus, Clock,
  CalendarCheck, CreditCard, UserCheck, MessageSquare, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reminders() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    addReminder({
      ...formData,
      completed: false
    });

    toast.success('Recordatorio creado');
    setFormData({ title: '', description: '', date: '' });
    setShowModal(false);
  };

  const handleToggle = (id) => {
    toggleReminder(id);
    toast.success('Recordatorio actualizado');
  };

  const handleDelete = (id) => {
    deleteReminder(id);
    toast.error('Recordatorio eliminado');
  };

  const pendingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div>
      <PageHeader title="Recordatorios" subtitle="Mantené el control de tus tareas">
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Nuevo recordatorio
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">{reminders.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Pendientes</p>
          <p className="text-lg font-bold text-amber-600">{pendingReminders.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Completadas</p>
          <p className="text-lg font-bold text-green-600">{completedReminders.length}</p>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {pendingReminders.length === 0 && completedReminders.length === 0 ? (
          <div className="card p-8 text-center">
            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay recordatorios. ¡Crea uno nuevo!</p>
          </div>
        ) : (
          <>
            {pendingReminders.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-3">Pendientes ({pendingReminders.length})</h3>
                {pendingReminders.map(reminder => (
                  <div key={reminder.id} className="card p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <button 
                      onClick={() => handleToggle(reminder.id)}
                      className="p-2 rounded-lg hover:bg-green-50 text-gray-300 hover:text-green-600 transition-colors shrink-0"
                    >
                      <Check size={18} />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{reminder.title}</p>
                      {reminder.description && (
                        <p className="text-xs text-gray-500">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{reminder.date}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}

            {completedReminders.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-3">Completadas ({completedReminders.length})</h3>
                {completedReminders.map(reminder => (
                  <div key={reminder.id} className="card p-4 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleToggle(reminder.id)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 shrink-0"
                    >
                      <Check size={18} />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 line-through">{reminder.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{reminder.date}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo recordatorio"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleAddReminder} className="btn-primary">Guardar</button>
          </>
        }
      >
        <form onSubmit={handleAddReminder} className="space-y-4">
          <div>
            <label className="input-label">Título *</label>
            <input 
              className="input-field" 
              placeholder="Ej: Pedir stock de tinte"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="input-label">Descripción</label>
            <textarea 
              className="input-field" 
              placeholder="Detalles adicionales..."
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="input-label">Fecha *</label>
            <input 
              type="date"
              className="input-field"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}