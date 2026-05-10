import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'primary', subtitle }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 ring-primary-500/20',
    green:   'bg-green-50 text-green-600 ring-green-500/20',
    amber:   'bg-amber-50 text-amber-600 ring-amber-500/20',
    red:     'bg-red-50 text-red-600 ring-red-500/20',
    blue:    'bg-blue-50 text-blue-600 ring-blue-500/20',
  };

  return (
    <div className="card p-5 group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
          {Icon && <Icon size={20} />}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
            change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {change >= 0 ? `+${change}%` : `${change}%`}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 font-display tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
