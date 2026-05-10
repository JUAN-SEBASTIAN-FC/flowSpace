import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import {
  Bell, Send, Edit, Trash2, Plus, Clock,
  CalendarCheck, CreditCard, UserCheck, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const templates = [
  { id: 1, name: 'Recordatorio de cita', type: 'appointment', channel: 'WhatsApp', active: true, lastSent: 'Hoy 10:00' },
  { id: 2, name: 'Recordatorio de pago', type: 'payment', channel: 'WhatsApp', active: true, lastSent: 'Ayer' },
  { id: 3, name: 'Seguimiento post-visita', type: 'followup', channel: 'WhatsApp', active: false, lastSent: 'Hace 3 días' },
];

const upcomingReminders = [
  { id: 1, client: 'Laura Martínez', type: 'appointment', message: 'Cita mañana a las 10:30', time: 'Mañana 9:00' },
  { id: 2, client: 'Ana López', type: 'payment', message: 'Pago pendiente de $6,500', time: 'Mañana 9:00' },
  { id: 3, client: 'Carlos Ruiz', type: 'followup', message: '¿Cómo quedó tu coloración?', time: 'Mañana 10:00' },
];

const templatePreview = (type) => {
  const pre = type === 'appointment'
    ? 'Hola [Nombre], te recordamos tu cita de [Servicio] mañana a las [Hora]. ¡Te esperamos!'
    : type === 'payment'
    ? 'Hola [Nombre], tenés un pago pendiente de [Monto]. Podés abonarlo por este medio.'
    : 'Hola [Nombre], pasaron unos días desde tu última visita. ¿Cómo te sentiste con el servicio?';
  return pre;
};

export default function Reminders() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div>
      <PageHeader title="Recordatorios" subtitle="Automatizá la comunicación con tus clientes">
        <button onClick={() => toast.success('Plantilla creada')} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Nueva plantilla
        </button>
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { id: 'templates', label: 'Plantillas', icon: MessageSquare },
          { id: 'upcoming', label: 'Próximos envíos', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'templates' ? (
        <div className="space-y-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    tpl.type === 'appointment' ? 'bg-primary-100 text-primary-600' :
                    tpl.type === 'payment' ? 'bg-amber-100 text-amber-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {tpl.type === 'appointment' ? <CalendarCheck size={18} /> :
                     tpl.type === 'payment' ? <CreditCard size={18} /> :
                     <UserCheck size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{tpl.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={tpl.active ? 'success' : 'neutral'}>
                        {tpl.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Badge variant="info">{tpl.channel}</Badge>
                      <span className="text-xs text-gray-400">· Último envío: {tpl.lastSent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toast.success('Envío manual activado')}
                    className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
                    title="Enviar ahora"
                  >
                    <Send size={14} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-600" title="Editar">
                    <Edit size={14} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Template preview */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-600 italic">"{templatePreview(tpl.type)}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingReminders.map(rem => (
            <div key={rem.id} className="card p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${
                rem.type === 'appointment' ? 'bg-primary-100 text-primary-600' :
                rem.type === 'payment' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{rem.client}</p>
                <p className="text-xs text-gray-500">{rem.message}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} /> {rem.time}
                </div>
                <button
                  onClick={() => toast.success('Recordatorio enviado manualmente')}
                  className="btn-primary text-xs mt-2 py-1 px-3"
                >
                  <Send size={12} className="inline mr-1" /> Enviar ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}