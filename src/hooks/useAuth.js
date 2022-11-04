import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/user/user.selector';

const useAuth = () => {
  return useSelector(selectCurrentUser);
};

export default useAuth;
