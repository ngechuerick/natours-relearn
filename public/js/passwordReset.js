import axios from 'axios';
import { alertMessage } from './alerts';

export const resetPassword = async function (email) {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });

    if (response.data.status === 'success') {
      alertMessage('success', `${response.data.message}`);
      window.setTimeout(() => {
        location.assign('/successpasswordreset');
      }, 2500);
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};

export const setNewPassword = async function (newPassword, passwordConfirm) {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const urlPathSegments = url.pathname.split('/');

  const token = urlPathSegments[urlPathSegments.length - 1];

  try {
    const response = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password: newPassword,
        passwordConfirm,
      },
    });

    if (response.data.status === 'success') {
      alertMessage('success', 'Password changed successfully.');
      window.setTimeout(() => {
        location.assign('/login');
      }, 2500);
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};
