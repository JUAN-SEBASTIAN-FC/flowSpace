import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import {
  MessageCircle, Send, Phone, Users, Calendar,
  Search, ArrowRight, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const quickMessages = [
  { id: 1, label: 'Confirmar cita', message: 'Hola [Nombre], te confirmamos tu cita de [Servicio] para el [Fecha] a las [Hora]. ¡Te esperamos!' },
  { id: 2, label: 'Recordar cita', message: 'Hola [Nombre], no te olvides de tu cita mañana de [Servicio] a las [Hora].' },
  { id: 3, label: 'Recordar pago', message: 'Hola [Nombre], tenés un saldo pendiente de [Monto]. ¿Podés abonarlo hoy?' },
  { id: 4, label: 'Seguimiento', message: 'Hola [Nombre], ¿cómo te fue con tu [Servicio]? Quedamos a disposición.' },
  { id: 5, label: 'Promoción', message: 'Hola [Nombre], tenemos una promo especial en [Servicio]. ¿Te interesa?' },
];

const recentChats = [
  { id: 1, client: 'Laura Martínez', lastMessage: 'Gracias, ahí voy', time: '10:45', unread: 2 },
  { id: 2, client: 'Carlos Ruiz', lastMessage: '¿Tienen turno para mañana?', time: '09:30', unread: 0 },
  { id: 3, client: 'Ana López', lastMessage: 'Perfecto, confirmado', time: 'Ayer', unread: 1 },
];

export default function WhatsApp() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(null);

  const handleCopy = (msg, id) => {
    navigator.clipboard.writeText(msg);
    setCopied(id);
    toast.success('Mensaje copiado');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success('Mensaje enviado por WhatsApp');
    setMessage('');
  };

  const openWhatsApp = (phone = '+541112345678') => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
    toast.success('WhatsApp abierto');
  };

  return (
    <div>
      <PageHeader title="WhatsApp" subtitle="Comunicate con tus clientes al instante">
        <button onClick={() => openWhatsApp()} className="btn-primary text-sm flex items-center gap-2 bg-green-600 hover:bg-green-700">
          <Phone size={16} /> Abrir WhatsApp Web
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Quick messages */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-gray-900 font-display flex items-center gap-2 mb-4">
            <Send size={18} className="text-green-500" />
            Mensajes rápidos
          </h3>
          <div className="space-y-2">
            {quickMessages.map(qm => (
              <div key={qm.id} className="p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">{qm.label}</span>
                  <button
                    onClick={() => handleCopy(qm.message, qm.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600"
                  >
                    {copied === qm.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{qm.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Chat area */}
        <div className="card p-5 lg:col-span-2 flex flex-col h-[500px]">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{selectedChat.client}</p>
                  <p className="text-xs text-green-600">En línea</p>
                </div>
                <button
                  onClick={() => openWhatsApp()}
                  className="btn-ghost text-green-600"
                >
                  <Phone size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-gray-800">{selectedChat.lastMessage}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{selectedChat.time}</p>
                  </div>
                </div>
                {selectedChat.unread > 0 && (
                  <div className="flex justify-end">
                    <div className="bg-green-500 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-white">¡Hola {selectedChat.client.split(' ')[0]}! ¿En qué podemos ayudarte?</p>
                      <p className="text-[10px] text-green-100 mt-1">Hoy</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="input-field flex-1"
                  placeholder="Escribí un mensaje..."
                />
                <button onClick={handleSend} className="btn-primary p-2.5 bg-green-600 hover:bg-green-700">
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-4">
                <MessageCircle size={36} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-display mb-1">
                WhatsApp integrado
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Seleccioná un cliente de la lista para iniciar una conversación o usá los mensajes rápidos.
              </p>

              {/* Recent chats */}
              <div className="w-full max-w-md">
                <div className="flex items-center gap-2 mb-3 text-left">
                  <Search size={14} className="text-gray-400" />
                  <input className="input-field flex-1 text-sm" placeholder="Buscar cliente..." />
                </div>
                <div className="space-y-1">
                  {recentChats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-green-600">
                          {chat.client.split(' ').map(w => w[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">{chat.client}</p>
                          <span className="text-xs text-gray-400">{chat.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {[
          { icon: Calendar, label: 'Enviar desde agenda', desc: 'Recordatorios de citas' },
          { icon: Users, label: 'Enviar a cliente', desc: 'Mensaje personalizado' },
          { icon: Send, label: 'Difusión masiva', desc: 'A todos tus clientes' },
          { icon: MessageCircle, label: 'Ver estadísticas', desc: 'Mensajes enviados este mes' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => toast.success(`Acción: ${action.label}`)}
            className="card p-4 flex items-center gap-3 hover:border-green-200 transition-all text-left"
          >
            <div className="p-2.5 bg-green-50 rounded-xl text-green-600 shrink-0">
              <action.icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}