import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  TrendingUp, Calendar, DollarSign, Users, Package, Download, Filter
} from 'lucide-react';

export default function Reports() {
  const { bills, clients, appointments, inventory } = useApp();
  const [filterRange, setFilterRange] = useState('currentMonth');
  
  const ranges = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días', 'Todo el tiempo'];

  // --- Data Processing for Charts ---
  
  // 1. Revenue by Day (Last 7 days)
  const getRevenueData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = bills
        .filter(b => b.date === dateStr)
        .reduce((acc, b) => acc + (b.total || 0), 0);
      
      data.push({
        name: date.toLocaleDateString('es-AR', { weekday: 'short' }),
        revenue: dayRevenue,
      });
    }
    return data;
  };

  // 2. Service Popularity (Calculated from appointments)
  const getServicePopularity = () => {
    const counts = {};
    appointments.forEach(apt => {
      counts[apt.service] = (counts[apt.service] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const revenueData = getRevenueData();
  const popularServices = getServicePopularity();

  // Global Stats
  const totalRevenue = bills.reduce((acc, b) => acc + (b.total || 0), 0);
  const totalAppointments = appointments.length;
  const totalClients = clients.length;
  const topService = popularServices[0]?.name || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Reportes"
          subtitle="Analizá el rendimiento de tu negocio"
        >
          <button
            onClick={() => toast.success('Exportando reporte...')}
            className="btn-primary text-sm flex items-center gap-1"
          >
            <Download size={16} />
            Exportar
          </button>
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Ingresos Totales</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</p>
              <div className="text-sm text-gray-500 mt-0.5">Histórico total</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Citas Totales</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalAppointments}</p>
              <div className="text-sm text-gray-500 mt-0.5">Atendidas y programadas</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Base de Clientes</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalClients}</p>
              <div className="text-sm text-gray-500 mt-0.5">Registros activos</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Servicio Top</h3>
              <p className="text-xl font-bold text-gray-900 mt-1 truncate px-2">{topService}</p>
              <div className="text-xs text-gray-500 mt-0.5">El más solicitado</div>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Filtrar por:</span>
          {ranges.map(range => (
            <button
              key={range}
              onClick={() => setFilterRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                ${filterRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Charts Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue Chart */}
          <div className="card p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 font-display flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-primary-500" />
              Ingresos últimos 7 días
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Services */}
          <div className="card p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 font-display flex items-center gap-2 mb-6">
              <Users size={18} className="text-primary-500" />
              Servicios más solicitados
            </h3>
            <div className="space-y-4 flex-1">
              {popularServices.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No hay datos de servicios aún</p>
              ) : (
                popularServices.map((service, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 transition-colors hover:bg-gray-100">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0 font-bold text-primary-600 text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.count} veces</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (service.count / (popularServices[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Clients & Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-3 flex items-center gap-2">
              <Users size={18} className="text-primary-500" />
              Clientes más frecuentes
            </h3>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr className="text-left">
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600">Nombre</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600 text-center">Visitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.sort((a, b) => (b.visits || 0) - (a.visits || 0)).slice(0, 5).map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-sm text-gray-900">{client.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-600 text-center font-medium">{client.visits || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-3 flex items-center gap-2">
              <Package size={18} className="text-amber-500" />
              Productos críticos
            </h3>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr className="text-left">
                    <th className="px-3 py-2 text-sm font-semibold text-amber-600">Producto</th>
                    <th className="px-3 py-2 text-sm font-semibold text-amber-600 text-center">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {inventory.filter(i => i.stock <= i.minStock).slice(0, 5).map(item => (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-3 py-2 text-sm text-gray-900">{item.name}</td>
                      <td className="px-3 py-2 text-sm text-amber-600 text-center font-bold">{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
