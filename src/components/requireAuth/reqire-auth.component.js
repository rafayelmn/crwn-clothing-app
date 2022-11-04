import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = () => {
  const currentUser = useAuth();
  const location = useLocation();

  return currentUser?.email && currentUser?.displayName ? (
    <Outlet />
  ) : (
    <Navigate to='/auth' state={{ from: location }} replace />
  );
};

export default RequireAuth;
