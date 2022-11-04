import useAuth from '../../hooks/useAuth';
import './user-profile.style.css';

import { ReactComponent as UserImage } from '../../assets/profileimage.svg';

const Profile = () => {
  const user = useAuth();

  return (
    <div className='wrapper'>
      <div className='left'>
        <UserImage alt='user' width='100' />
        <h4>{user.displayName}</h4>
      </div>
      <div className='right'>
        <div className='info'>
          <h3>Information</h3>
          <div className='info_data'>
            <div className='data'>
              <h4>Email</h4>
              <p>{user.email}</p>
            </div>
            <div className='data'>
              <h4>Phone</h4>
              <p>0001-213-998761</p>
            </div>
          </div>
        </div>

        <div className='products'>
          <h3>Products</h3>
          <div className='products_data'>
            <div className='data'>
              <h4>Recent</h4>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className='data'>
              <h4>Most Viewed</h4>
              <p>dolor sit amet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
