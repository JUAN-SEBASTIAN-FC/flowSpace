import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'primary', subtitle }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green:   'bg-green-50 text-green-600',
    amber:   'bg-amber-50 text-amber-600',
    red:     'bg-red-50 text-red-600',
    blue:    'bg-blue-50 text-blue-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {change >= 0 ? (
            <span className="stat-change-positive flex items-center gap-0.5">
              <TrendingUp size={12} /> +{change}%
            </span>
          ) : (
            <span className="stat-change-negative flex items-center gap-0.5">
              <TrendingDown size={12} /> {change}%
            </span>
          )}
          <span className="text-xs text-gray-400">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}