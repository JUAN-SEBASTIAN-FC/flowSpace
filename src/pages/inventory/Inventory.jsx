import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import {
  Plus, Search, Package, AlertTriangle, Filter,
  TrendingUp, ShoppingCart, ArrowDown, ArrowUp, Edit, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Inventory() {
  const { inventory, addInventoryItem, updateStock, deleteInventoryItem, updateInventoryItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newStock, setNewStock] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    minStock: ''
  });

  const filtered = inventory.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    
    const isCritical = p.stock <= p.minStock;
    if (filterStatus === 'critical' && !isCritical) return false;
    if (filterStatus === 'ok' && isCritical) return false;
    
    return true;
  });

  const categories = [...new Set(inventory.map(p => p.category))];

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(p => p.stock <= p.minStock && p.stock > 0).length,
    outOfStock: inventory.filter(p => p.stock === 0).length,
    categories: categories.length,
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    addInventoryItem({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock) || 5,
    });

    toast.success('Producto agregado exitosamente');
    setFormData({ name: '', category: '', price: '', stock: '', minStock: '' });
    setShowModal(false);
  };

  const handleUpdateStock = (id) => {
    setSelectedProductId(id);
    setNewStock('');
    setShowStockModal(true);
  };

  const confirmUpdateStock = () => {
    if (!newStock || isNaN(parseInt(newStock))) {
      toast.error('Ingresa una cantidad válida');
      return;
    }
    updateStock(selectedProductId, parseInt(newStock));
    toast.success('Stock actualizado');
    setShowStockModal(false);
  };

  const handleDeleteProduct = (id) => {
    deleteInventoryItem(id);
    toast.error('Producto eliminado');
  };

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
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><AlertTriangle size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Stock bajo</p>
            <p className="text-lg font-bold text-amber-600">{stats.lowStock}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl text-red-600"><AlertTriangle size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Agotados</p>
            <p className="text-lg font-bold text-red-600">{stats.outOfStock}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Filter size={18} /></div>
          <div>
            <p className="text-xs text-gray-500">Categorías</p>
            <p className="text-lg font-bold text-gray-900">{stats.categories}</p>
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
          <option value="critical">Stock crítico/agotado</option>
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
              <th className="table-th">Estado</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => {
              const isCritical = product.stock <= product.minStock;
              return (
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
                        product.stock <= product.minStock ? 'text-amber-600' : 'text-gray-900'
                      }`}>
                        {product.stock}
                      </span>
                      <span className="text-xs text-gray-400">/ {product.minStock} mín</span>
                      {isCritical && (
                        <ArrowDown size={12} className="text-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="table-td font-medium">${product.price}</td>
                  <td className="table-td">
                    <Badge
                      variant={
                        product.stock === 0 ? 'danger' :
                        isCritical ? 'warning' : 'success'
                      }
                    >
                      {product.stock === 0 ? 'Agotado' :
                       isCritical ? 'Crítico' : 'En stock'}
                    </Badge>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-600"
                        title="Actualizar Stock"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
            <button onClick={handleAddProduct} className="btn-primary">Guardar producto</button>
          </>
        }
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="input-label">Nombre del producto *</label>
            <input 
              className="input-field" 
              placeholder="Shampoo Profesional" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Categoría</label>
              <select 
                className="input-field" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                <option value="Productos">Productos</option>
                <option value="Coloración">Coloración</option>
                <option value="Insumos">Insumos</option>
              </select>
            </div>
            <div>
              <label className="input-label">Precio ($) *</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="0" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Stock inicial *</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="0" 
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            <div>
              <label className="input-label">Stock mínimo</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="5" 
                value={formData.minStock}
                onChange={e => setFormData({...formData, minStock: e.target.value})}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        open={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Actualizar Stock"
        footer={
          <>
            <button onClick={() => setShowStockModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={confirmUpdateStock} className="btn-primary">Actualizar</button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="input-label">Nueva cantidad de stock</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="0"
            value={newStock}
            onChange={e => setNewStock(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
