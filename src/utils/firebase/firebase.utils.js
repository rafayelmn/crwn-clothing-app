import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC7_yAVtQpAs8Ub5TYlaZ-MXDvHJ7KjZZA',
  authDomain: 'crwn-clothing-db-add80.firebaseapp.com',
  projectId: 'crwn-clothing-db-add80',
  storageBucket: 'crwn-clothing-db-add80.appspot.com',
  messagingSenderId: '686951549865',
  appId: '1:686951549865:web:d8bd6bc82acacfb95012b8',
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);