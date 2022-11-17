import { Outlet, Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../../store/user/user.selector';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
  let currentUser = useSelector(selectCurrentUser);
  return currentUser && currentUser?.email && currentUser?.displayName ? (
    <Outlet />
  ) : (
    <Navigate to='/auth' />
  );
};

export default PrivateRoutes;
