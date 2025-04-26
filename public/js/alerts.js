function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

export function alertMessage(type, message) {
  /**Hide any alerts */
  hideAlert();

  const element = `<div class="alert alert--${type}">${message} </div>`;
  document.querySelector('.main').insertAdjacentHTML('afterbegin', element);

  /**Remove the alert message after 4seconds */
  window.setTimeout(hideAlert, 4000);
}
