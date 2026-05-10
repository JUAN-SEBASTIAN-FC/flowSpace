import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageComponents';
import Badge from '../../components/ui/Badge';
import {
  BarChart3, TrendingUp, Calendar, DollarSign,
  Users, Package, Download, Filter, ArrowUp, ArrowDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const monthlySales = [
  { name: 'Enero', sales: 28000 },
  { name: 'Febrero', sales: 32000 },
  { name: 'Marzo', sales: 35000 },
  { name: 'Abril', sales: 38000 },
  { name: 'Mayo', sales: 42000 },
  { name: 'Junio', sales: 45000 },
  { name: 'Julio', sales: 48000 },
  { name: 'Agosto', sales: 46000 },
  { name: 'Septiembre', sales: 44000 },
  { name: 'Octubre', sales: 43000 },
  { name: 'Noviembre', sales: 41000 },
  { name: 'Diciembre', sales: 49000 },
];

const popularServices = [
  { name: 'Corte + Peinado', count: 48, revenue: 408000 },
  { name: 'Coloración', count: 35, revenue: 385000 },
  { name: 'Manicura', count: 32, revenue: 264000 },
  { name: 'Barba', count: 28, revenue: 171600 },
];

export default function Reports() {
  const [filterRange, setFilterRange] = useState('currentMonth');
  const ranges = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días', 'Últimos 12 meses'];
  const selectedRange = ranges.find(r => r.startsWith(filterRange)) || ranges[0];

  // Generate sample chart data for the selected range
  const chartLabels = Array.from({ length: 12 }, (_, i) => 
    new Date(2026, 0, i + 1).toLocaleString('es-AR', { month: 'short' })
  );
  const chartData = chartLabels.slice(0, ranges.indexOf(filterRange) + 1).map((_, i) => ({
    name: chartLabels[i],
    sales: 25000 + i * 5000 + Math.floor(Math.random() * 5000),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Reportes"
          subtitle="Analizá el rendimiento de tu negocio"
          children={
            <button
              onClick={() => toast.success('Exportando reporte...')}
              className="btn-primary text-sm flex items-center gap-1"
            >
              <Download size={16} />
              Exportar
            </button>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Ingresos del mes</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1 flex-1">{'$ 385,200'}</p>
              <div className="text-sm text-gray-500 mt-0.5">+18% vs mes anterior</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Citas atendidas</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1 flex-1">{'142'}</p>
              <div className="text-sm text-gray-500 mt-0.5">+12% vs mes anterior</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Package size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Clientes nuevos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1 flex-1">{'28'}</p>
              <div className="text-sm text-gray-500 mt-0.5">+8%</div>
            </div>
          </div>
          <div className="card p-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <clock size={18} />
              </div>
              <h3 className="text-xs text-primary-600">Servicio más vendido</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1 flex-1">{popularServices[0].name}</p>
              <div className="text-xs text-gray-500 mt-0.5">{popularServices[0].count} veces</div>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Filtrar por:</span>
          {[selectedRange, ...ranges.slice(ranges.indexOf(selectedRange) + 1)].map(range => (
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
          {/* Income Chart */}
          <div className="bg-white rounded-xl p-4 shadow-card flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 font-display flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-primary-500" />
              Ingresos mensuales
            </h3>
            <div className="flex flex-col gap-2">
              {chartData.map((d, i) => (
                <div key={i} className="w-full bg-gray-100 rounded-t-lg rounded-b-lg overflow-hidden">
                  <Div className="h-3 gradient-brownrelative w-full bg-blue-500 rounded-lg group">
                    <Div className="h-3 bg-blue-500 rounded-t-lg group-hover:scale-105 transition-transform duration-150" />
                  </Div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Services */}
          <div className="bg-white rounded-xl p-4 shadow-card flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 font-display flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary-500" />
              Servicios más vendidos
            </h3>
            <div className="space-y-2 flex-1">
              {popularServices.map((service, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 transition-colors hover:bg-gray-100">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <service.icon size={14} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.count} servicios</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="fill-primary-600 rounded-full shadow-sm px-2"
                        style={{ width: `${Math.min(100, service.count / 10 * 10)}%` }}
                      ></div>
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{service.revenue.toLocaleString()} $</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Clients Frecuentes & Inventario Consumido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Clientes Frecuentes Table */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-3 flex items-center gap-2">
              <Users size={18} className="text-primary-500" />
              Clientes frecuentes
            </h3>
            <div className="overflow-hidden">
              <table className="w-full table table-zebra">
                <thead className="bg-primary-50">
                  <tr className="text-left">
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600">Nombre</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600">Visitas</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600">Última visita</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-600">Total gastado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary-100 hover:bg-primary-50">
                    <td className="px-3 py-2">Laura Martínez</td>
                    <td className="px-3 py-2 font-medium text-gray-900">12</td>
                    <td className="px-3 py-2 text-sm text-gray-600">Hoy</td>
                    <td className="px-3 py-2 font-medium text-gray-900">$ 12,340</td>
                  </tr>
                  <tr className="border-b border-primary-100 hover:bg-primary-50">
                    <td className="px-3 py-2">Sofía García</td>
                    <td className="px-3 py-2 font-medium text-gray-900">9</td>
                    <td className="px-3 py-2 text-sm text-gray-600">2 días atrás</td>
                    <td className="px-3 py-2 text-sm text-gray-900">$ 8,900</td>
                  </tr>
                  <tr className="border-b border-primary-100 hover:bg-primary-50">
                    <td className="px-3 py-2">Martín Díaz</td>
                    <td className="px-3 py-2 font-medium text-gray-900">5</td>
                    <td className="px-3 py-2 text-sm text-gray-600">5 días atrás</td>
                    <td className="px-3 py-2 text-sm text-gray-900">$ 5,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventario Consumido */}
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-3 flex items-center gap-2">
              <Package size={18} className="text-amber-500" />
              Inventario consumido
            </h3>
            <div className="overflow-hidden">
              <table className="w-full table table-zebra">
                <thead className="bg-amber-50">
                  <tr className="text-left">
                    <th className="px-3 py-2 text-sm font-semibold text-amber-600">Producto</th>
                    <th className="px-3 py-2 text-sm font-semibold text-amber-600">Cantidad</th>
                    <th className="px-3 py-2 text-sm font-semibold text-amber-600">Costo unitario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  <tr>
                    <td className="px-3 py-2">Shampoo Profesional 500ml</td>
                    <td className="px-3 py-2">2</td>
                    <td className="px-3 py-2 text-sm text-amber-600">$ 8,500</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Tinte Castaño 5.0</td>
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2 text-sm text-amber-600">$ 4,500</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Guantes Descartables x100</td>
                    <td className="px-3 py-2">0</td>
                    <td className="px-3 py-2 text-sm text-amber-600">$ 3,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}