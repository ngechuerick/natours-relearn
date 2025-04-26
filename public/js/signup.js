import axios from 'axios';
import { alertMessage } from './alerts';

export const signup = async function (name, email, password, passwordConfirm) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/newUser',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alertMessage('success', 'Created account successfully.');
      window.setTimeout(() => {
        location.assign('/login');
      }, 2500);

      return res;
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK') {
      alertMessage('error', err.message);
    } else alertMessage('error', err.response.data.message);
  }
};
