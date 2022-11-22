import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  NextOrObserver,
  User,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
  UpdateData,
  DocumentData,
} from 'firebase/firestore';

import { Category } from '../../store/categories/category.types';

const firebaseConfig = {
  apiKey: 'AIzaSyC7_yAVtQpAs8Ub5TYlaZ-MXDvHJ7KjZZA',
  authDomain: 'crwn-clothing-db-add80.firebaseapp.com',
  projectId: 'crwn-clothing-db-add80',
  storageBucket: 'crwn-clothing-db-add80.appspot.com',
  messagingSenderId: '686951549865',
  appId: '1:686951549865:web:d8bd6bc82acacfb95012b8',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export type ObjectToAdd = {
  title: string;
};

export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
  collectionKey: string,
  objectsToAdd: T[]
): Promise<void> => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as Category
  );
};

export type AdditionalInformation = {
  displayName?: string;
};

export type UserData = {
  createdAt: Date;
  displayName: string;
  email: string;
};

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation = {} as AdditionalInformation
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error);
    }
  }

  return userSnapshot as QueryDocumentSnapshot<UserData>;
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

export const updateUserDocumentField = async (
  userAuth: User,
  data: UpdateData<DocumentData>,
  newEmail: string,
  currentUserPassword: string
): Promise<void> => {
  try {
    const credentials = EmailAuthProvider.credential(
      userAuth?.email!,
      currentUserPassword
    );
    await reauthenticateWithCredential(userAuth, credentials);
    const userDocRef = doc(db, 'users', userAuth.uid);
    await updateDoc(userDocRef, data).then(() => {});
  } catch (error) {
    return alert(error);
  }

  return await updateEmail(userAuth, newEmail).then(() => {
    console.log('email identifier updated: !');
  });
};

export const updateUserPassword = async (
  userAuth: User,
  newPassword: string,
  currentUserPassword: string
): Promise<void> => {
  try {
    const credentials = EmailAuthProvider.credential(
      userAuth?.email!,
      currentUserPassword
    );
    await reauthenticateWithCredential(userAuth, credentials);
    if (currentUserPassword === newPassword)
      throw new Error('new password must be different');
  } catch (error) {
    return alert(error);
  }

  return updatePassword(userAuth, newPassword).then(() => {
    console.log('password updated: !');
  });
};
