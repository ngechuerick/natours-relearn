import { login, logout } from './login';
import { bookTour } from './stripe';
import { displayMap } from './mapbox';
import '@babel/polyfill';
import { updateDetails, updatePassword } from './updateDetails';
import { resetPassword, setNewPassword } from './passwordReset';
import { signup } from './signup';

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const locations = JSON.parse(mapElement.dataset.locations || '[]');
    displayMap(locations);
  }

  /**Updating user's data */
  const userDataForm = document.querySelector('.form-user-data');

  if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
      e.preventDefault();

      const photo = document.querySelector('#photo').files[0];
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;

      updateDetails({ name: name, email: email, photo: photo });
    });
  }

  /**Updating user's password */
  const userPasswordDataForm = document.querySelector('.form-user-settings');

  if (userPasswordDataForm) {
    userPasswordDataForm.addEventListener('submit', e => {
      e.preventDefault();

      const curPassword = document.getElementById('password-current').value;
      const newPassword = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;

      updatePassword(curPassword, newPassword, passwordConfirm);
    });
  }

  /**Login functionality */
  const form = document.querySelector('.form--login');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const loginBtn = document.querySelector('.btn-login');
      loginBtn.classList.add('loading');

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      login(email, password);

      loginBtn.classList.remove('loading');
    });
  }

  /**Lets log out the user */
  const logoutBtn = document.querySelector('.nav__el--logout');

  if (logoutBtn)
    logoutBtn.addEventListener('click', () => {
      logout();
    });

  /**handling book button payment */
  const bookBtn = document.getElementById('book-tour');

  if (bookBtn) {
    bookBtn.addEventListener('click', function (e) {
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      bookTour(tourId);

      e.target.textContent = 'Book tour now';
    });
  }

  /**Password reset functionality */
  const resetForm = document.querySelector('.form--reset');
  if (resetForm) {
    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;

      resetPassword(email);
    });
  }

  /**Password update functionality */
  const passwordUpdateForm = document.querySelector('.form--update__password');

  if (passwordUpdateForm) {
    passwordUpdateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const newPassword = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;

      setNewPassword(newPassword, passwordConfirm);
    });
  }

  /**User creating an account functionality */
  const createUserform = document.querySelector('.form--signup');

  if (createUserform) {
    createUserform.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;

      signup(name, email, password, passwordConfirm);
    });
  }
});
