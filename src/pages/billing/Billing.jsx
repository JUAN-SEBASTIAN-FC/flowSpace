import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import {
  Plus, DollarSign, Receipt, TrendingUp, Calendar,
  Search, FileText, CreditCard, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Billing() {
  const { bills, clients, addBill, setBills } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    service: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Efectivo',
    status: 'paid'
  });

  const filtered = bills.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const clientName = client?.name || 'Desconocido';
    return clientName.toLowerCase().includes(search.toLowerCase()) ||
           inv.id.toLowerCase().includes(search.toLowerCase());
  });

  // Daily Summary calculated from state
  const today = new Date().toISOString().split('T')[0];
  const todayBills = bills.filter(b => b.date === today);
  
  const dailySummary = {
    total: todayBills.reduce((acc, b) => acc + (b.total || 0), 0),
    transactions: todayBills.length,
    pending: todayBills.filter(b => b.status === 'pending').length,
    cash: todayBills.filter(b => b.method === 'Efectivo').reduce((acc, b) => acc + (b.total || 0), 0),
    card: todayBills.filter(b => b.method === 'Tarjeta').reduce((acc, b) => acc + (b.total || 0), 0),
    transfer: todayBills.filter(b => b.method === 'Transferencia').reduce((acc, b) => acc + (b.total || 0), 0),
  };

  const handleRegisterPayment = () => {
    if (!formData.clientId || !formData.amount) {
      toast.error('Por favor completa el cliente y el monto');
      return;
    }

    addBill({
      ...formData,
      total: parseFloat(formData.amount),
      id: `FAC-${Math.floor(1000 + Math.random() * 9000)}`
    });

    toast.success('Pago registrado exitosamente');
    setShowModal(false);
    setFormData({
      clientId: '',
      service: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'Efectivo',
      status: 'paid'
    });
  };

  return (
    <div>
      <PageHeader title="Facturación" subtitle="Controlá tus ingresos y cobros">
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download size={16} /> Exportar
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <Plus size={16} /> Nueva factura
          </button>
        </div>
      </PageHeader>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="card p-4 text-center bg-primary-600 text-white">
          <p className="text-xs text-primary-200">Total del día</p>
          <p className="text-2xl font-bold font-display mt-1">${dailySummary.total.toLocaleString()}</p>
          <p className="text-xs text-primary-200 mt-1">{dailySummary.transactions} transacciones</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-green-600"><DollarSign size={16} /></div>
          <p className="text-xs text-gray-500">Efectivo</p>
          <p className="text-lg font-bold text-gray-900">${dailySummary.cash.toLocaleString()}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-blue-600"><CreditCard size={16} /></div>
          <p className="text-xs text-gray-500">Tarjeta</p>
          <p className="text-lg font-bold text-gray-900">${dailySummary.card.toLocaleString()}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-purple-600"><Receipt size={16} /></div>
          <p className="text-xs text-gray-500">Transferencia</p>
          <p className="text-lg font-bold text-gray-900">${dailySummary.transfer.toLocaleString()}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-amber-600"><TrendingUp size={16} /></div>
          <p className="text-xs text-gray-500">Pendientes</p>
          <p className="text-lg font-bold text-amber-600">{dailySummary.pending}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9"
          placeholder="Buscar factura o cliente..."
        />
      </div>

      {/* Invoices Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Factura</th>
              <th className="table-th">Cliente</th>
              <th className="table-th">Servicio</th>
              <th className="table-th">Monto</th>
              <th className="table-th">Fecha</th>
              <th className="table-th">Método</th>
              <th className="table-th">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const client = clients.find(c => c.id === inv.clientId);
              return (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-primary-500" />
                      <span className="font-mono text-xs font-semibold text-primary-600">{inv.id}</span>
                    </div>
                  </td>
                  <td className="table-td font-medium text-gray-900">{client?.name || 'Cliente eliminado'}</td>
                  <td className="table-td text-sm text-gray-600">{inv.service}</td>
                  <td className="table-td font-bold text-gray-900">${inv.total?.toLocaleString()}</td>
                  <td className="table-td text-sm text-gray-500">{inv.date}</td>
                  <td className="table-td">
                    <Badge variant={
                      inv.method === 'Efectivo' ? 'success' :
                      inv.method === 'Tarjeta' ? 'info' : 'primary'
                    }>
                      {inv.method}
                    </Badge>
                  </td>
                  <td className="table-td">
                    <Badge variant={
                      inv.status === 'paid' ? 'success' :
                      inv.status === 'pending' ? 'warning' : 'info'
                    }>
                      {inv.status === 'paid' ? 'Pagado' :
                       inv.status === 'pending' ? 'Pendiente' : 'Parcial'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva factura"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleRegisterPayment} className="btn-primary">Registrar pago</button>
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
            <label className="input-label">Servicio o producto</label>
            <input 
              className="input-field" 
              placeholder="Ej: Corte + Peinado" 
              value={formData.service}
              onChange={e => setFormData({...formData, service: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Monto ($)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="0" 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="input-label">Método de pago</label>
              <select 
                className="input-field" 
                value={formData.method}
                onChange={e => setFormData({...formData, method: e.target.value})}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
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
              <label className="input-label">Estado</label>
              <select 
                className="input-field" 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="paid">Pagado</option>
                <option value="pending">Pendiente</option>
                <option value="partial">Parcial</option>
              </select>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total a registrar</span>
            <span className="text-xl font-bold text-gray-900 font-display">${parseFloat(formData.amount || 0).toLocaleString()}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
