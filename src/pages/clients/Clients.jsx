import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useApp } from '../../context/AppContext';
import {
  Plus, Search, Users, Mail, Phone, Tag,
  Calendar, ShoppingBag, FileText, MessageCircle, X, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Clients() {
  const { clients, addClient, deleteClient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    tags: ''
  });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const openProfile = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('El nombre y teléfono son obligatorios');
      return;
    }

    addClient({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      visits: 1,
      lastVisit: 'Hoy'
    });

    toast.success('Cliente agregado exitosamente');
    setFormData({ name: '', email: '', phone: '', notes: '', tags: '' });
    setShowModal(false);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      deleteClient(id);
      toast.error('Cliente eliminado');
      setShowModal(false);
      setSelectedClient(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Clientes" subtitle={`${clients.length} clientes registrados`}>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1 transition-all">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Lista
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary text-sm flex items-center gap-2 shadow-primary-500/20"
          >
            <Plus size={16} /> Agregar cliente
          </button>
        </div>
      </PageHeader>

      <div className="relative mb-6 max-w-md group">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Buscar por nombre, email o teléfono..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No se encontraron clientes"
          description="Intentá con otros términos de búsqueda o agregá un nuevo cliente."
          action={<button onClick={() => setShowModal(true)} className="btn-primary">Agregar Cliente</button>}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(client => (
            <div
              key={client.id}
              onClick={() => openProfile(client)}
              className="card p-5 cursor-pointer group transition-all duration-300 hover:border-primary-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shrink-0 text-primary-700 font-bold shadow-sm group-hover:shadow-premium transition-all">
                  {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-xl">
                <Phone size={12} className="text-gray-400" /> {client.phone}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} className="text-gray-400" /> {client.lastVisit || 'N/A'}
                </div>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full ring-1 ring-primary-600/20">
                  {client.visits || 0} visitas
                </span>
              </div>
              {client.tags && client.tags.length > 0 && (
                <div className="flex gap-1 mt-4 flex-wrap">
                  {client.tags.map(tag => (
                    <Badge key={tag} variant="neutral" className="text-[9px]">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden border-gray-100">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Cliente</th>
                <th className="table-th">Email</th>
                <th className="table-th">Teléfono</th>
                <th className="table-th">Última visita</th>
                <th className="table-th text-center">Visitas</th>
                <th className="table-th">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr
                  key={client.id}
                  onClick={() => openProfile(client)}
                  className="hover:bg-primary-50/30 cursor-pointer transition-all group"
                >
                  <td className="table-td font-bold text-gray-900 group-hover:text-primary-700">{client.name}</td>
                  <td className="table-td text-gray-500">{client.email}</td>
                  <td className="table-td text-gray-500">{client.phone}</td>
                  <td className="table-td text-gray-500">{client.lastVisit || 'N/A'}</td>
                  <td className="table-td text-center">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full ring-1 ring-primary-600/20">
                      {client.visits || 0}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {client.tags?.map(tag => (
                        <Badge key={tag} variant="neutral" className="text-[9px]">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showModal && !selectedClient}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        title="Nuevo Cliente"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleAddClient} className="btn-primary shadow-primary-500/20">Guardar Cliente</button>
          </>
        }
      >
        <form onSubmit={handleAddClient} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="input-label">Nombre completo *</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="juan@email.com"
                />
              </div>
              <div>
                <label className="input-label">Teléfono *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+54 11 ..."
                />
              </div>
            </div>
            <div>
              <label className="input-label">Etiquetas (separadas por coma)</label>
              <input
                type="text"
                className="input-field"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="VIP, Frecuente, Nuevo"
              />
            </div>
            <div>
              <label className="input-label">Notas internas</label>
              <textarea
                className="input-field h-28 resize-none"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Cualquier detalle importante..."
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={showModal && selectedClient}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        title={
          selectedClient && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-700 font-bold shadow-sm">
                {selectedClient.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{selectedClient.name}</span>
                {selectedClient.tags?.map(tag => (
                  <Badge key={tag} variant="primary" className="text-[9px]">{tag}</Badge>
                ))}
              </div>
            </div>
          )
        }
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center group hover:bg-white hover:shadow-soft transition-all">
                <Mail size={18} className="mx-auto mb-2 text-gray-400 group-hover:text-primary-500 transition-colors" />
                <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="text-xs font-semibold text-gray-700 truncate">{selectedClient.email || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center group hover:bg-white hover:shadow-soft transition-all">
                <Phone size={18} className="mx-auto mb-2 text-gray-400 group-hover:text-primary-500 transition-colors" />
                <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-1">Teléfono</p>
                <p className="text-xs font-semibold text-gray-700 truncate">{selectedClient.phone || 'N/A'}</p>
              </div>
              <button
                onClick={() => toast.success('WhatsApp abierto')}
                className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center hover:bg-green-100 transition-all group"
              >
                <MessageCircle size={18} className="mx-auto mb-2 text-green-600" />
                <p className="text-[11px] text-green-600 uppercase font-bold tracking-wider mb-1">Chat</p>
                <p className="text-xs font-bold text-green-700">WhatsApp</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-primary-50 border border-primary-100">
                <p className="text-[11px] text-primary-600 uppercase font-bold tracking-wider mb-1">Total visitas</p>
                <p className="text-3xl font-bold text-primary-700 font-display">{selectedClient.visits || 0}</p>
              </div>
              <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                <p className="text-[11px] text-green-600 uppercase font-bold tracking-wider mb-1">Última visita</p>
                <p className="text-3xl font-bold text-green-700 font-display">{selectedClient.lastVisit || 'N/A'}</p>
              </div>
            </div>


            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setSelectedClient(null);
                }}
                className="btn-secondary flex-1"
              >
                Cerrar
              </button>
              <button 
                onClick={() => handleDeleteClient(selectedClient.id)}
                className="btn-danger flex items-center gap-2 justify-center"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                Notas internas
              </h4>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                {selectedClient.notes || 'No hay notas registradas para este cliente.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
