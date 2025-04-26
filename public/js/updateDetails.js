import axios from 'axios';
import { alertMessage } from './alerts';

/**We want to update user's details (i.e name,email) */
export const updateDetails = async function (formData) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        name: formData.name,
        email: formData.email,
        photo: formData.photo,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      alertMessage('success', 'Updated Your Details successfuly.');
      window.setTimeout(() => {
        location.assign('/me');
      }, 2500);
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};

export const updatePassword = async function (
  curPassword,
  newPassword,
  passwordConfirm,
) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updatePassword',
      data: {
        curPassword,
        newPassword,
        passwordConfirm,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      alertMessage('success', 'Updated Your Password successfuly.');
      window.setTimeout(() => {
        location.assign('/me');
      }, 2500);
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};
