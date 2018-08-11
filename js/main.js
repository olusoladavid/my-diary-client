// ---------------------- Globals -----------------------
const baseUrl = 'https://my-diary-api.herokuapp.com/api/v1';

// ---------------------- Responsive side menu --------------------

const closeMenuButton = document.querySelector('.js-close-menu');
const openMenuButton = document.querySelector('.js-open-menu');

const hideSideBar = () => {
  document.querySelector('.js-nav-list').style.display = 'none';
};

const showSideBar = () => {
  document.querySelector('.js-nav-list').style.display = 'block';
};

const toggleSideBar = () => {
  if (document.documentElement.clientWidth > 768) {
    document.querySelector('.js-nav-list').style.display = 'block';
  } else {
    document.querySelector('.js-nav-list').style.display = 'none';
  }
};

if (closeMenuButton) closeMenuButton.addEventListener('click', hideSideBar);
if (openMenuButton) openMenuButton.addEventListener('focus', showSideBar);
window.addEventListener('resize', toggleSideBar);

// -------------------- Authentication functions --------------

const signupForm = document.querySelector('.js-form-signup');

const loginForm = document.querySelector('.js-form-login');

const logoutBtn = document.querySelector('.js-logout');

const error = document.querySelector('.js-error-field');

const formFields = document.querySelectorAll('.form__input');

const showError = (msg) => {
  error.innerHTML = msg;
  error.style.display = 'block';
};

const hideError = () => {
  error.innerHTML = '';
  error.style.display = 'none';
};

const startProgress = (button) => {
  const btn = button;
  btn.innerHTML = '';
  btn.classList.add('button--loading');
};

const stopProgress = (button, label) => {
  const btn = button;
  btn.innerHTML = label;
  btn.classList.remove('button--loading');
};

const logOut = () => {
  localStorage.removeItem('accessToken');
  window.location.replace('index.html');
};

const processSignup = async (e) => {
  e.preventDefault();

  const button = document.querySelector('.js-login-button');

  startProgress(button);

  // get data from form fields
  const email = document.querySelector('.js-signup-email').value;
  const password = document.querySelector('.js-signup-password').value;
  const repassword = document.querySelector('.js-signup-repassword').value;

  // check if passwords are same
  if (password !== repassword) {
    showError('Password does not match');
    stopProgress(button, 'Signup');
    return;
  }

  // prepare request
  const data = JSON.stringify({
    email,
    password,
  });
  const request = {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' },
  };

  // send request
  try {
    const rawResponse = await fetch(`${baseUrl}/auth/signup`, request);
    const { status } = rawResponse;
    const parsedResponse = await rawResponse.json();
    if (status === 201) {
      localStorage.setItem('accessToken', parsedResponse.token);
      window.location.replace('stories.html');
    } else if (Array.isArray(parsedResponse.error.message)) {
      const errorList = parsedResponse.error.message;
      let message = errorList.reduce((errStr, errObj) => `${errStr}<br>* ${errObj.msg}`, '');
      message = `The following errors occurred:<br>${message}`;
      showError(message);
      stopProgress(button, 'Signup');
    } else {
      showError(parsedResponse.error.message);
      stopProgress(button, 'Signup');
    }
  } catch (err) {
    showError('An error occurred');
    stopProgress(button, 'Signup');
  }
};

const processLogin = async (e) => {
  e.preventDefault();
  const button = document.querySelector('.js-login-button');

  startProgress(button);

  // get data from form fields
  const email = document.querySelector('.js-login-email').value;
  const password = document.querySelector('.js-login-password').value;

  // prepare request
  const data = JSON.stringify({
    email,
    password,
  });
  const request = {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' },
  };

  // send request
  try {
    const rawResponse = await fetch(`${baseUrl}/auth/login`, request);
    const { status } = rawResponse;
    const parsedResponse = await rawResponse.json();
    if (status === 200) {
      localStorage.setItem('accessToken', parsedResponse.token);
      window.location.replace('stories.html');
    } else if (Array.isArray(parsedResponse.error.message)) {
      const errorList = parsedResponse.error.message;
      let message = errorList.reduce((errStr, errObj) => `${errStr}<br>* ${errObj.msg}`, '');
      message = `The following errors occurred:<br>${message}`;
      showError(message);
      stopProgress(button, 'Login');
    } else {
      showError(parsedResponse.error.message);
      stopProgress(button, 'Login');
    }
  } catch (err) {
    showError('An error occurred');
    stopProgress(button, 'Login');
  }
};

if (signupForm) signupForm.addEventListener('submit', processSignup);

if (loginForm) loginForm.addEventListener('submit', processLogin);

if (logoutBtn) logoutBtn.addEventListener('click', logOut);

formFields.forEach((field) => {
  if (field) field.addEventListener('focus', hideError);
});

// -------------------- Stories.html functions --------------------------



const fetchAllEntries = async (e) => {
  e.preventDefault();
  const button = document.querySelector('.js-login-button');

  startProgress(button);

  // get data from form fields
  const email = document.querySelector('.js-login-email').value;
  const password = document.querySelector('.js-login-password').value;

  // prepare request
  const data = JSON.stringify({
    email,
    password,
  });
  const request = {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' },
  };

  // send request
  try {
    const rawResponse = await fetch(`${baseUrl}/auth/login`, request);
    const { status } = rawResponse;
    const parsedResponse = await rawResponse.json();
    if (status === 200) {
      localStorage.setItem('accessToken', parsedResponse.token);
      window.location.replace('stories.html');
    } else if (Array.isArray(parsedResponse.error.message)) {
      const errorList = parsedResponse.error.message;
      let message = errorList.reduce((errStr, errObj) => `${errStr}<br>* ${errObj.msg}`, '');
      message = `The following errors occurred:<br>${message}`;
      showError(message);
      stopProgress(button, 'Login');
    } else {
      showError(parsedResponse.error.message);
      stopProgress(button, 'Login');
    }
  } catch (err) {
    showError('An error occurred');
    stopProgress(button, 'Login');
  }
};

// -------- Single Story functions --------------------------

let editMode = false;

const modal = document.querySelector('.js-modal');
const storyDeleteBtn = document.querySelector('.js-delete-story');
const storyEditBtn = document.querySelector('.js-edit-story');
const modalCancelBtn = document.querySelector('.js-cancel-modal');
const modalConfirmBtn = document.querySelector('.js-confirm-modal');
const favBtn = document.querySelector('.js-icon-heart');

const showDeleteModal = () => {
  modal.style.display = 'block';
};
const hideDeleteModal = () => {
  modal.style.display = 'none';
};

const confirmDelete = () => {
  // DELETE fetch operation
  modal.style.display = 'none';
};

const toggleFavorite = (e) => {
  e.target.classList.toggle('icon--heart-active');
};

const editStory = (e) => {
  const el = document.querySelector('.js-story-content');
  if (!editMode) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[0], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
    e.target.innerHTML = 'Save';
    editMode = true;
  } else {
    /* perform fetch operation */
    e.target.innerHTML = 'Edit';
    editMode = false;
    window.focus();
  }
};

if (storyDeleteBtn) storyDeleteBtn.addEventListener('click', showDeleteModal);
if (storyEditBtn) storyEditBtn.addEventListener('click', editStory);
if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', confirmDelete);
if (modalCancelBtn) modalCancelBtn.addEventListener('click', hideDeleteModal);
if (favBtn) favBtn.addEventListener('click', toggleFavorite);
