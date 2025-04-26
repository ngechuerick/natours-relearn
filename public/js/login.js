import axios from 'axios';

import { alertMessage } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      alertMessage('success', 'Logged in successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 2500);

      return res;
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      withCredentials: true,
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};
