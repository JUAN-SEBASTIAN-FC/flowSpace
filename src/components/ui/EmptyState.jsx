import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-soft ring-1 ring-gray-100 group">
        <Icon size={32} className="text-gray-300 group-hover:text-primary-400 transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 font-display mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="animate-slide-up">
          {action}
        </div>
      )}
    </div>
  );
}
