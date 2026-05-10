export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    success: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    danger:  'bg-red-50 text-red-700 ring-1 ring-red-600/20',
    info:    'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
    neutral: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20',
    primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-600/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}