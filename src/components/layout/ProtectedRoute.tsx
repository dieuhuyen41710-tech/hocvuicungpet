import { Navigate, Outlet } from 'react-router';
import { useAppStore } from '../../store/useAppStore';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser) {
    if (allowedRoles.includes('GUEST')) {
      return <Outlet />;
    }
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
