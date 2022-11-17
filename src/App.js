import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';

import { Routes, Route } from 'react-router-dom';

// import {
//   onAuthStateChangedListener,
//   createUserDocumentFromAuth,
//   getCurrentUser,
// } from './utils/firebase/firebase.utils';

import Spinner from './components/spinner/spinner.component';

import {
  // setCurrentUser
  checkUserSession,
} from './store/user/user.action';

const Navigation = lazy(() =>
  import('./routes/navigation/navigation.component')
);
const Home = lazy(() => import('./routes/home/home.component'));
const Shop = lazy(() => import('./routes/shop/shop.component'));
const Authentication = lazy(() =>
  import('./routes/authentication/authentication.component')
);
const Checkout = lazy(() => import('./routes/checkout/checkout.component'));
const PrivateRoutes = lazy(() =>
  import('./utils/private-routes/private-route.component')
);
const Profile = lazy(() => import('./routes/profile/profile.component'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // const unsubscribe = onAuthStateChangedListener((user) => {
    //   if (user) {
    //     createUserDocumentFromAuth(user);
    //   }
    //   dispatch(setCurrentUser(user));
    // });

    // return unsubscribe;
    dispatch(checkUserSession());
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='shop/*' element={<Shop />} />
          <Route path='auth' element={<Authentication />} />
          <Route path='checkout' element={<Checkout />} />
          <Route element={<PrivateRoutes />}>
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path='*' element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
