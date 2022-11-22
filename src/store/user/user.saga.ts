import { takeLatest, put, all, call } from 'typed-redux-saga/macro';
import { User, AuthError, AuthErrorCodes } from 'firebase/auth';

import { USER_ACTION_TYPES } from './user.types';

import {
  signInSuccess,
  signInFailed,
  signUpSuccess,
  signUpFailed,
  signOutSuccess,
  signOutFailed,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess,
  UpdateUserDocumentFieldStart,
  updateUserDocumentFieldSuccess,
  updateUserDocumentFieldFailed,
  UpdateUserPasswordStart,
  updateUserPasswordSuccess,
  updateUserPasswordFailed,
} from './user.action';

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
  AdditionalInformation,
  updateUserDocumentField,
  updateUserPassword,
} from '../../utils/firebase/firebase.utils';

export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AdditionalInformation
) {
  try {
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    );

    if (userSnapshot) {
      yield* put(
        signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
      );
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);
    yield* call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (userCredential) {
      const { user } = userCredential;
      yield* call(getSnapshotFromUserAuth, user);
    }
  } catch (error) {
    switch ((error as AuthError).code) {
      case AuthErrorCodes.INVALID_PASSWORD:
        alert('incorrect password for email');
        break;
      case AuthErrorCodes.USER_DELETED:
        alert('no user associated with this email');
        break;
      default:
        console.log(error);
    }
    yield* put(signInFailed(error as Error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signUp({
  payload: { email, password, displayName },
}: SignUpStart) {
  try {
    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (userCredential) {
      const { user } = userCredential;
      yield* put(signUpSuccess(user, { displayName }));
    }
  } catch (error) {
    if ((error as AuthError).code === AuthErrorCodes.EMAIL_EXISTS) {
      alert('Cannot create user, email already in use');
    } else {
      console.log('user creation encountered an error', error);
    }
    yield* put(signUpFailed(error as Error));
  }
}

export function* signOut() {
  try {
    yield* call(signOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* signInAfterSignUp({
  payload: { user, additionalDetails },
}: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* updateCurrentUserDocumentField({
  payload: { newData, newEmail, currentUserPassword },
}: UpdateUserDocumentFieldStart) {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(
      updateUserDocumentField,
      userAuth,
      newData,
      newEmail,
      currentUserPassword
    );
    yield* put(updateUserDocumentFieldSuccess());
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(updateUserDocumentFieldFailed(error as Error));
  }
}

export function* updateCurrentUserPassword({
  payload: { newPassword, currentUserPassword },
}: UpdateUserPasswordStart) {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(updateUserPassword, userAuth, newPassword, currentUserPassword);
    yield* put(updateUserPasswordSuccess());
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(updateUserPasswordFailed(error as Error));
  }
}

export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* onUpdateUserDocumentFieldStart() {
  yield* takeLatest(
    USER_ACTION_TYPES.UPDATE_USER_DOCUMENT_FIELD_START,
    updateCurrentUserDocumentField
  );
}

export function* onUpdateUserPasswordStart() {
  yield* takeLatest(
    USER_ACTION_TYPES.UPDATE_PASSWORD_START,
    updateCurrentUserPassword
  );
}

export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
    call(onUpdateUserDocumentFieldStart),
    call(onUpdateUserPasswordStart),
  ]);
}
