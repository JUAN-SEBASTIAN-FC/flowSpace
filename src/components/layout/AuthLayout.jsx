import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}