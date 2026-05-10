import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { PageHeader } from '../../components/ui/PageComponents';
import {
  DollarSign, Calendar, Users, Package, TrendingUp,
  Clock, AlertTriangle, Plus, ArrowRight, MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { business, bills, appointments, inventory, clients } = useApp();

  // --- Real-time calculations ---
  const today = new Date().toISOString().split('T')[0];
  
  const todayBills = bills.filter(b => b.date === today);
  const dailyRevenue = todayBills.reduce((acc, b) => acc + (b.total || 0), 0);
  const transactionsCount = todayBills.length;

  const todayAppointments = appointments.filter(a => a.date === today);
  const confirmedToday = todayAppointments.filter(a => a.status === 'confirmed').length;
  const pendingToday = todayAppointments.filter(a => a.status === 'pending').length;

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  const criticalStockItems = inventory.filter(i => i.stock === 0);

  const recentClients = clients.slice(-3).reverse();

  return (
    <div>
      <PageHeader
        title={`Buen día, ${business?.name || 'Style Studio'} 👋`}
        subtitle={`Resumen de hoy — ${new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      >
        <div className="flex gap-2">
          <Link to="/appointments" className="btn-primary text-sm flex items-center gap-2">
            <Plus size={16} /> Nueva cita
          </Link>
          <Link to="/billing" className="btn-secondary text-sm flex items-center gap-2">
            <DollarSign size={16} /> Nueva venta
          </Link>
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ingresos del día"
          value={`$ ${dailyRevenue.toLocaleString()}`}
          change={0}
          icon={DollarSign}
          color="green"
          subtitle={`${transactionsCount} transacciones`}
        />
        <StatCard
          title="Citas hoy"
          value={todayAppointments.length.toString()}
          change={0}
          icon={Calendar}
          color="primary"
          subtitle={`${confirmedToday} confirmadas, ${pendingToday} pendientes`}
        />
        <StatCard
          title="Clientes totales"
          value={clients.length.toString()}
          change={0}
          icon={Users}
          color="blue"
          subtitle="Base de datos activa"
        />
        <StatCard
          title="Stock bajo"
          value={lowStockItems.length.toString()}
          icon={Package}
          color="amber"
          subtitle="Requieren atención"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Appointments */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 font-display flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              Próximas citas (Hoy)
            </h3>
            <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Ver agenda <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {todayAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay citas programadas para hoy</p>
            ) : (
              todayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map(apt => {
                const client = clients.find(c => c.id === apt.clientId);
                return (
                  <div key={apt.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-600">{apt.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{client?.name || 'Cliente desconocido'}</p>
                      <p className="text-xs text-gray-500">{apt.service}</p>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'}>
                      {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 font-display flex items-center gap-2">
              <Users size={18} className="text-primary-500" />
              Clientes recientes
            </h3>
            <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentClients.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay clientes registrados</p>
            ) : (
              recentClients.map(client => (
                <div key={client.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.lastVisit || 'Sin visitas'} · {client.visits || 0} visitas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Inventory Alerts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 font-display flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Alertas de inventario
            </h3>
            <Link to="/inventory" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Gestionar <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay productos con stock bajo</p>
            ) : (
              lowStockItems.slice(0, 3).map(item => (
                <div key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/50"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-amber-600 font-medium">
                      Stock: {item.stock} / Mín: {item.minStock}
                    </p>
                  </div>
                  <Badge variant={item.stock === 0 ? 'danger' : 'warning'}>
                    {item.stock === 0 ? 'Agotado' : 'Crítico'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-gray-900 font-display mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            Acciones rápidas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/appointments', icon: Calendar, label: 'Nueva cita', color: 'bg-primary-50 text-primary-600' },
              { to: '/clients', icon: Users, label: 'Agregar cliente', color: 'bg-blue-50 text-blue-600' },
              { to: '/billing', icon: DollarSign, label: 'Nueva venta', color: 'bg-green-50 text-green-600' },
              { to: '/inventory', icon: Package, label: 'Actualizar stock', color: 'bg-amber-50 text-amber-600' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100
                  hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-150 group"
              >
                <div className={`p-2.5 rounded-xl ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* WhatsApp Quick Contact */}
          <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">¿Necesitás ayuda?</p>
              <p className="text-xs text-green-600">Escribinos por WhatsApp, respondemos al toque</p>
            </div>
            <button className="btn-primary text-sm bg-green-600 hover:bg-green-700">
              Chatear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
