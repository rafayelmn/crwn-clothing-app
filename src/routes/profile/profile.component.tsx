import { FormEvent, ChangeEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormInput from '../../components/form-input/form-input.component';
import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';

import { SignInContainer, ButtonsContainer } from './profile.styles';
import { selectCurrentUser } from '../../store/user/user.selector';
import { useNavigate } from 'react-router-dom';
import {
  updateUserDocumentFieldStart,
  updateUserPasswordStart,
} from '../../store/user/user.action';

const defaultFormFields = {
  displayName: '',
  email: '',
  currentUserRequiredPassword: '',
  password: '',
  confirmPassword: '',
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserDisplayName = currentUser!.displayName;
  const currentUserEmail = currentUser!.email;

  const formFieldsWithCurrentUserInfo = {
    displayName: currentUserDisplayName,
    email: currentUserEmail,
    currentUserRequiredPassword: '',
    password: '',
    confirmPassword: '',
  };

  const [formFields, setFormFields] = useState(formFieldsWithCurrentUserInfo);
  const {
    displayName,
    email,
    currentUserRequiredPassword,
    password,
    confirmPassword,
  } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    if (
      formFields.email !== currentUserEmail ||
      formFields.displayName !== currentUserDisplayName
    ) {
      const newData = {
        email: formFields.email,
        displayName: formFields.displayName,
      };
      const newEmail = formFields.email;
      const currentUserPassword = formFields.currentUserRequiredPassword;
      dispatch(
        updateUserDocumentFieldStart(newData, newEmail, currentUserPassword)
      );
    }

    if (formFields.password !== formFieldsWithCurrentUserInfo.password) {
      const currentUserPassword = formFields.currentUserRequiredPassword;
      const newPassword = formFields.password;
      dispatch(updateUserPasswordStart(newPassword, currentUserPassword));
    }

    try {
      resetFormFields();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCancelUpdates = () => {
    resetFormFields();
    navigate('/');
  };

  return (
    <SignInContainer>
      <h2>Want to update profile?</h2>
      <span>Update profile</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />

        <FormInput
          label='Display Name'
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
        />

        <FormInput
          label='Password*'
          type='password'
          onChange={handleChange}
          name='currentUserRequiredPassword'
          value={currentUserRequiredPassword}
          required
        />

        <FormInput
          label='New Password: Leave Blank To Keep The Same'
          type='password'
          onChange={handleChange}
          name='password'
          value={password}
        />

        <FormInput
          label='Confirm New Password: Leave Blank To Keep The Same'
          type='password'
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
        />
        <ButtonsContainer>
          <Button type='submit'>Update</Button>
          <Button
            type='button'
            buttonType={BUTTON_TYPE_CLASSES.inverted}
            onClick={handleCancelUpdates}
          >
            Cancel
          </Button>
        </ButtonsContainer>
      </form>
    </SignInContainer>
  );
};

export default SignInForm;
