import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useApp } from '../../context/AppContext';
import {
  Plus, Search, Users, Mail, Phone, Tag,
  Calendar, ShoppingBag, FileText, MessageCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Clients() {
  const { clients, addClient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  
  // State for new client form
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

  return (
    <div>
      <PageHeader title="Clientes" subtitle={`${clients.length} clientes registrados`}>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Lista
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={16} /> Agregar cliente
          </button>
        </div>
      </PageHeader>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
          description="Intentá con otros términos de búsqueda"
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(client => (
            <div
              key={client.id}
              onClick={() => openProfile(client)}
              className="card p-5 cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary-600">
                    {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Phone size={12} /> {client.phone}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} /> {client.lastVisit || 'Sin visitas'}
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {client.visits || 0} visitas
                </span>
              </div>
              {client.tags && client.tags.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {client.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Cliente</th>
                <th className="table-th">Email</th>
                <th className="table-th">Teléfono</th>
                <th className="table-th">Última visita</th>
                <th className="table-th">Visitas</th>
                <th className="table-th">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr
                  key={client.id}
                  onClick={() => openProfile(client)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="table-td font-semibold text-gray-900">{client.name}</td>
                  <td className="table-td">{client.email}</td>
                  <td className="table-td">{client.phone}</td>
                  <td className="table-td">{client.lastVisit || 'N/A'}</td>
                  <td className="table-td">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {client.visits || 0}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {client.tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal
        open={showModal && !selectedClient}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        title="Nuevo Cliente"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleAddClient} className="btn-primary">Guardar Cliente</button>
          </>
        }
      >
        <form onSubmit={handleAddClient} className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
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
              className="input-field h-24 resize-none"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Cualquier detalle importante..."
            />
          </div>
        </form>
      </Modal>

      {/* Client Profile Modal */}
      <Modal
        open={showModal && selectedClient}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        title={
          selectedClient && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="font-bold text-primary-600">
                  {selectedClient.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{selectedClient.name}</span>
                {selectedClient.tags?.map(tag => (
                  <Badge key={tag} variant="primary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </div>
          )
        }
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <Mail size={16} className="mx-auto mb-1 text-gray-400" />
                <p className="text-xs text-gray-500 truncate">{selectedClient.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <Phone size={16} className="mx-auto mb-1 text-gray-400" />
                <p className="text-xs text-gray-500 truncate">{selectedClient.phone}</p>
              </div>
              <button
                onClick={() => toast.success('WhatsApp abierto')}
                className="p-3 rounded-xl bg-green-50 text-center hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={16} className="mx-auto mb-1 text-green-600" />
                <p className="text-xs text-green-600 font-medium">WhatsApp</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-primary-50">
                <p className="text-xs text-primary-600 font-medium">Total visitas</p>
                <p className="text-2xl font-bold text-primary-700 font-display">{selectedClient.visits || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50">
                <p className="text-xs text-green-600 font-medium">Última visita</p>
                <p className="text-2xl font-bold text-green-700 font-display">{selectedClient.lastVisit || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Notas internas</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl italic">
                {selectedClient.notes || 'Sin notas adicionales.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
