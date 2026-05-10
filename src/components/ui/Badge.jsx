export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    success: 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
    warning: 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20',
    danger:  'bg-red-100 text-red-700 ring-1 ring-red-600/20',
    info:    'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20',
    neutral: 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20',
    primary: 'bg-primary-100 text-primary-700 ring-1 ring-primary-600/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
