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

  const today = new Date().toISOString().split('T')[0];
  
  const todayBills = bills.filter(b => b.date === today);
  const dailyRevenue = todayBills.reduce((acc, b) => acc + (b.total || 0), 0);
  const transactionsCount = todayBills.length;

  const todayAppointments = appointments.filter(a => a.date === today);
  const confirmedToday = todayAppointments.filter(a => a.status === 'confirmed').length;
  const pendingToday = todayAppointments.filter(a => a.status === 'pending').length;

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  const recentClients = clients.slice(-3).reverse();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Buen día, ${business?.name || 'Style Studio'} 👋`}
        subtitle={`Resumen de hoy — ${new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      >
        <div className="flex gap-3">
          <Link to="/appointments" className="btn-primary text-sm flex items-center gap-2 shadow-primary-500/20">
            <Plus size={16} /> Nueva cita
          </Link>
          <Link to="/billing" className="btn-secondary text-sm flex items-center gap-2">
            <DollarSign size={16} /> Nueva venta
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos del día"
          value={`$ ${dailyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          subtitle={`${transactionsCount} transacciones`}
        />
        <StatCard
          title="Citas hoy"
          value={todayAppointments.length.toString()}
          icon={Calendar}
          color="primary"
          subtitle={`${confirmedToday} confirmadas, ${pendingToday} pendientes`}
        />
        <StatCard
          title="Clientes totales"
          value={clients.length.toString()}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-display flex items-center gap-2">
              <Clock size={20} className="text-primary-500" />
              Próximas citas (Hoy)
            </h3>
            <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 transition-all hover:gap-2">
              Ver agenda <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No hay citas programadas para hoy</p>
              </div>
            ) : (
              todayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map(apt => {
                const client = clients.find(c => c.id === apt.clientId);
                return (
                  <div key={apt.id}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-50/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-primary-100"
                  >
                    <div className="w-12 h-12 bg-white shadow-soft rounded-xl flex items-center justify-center shrink-0 group-hover:shadow-premium transition-all">
                      <span className="text-sm font-bold text-primary-600">{apt.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{client?.name || 'Cliente desconocido'}</p>
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

        <div className="card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-display flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              Recientes
            </h3>
            <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 transition-all hover:gap-2">
              Todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentClients.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No hay clientes registrados</p>
            ) : (
              recentClients.map(client => (
                <div key={client.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shrink-0 text-primary-700 font-bold text-xs shadow-sm">
                    {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.lastVisit || 'Sin visitas'} · {client.visits || 0} visitas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-display flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" />
              Alertas de Inventario
            </h3>
            <Link to="/inventory" className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1 transition-all hover:gap-2">
              Gestionar <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">Todo el stock está en niveles óptimos</p>
              </div>
            ) : (
              lowStockItems.slice(0, 3).map(item => (
                <div key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-amber-100 bg-amber-50/30 transition-all hover:bg-amber-50 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-soft group-hover:shadow-premium transition-all">
                    <Package size={20} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-amber-600 font-semibold">
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

        <div className="card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-bold text-gray-900 font-display mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" />
            Acciones rápidas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { to: '/appointments', icon: Calendar, label: 'Nueva cita', color: 'bg-primary-50 text-primary-600' },
              { to: '/clients', icon: Users, label: 'Agregar cliente', color: 'bg-blue-50 text-blue-600' },
              { to: '/billing', icon: DollarSign, label: 'Nueva venta', color: 'bg-green-50 text-green-600' },
              { to: '/inventory', icon: Package, label: 'Actualizar stock', color: 'bg-amber-50 text-amber-600' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100
                  hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200 group active:scale-95"
              >
                <div className={`p-3 rounded-2xl ${action.color} transition-transform group-hover:scale-110`}>
                  <action.icon size={22} />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-primary-700">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center gap-4 transition-all hover:shadow-premium">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-green-800">Soporte Rápido</p>
              <p className="text-xs text-green-600">¿Dudas con la plataforma? Escribinos</p>
            </div>
            <button className="btn-primary text-xs bg-green-600 hover:bg-green-700 shadow-green-500/20">
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
