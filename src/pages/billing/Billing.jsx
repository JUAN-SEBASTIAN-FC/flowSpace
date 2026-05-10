import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  Plus, DollarSign, Receipt, TrendingUp, Calendar,
  Search, FileText, CreditCard, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const invoices = [
  { id: 'FAC-001', client: 'Laura Martínez', service: 'Corte + Peinado', amount: '$ 8,500', date: '09/05/2026', method: 'Efectivo', status: 'paid' },
  { id: 'FAC-002', client: 'Carlos Ruiz', service: 'Coloración', amount: '$ 15,000', date: '09/05/2026', method: 'Transferencia', status: 'paid' },
  { id: 'FAC-003', client: 'Ana López', service: 'Manicura', amount: '$ 6,500', date: '09/05/2026', method: 'Tarjeta', status: 'pending' },
  { id: 'FAC-004', client: 'Pedro Sánchez', service: 'Barba', amount: '$ 4,500', date: '08/05/2026', method: 'Efectivo', status: 'paid' },
  { id: 'FAC-005', client: 'Sofía García', service: 'Corte + Peinado', amount: '$ 8,500', date: '08/05/2026', method: 'Tarjeta', status: 'partial' },
];

const dailySummary = {
  total: '$ 48,500',
  transactions: 4,
  pending: 1,
  cash: '$ 13,000',
  card: '$ 6,500',
  transfer: '$ 15,000',
};

export default function Billing() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(i =>
    i.client.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

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
          <p className="text-2xl font-bold font-display mt-1">{dailySummary.total}</p>
          <p className="text-xs text-primary-200 mt-1">{dailySummary.transactions} transacciones</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-green-600"><DollarSign size={16} /></div>
          <p className="text-xs text-gray-500">Efectivo</p>
          <p className="text-lg font-bold text-gray-900">{dailySummary.cash}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-blue-600"><CreditCard size={16} /></div>
          <p className="text-xs text-gray-500">Tarjeta</p>
          <p className="text-lg font-bold text-gray-900">{dailySummary.card}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-purple-600"><ArrowDown size={16} /></div>
          <p className="text-xs text-gray-500">Transferencia</p>
          <p className="text-lg font-bold text-gray-900">{dailySummary.transfer}</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-1 text-amber-600"><Receipt size={16} /></div>
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
          placeholder="Buscar factura..."
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
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-primary-500" />
                    <span className="font-mono text-xs font-semibold text-primary-600">{inv.id}</span>
                  </div>
                </td>
                <td className="table-td font-medium text-gray-900">{inv.client}</td>
                <td className="table-td text-sm text-gray-600">{inv.service}</td>
                <td className="table-td font-bold text-gray-900">{inv.amount}</td>
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
            ))}
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
            <button
              onClick={() => { setShowModal(false); toast.success('Factura creada'); }}
              className="btn-primary"
            >
              Registrar pago
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
            <label className="input-label">Servicio o producto</label>
            <select className="input-field">
              <option>Seleccionar...</option>
              <option>Corte + Peinado — $8,500</option>
              <option>Coloración — $15,000</option>
              <option>Manicura — $6,500</option>
              <option>Barba — $4,500</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Descuento (%)</label>
              <input type="number" className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="input-label">Método de pago</label>
              <select className="input-field">
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-xl font-bold text-gray-900 font-display">$ 8,500</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}