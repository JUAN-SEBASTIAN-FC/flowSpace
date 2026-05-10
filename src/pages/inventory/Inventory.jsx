import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  Plus, Search, Package, AlertTriangle, Filter,
  TrendingUp, ShoppingCart, ArrowDown, ArrowUp, Edit, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const products = [
  { id: 1, name: 'Shampoo Profesional 500ml', category: 'Productos', stock: 2, min: 5, price: '$ 8,500', sales: 48, status: 'critical' },
  { id: 2, name: 'Acondicionador Hidratante', category: 'Productos', stock: 12, min: 5, price: '$ 7,200', sales: 35, status: 'ok' },
  { id: 3, name: 'Tinte Castaño 5.0', category: 'Coloración', stock: 1, min: 3, price: '$ 4,500', sales: 22, status: 'critical' },
  { id: 4, name: 'Tinte Rubio 8.0', category: 'Coloración', stock: 6, min: 3, price: '$ 4,500', sales: 18, status: 'ok' },
  { id: 5, name: 'Guantes Descartables x100', category: 'Insumos', stock: 0, min: 10, price: '$ 3,200', sales: 5, status: 'out' },
  { id: 6, name: 'Crema de Peinar', category: 'Productos', stock: 8, min: 4, price: '$ 5,900', sales: 30, status: 'ok' },
  { id: 7, name: 'Alcohol en Gel', category: 'Insumos', stock: 3, min: 5, price: '$ 2,100', sales: 12, status: 'low' },
];

const inventoryStats = {
  total: 142,
  lowStock: 3,
  outOfStock: 1,
  categories: 3,
};

export default function Inventory() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus === 'critical' && p.status === 'ok') return false;
    if (filterStatus === 'ok' && p.status !== 'ok') return false;
    return true;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <PageHeader title="Inventario" subtitle="Controlá tus productos e insumos">
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Agregar producto
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-xl text-primary-600"><Package size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Total productos</p>
            <p className="text-lg font-bold text-gray-900">{inventoryStats.total}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><AlertTriangle size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Stock bajo</p>
            <p className="text-lg font-bold text-amber-600">{inventoryStats.lowStock}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl text-red-600"><AlertTriangle size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Agotados</p>
            <p className="text-lg font-bold text-red-600">{inventoryStats.outOfStock}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Filter size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Categorías</p>
            <p className="text-lg font-bold text-gray-900">{inventoryStats.categories}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
            placeholder="Buscar producto..."
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">Todos los estados</option>
          <option value="ok">Stock normal</option>
          <option value="critical">Stock crítico</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Producto</th>
              <th className="table-th">Categoría</th>
              <th className="table-th">Stock</th>
              <th className="table-th">Precio</th>
              <th className="table-th">Ventas</th>
              <th className="table-th">Estado</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="table-td">
                  <Badge variant="neutral">{product.category}</Badge>
                </td>
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= product.min ? 'text-amber-600' : 'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                    <span className="text-xs text-gray-400">/ {product.min} mín</span>
                    {product.stock <= product.min && (
                      <ArrowDown size={12} className="text-amber-500" />
                    )}
                  </div>
                </td>
                <td className="table-td font-medium">{product.price}</td>
                <td className="table-td">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span>{product.sales}</span>
                  </div>
                </td>
                <td className="table-td">
                  <Badge
                    variant={
                      product.status === 'out' ? 'danger' :
                      product.status === 'critical' ? 'warning' : 'success'
                    }
                  >
                    {product.status === 'out' ? 'Agotado' :
                     product.status === 'critical' ? 'Crítico' : 'En stock'}
                  </Badge>
                </td>
                <td className="table-td">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toast.success('Stock actualizado')}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-600"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => toast.error('Producto eliminado')}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar producto"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button
              onClick={() => { setShowModal(false); toast.success('Producto agregado'); }}
              className="btn-primary"
            >
              Guardar producto
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="input-label">Nombre del producto</label>
            <input className="input-field" placeholder="Shampoo Profesional" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Categoría</label>
              <select className="input-field">
                <option>Seleccionar...</option>
                <option>Productos</option>
                <option>Coloración</option>
                <option>Insumos</option>
              </select>
            </div>
            <div>
              <label className="input-label">Precio</label>
              <input type="number" className="input-field" placeholder="$ 0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Stock inicial</label>
              <input type="number" className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="input-label">Stock mínimo</label>
              <input type="number" className="input-field" placeholder="5" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}