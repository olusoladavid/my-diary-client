// ---------------------- Globals and Utilities-----------------------
const baseUrl = 'https://my-diary-api.herokuapp.com/api/v1';

/**
 * Parses query string into JSON object
 * - string format is the format returned by location.search
 * @param {*} queryString
 */
const queryToJSON = (queryString) => {
  if (!(queryString.includes('?') && queryString.includes('='))) return {};
  const queryStr = queryString.slice(1).split('&');
  const queryJSON = {};
  queryStr.forEach((keyValue) => {
    const keyValArr = keyValue.split('=');
    queryJSON[keyValArr[0]] = decodeURIComponent(keyValArr[1] || '');
  });
  return queryJSON;
};

const jsonToQuery = (queryObj) => {
  if (!Object.keys(queryObj).length) return '';
  const queryKeys = Object.keys(queryObj);
  const queryKeyValue = queryKeys.map(key => `${key}=${encodeURIComponent(queryObj[key])}`);
  const queryString = `?${queryKeyValue.join('&')}`;
  return queryString;
};

const handleCommonErrors = (status, resp) => {
  switch (status) {
    case 401:
      window.location.replace('login.html');
      break;
    default:
      // TODO: toast the error message
  }
};

// const makeToast = (type, message) => {
// }

const reportNetworkError = () => {
  // toast message here
};

const makeRequest = async (method, requestUrl, body = null,
  successCb, catchCb = reportNetworkError, finallyCb) => {
  // prepare request
  const token = localStorage.getItem('accessToken');
  const request = {
    method,
    mode: 'cors',
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  // send request
  try {
    const rawResponse = await fetch(requestUrl, request);
    const { status } = rawResponse;
    const parsedResponse = await rawResponse.json();
    successCb(status, parsedResponse);
  } catch (err) {
    catchCb();
  } finally {
    finallyCb();
  }
};


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
if (openMenuButton) openMenuButton.addEventListener('click', showSideBar);
window.addEventListener('resize', toggleSideBar);

// -------------------- Authentication and form functions --------------

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
    } else if (status === 400) {
      const errorList = parsedResponse.error;
      let message = errorList.reduce((errStr, errObj) => `${errStr}* ${errObj.message}<br>`, '');
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
    } else if (status === 400) {
      const errorList = parsedResponse.error;
      let message = errorList.reduce((errStr, errObj) => `${errStr}* ${errObj.message}<br>`, '');
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
const storyCard = document.querySelector('#js-story-card');
const storyList = document.querySelector('.js-story-list');

const getStoryCard = () => document.importNode(storyCard.content, true);

// start a non-blocking fetch to endpoint
const loadStories = async (queryObj) => {
  // form query string from queryObj
  const queryString = jsonToQuery(queryObj);
  // set request url
  const requestUrl = `${baseUrl}/entries${queryString}`;
  // prepare request
  const token = localStorage.getItem('accessToken');
  const request = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  // send request
  try {
    // TODO: inform user that fetch has started
    const rawResponse = await fetch(requestUrl, request);
    const { status } = rawResponse;
    const parsedResponse = await rawResponse.json();
    if (status === 200) {
      // when fetch is complete, iterate over entries
      const { entries } = parsedResponse;
      // foreach iteration, populate the story-card template with entry details
      if (entries.length) {
        entries.forEach((entry) => {
          const {
            id, title, content, created_on: createdOn,
          } = entry;
          const storyDate = new Date(createdOn);
          const card = getStoryCard();
          card.querySelector('.story-list__item').setAttribute('data-story-id', id);
          card.querySelector('.date__day').innerHTML = storyDate.getDay();
          card.querySelector('.date__month').innerHTML = storyDate.getMonth();
          card.querySelector('.date__year').innerHTML = storyDate.getFullYear();
          card.querySelector('.caption__title').innerHTML = title;
          card.querySelector('.caption__content').innerHTML = `${content.substring(0, 100)}...`;
          card.querySelector('.item__link').href = `story.html?id=${id}`;
          // append node to story-list
          storyList.appendChild(card);
          // TODO: hide progress toast
        });
      } else {
        const storyDate = new Date();
        const card = getStoryCard();
        card.querySelector('.date__day').innerHTML = storyDate.getDay();
        card.querySelector('.date__month').innerHTML = storyDate.getMonth();
        card.querySelector('.date__year').innerHTML = storyDate.getFullYear();
        card.querySelector('.caption__title').innerHTML = 'You have not added any story';
        card.querySelector('.caption__content').innerHTML = 'Click on this card to add your first story';
        card.querySelector('.item__link').href = 'new-story.html';
        card.querySelector('.item__overlay').innerHTML = 'Write a story';
        // append node to story-list
        storyList.appendChild(card);
        // TODO: hide progress toast
      }
    } else {
      handleCommonErrors(status, parsedResponse);
    }
  } catch (err) {
    // TODO: toast connection error message
  }
};


// -------------------- Router functions --------------------------

const resolveRoute = () => {
  // get url
  const path = window.location.pathname;
  const queries = queryToJSON(window.location.search);
  // match path -- switch(n)
  switch (path) {
    case '/stories.html':
      loadStories(queries);
      break;
    case '/story.html':
      loadStory(queries);
      break;
    case '/profile.html':
      loadProfile();
      break;
    default:
  }
};

// on page load, resolve route
window.addEventListener('DOMContentLoaded', resolveRoute);
