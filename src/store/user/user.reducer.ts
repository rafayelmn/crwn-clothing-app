import { AnyAction } from 'redux';

import {
  signInFailed,
  signUpFailed,
  signOutFailed,
  signOutSuccess,
  signInSuccess,
  updateUserPasswordSuccess,
  updateUserPasswordFailed,
  // updateUserEmailFailed,
  // updateUserEmailSuccess,
} from './user.action';

import { UserData } from '../../utils/firebase/firebase.utils';

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const userReducer = (state = INITIAL_STATE, action: AnyAction) => {
  if (signInSuccess.match(action)) {
    return { ...state, currentUser: action.payload };
  }

  if (signOutSuccess.match(action)) {
    return { ...state, currentUser: null };
  }

  // if (updateUserEmailSuccess.match(action)) {
  //   return { ...state };
  // }

  if (updateUserPasswordSuccess.match(action)) {
    return { ...state };
  }

  if (
    signInFailed.match(action) ||
    signUpFailed.match(action) ||
    signOutFailed.match(action) ||
    // updateUserEmailFailed.match(action) ||
    updateUserPasswordFailed.match(action)
  ) {
    return { ...state, error: action.payload };
  }

  return state;
};
