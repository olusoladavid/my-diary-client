// globals
const baseUrl = "https://my-diary-api.herokuapp.com/api/v1";

// Responsive side menu

const closeMenuButton = document.querySelector(".js-close-menu");
const openMenuButton = document.querySelector(".js-open-menu");

const hideSideBar = e => {
  document.querySelector(".js-nav-list").style.display = "none";
};

const showSideBar = e => {
  document.querySelector(".js-nav-list").style.display = "block";
};

const toggleSideBar = e => {
  if (document.documentElement.clientWidth > 768) {
    document.querySelector(".js-nav-list").style.display = "block";
  } else {
    document.querySelector(".js-nav-list").style.display = "none";
  }
};

if (closeMenuButton) closeMenuButton.addEventListener("click", hideSideBar);
if (openMenuButton) openMenuButton.addEventListener("focus", showSideBar);
window.addEventListener("resize", toggleSideBar);

// Authentication functions

const signupForm = document.querySelector(".js-form-signup");

const loginForm = document.querySelector(".js-form-login");

const logout_btn = document.querySelector(".js-logout");

const processSignup = e => {
  e.preventDefault();
  const button = document.querySelector(".js-login-button");
  const error = document.querySelector(".js-error-field");

  startProgress(button);
  // get data from form fields
  const email = document.querySelector(".js-signup-email").value;
  const password = document.querySelector(".js-signup-password").value;
  const repassword = document.querySelector(".js-signup-repassword").value;
  // check if passwords are same
  if (password !== repassword) {
    showError(error, "Password does not match");
    stopProgress(button, "Signup");
    return;
  }
  // prepare request
  const data = JSON.stringify({
    email,
    password
  });
  const fetchData = {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/json" }
  };
  // send request
  let status;
  fetch(`${baseUrl}/auth/signup`, fetchData)
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      if (status === 201) {
        localStorage.setItem("accessToken", data.token);
        window.location.replace("stories.html");
      } else {
        showError(error, data.error.message);
        stopProgress(button, "Signup");
      }
    })
    .catch(err => {
      showError(error, "A connection error occurred");
      stopProgress(button, "Signup");
    });
};

const processLogin = e => {
  e.preventDefault();
  const button = document.querySelector(".js-login-button");
  const error = document.querySelector(".js-error-field");

  startProgress(button);
  // get data from form fields
  const email = document.querySelector(".js-login-email").value;
  const password = document.querySelector(".js-login-password").value;

  // prepare request
  const data = JSON.stringify({
    email,
    password
  });
  const fetchData = {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/json" }
  };

  // send request
  let status;
  fetch(`${baseUrl}/auth/login`, fetchData)
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      if (status === 200) {
        localStorage.setItem("accessToken", data.token);
        window.location.replace("stories.html");
      } else {
        showError(error, data.error.message);
        stopProgress(button, "Login");
      }
    })
    .catch(err => {
      showError(error, "An error occurred");
      stopProgress(button, "Login");
    });
};

const showError = (errField, msg) => {
  errField.innerHTML = msg;
  errField.style.display = "block";
};

const hideError = errField => {
  errField.innerHTML = "";
  errField.style.display = "none";
};

const startProgress = button => {
  button.innerHTML = "";
  button.classList.add("button--loading");
};

const stopProgress = (button, label) => {
  button.innerHTML = label;
  button.classList.remove("button--loading");
};

const logOut = () => {
  localStorage.removeItem("accessToken");
  window.location.replace("index.html");
};

if (signupForm) signupForm.addEventListener("submit", processSignup);

if (loginForm) loginForm.addEventListener("submit", processLogin);

if (logout_btn) logout_btn.addEventListener("click", logOut);

// Story functions

let editMode = false;

const modal = document.querySelector(".js-modal");
const storyDeleteBtn = document.querySelector(".js-delete-story");
const storyEditBtn = document.querySelector(".js-edit-story");
const modalCancelBtn = document.querySelector(".js-cancel-modal");
const modalConfirmBtn = document.querySelector(".js-confirm-modal");
const favBtn = document.querySelector(".js-icon-heart");

const showDeleteModal = e => {
  modal.style.display = "block";
};
const hideDeleteModal = e => {
  modal.style.display = "none";
};

const confirmDelete = e => {
  // DELETE fetch operation
  modal.style.display = "none";
};

const toggleFavorite = e => {
  e.target.classList.toggle("icon--heart-active");
};

const editStory = e => {
  const el = document.querySelector(".js-story-content");
  if (!editMode) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[0], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
    e.target.innerHTML = "Save";
    editMode = true;
  } else {
    /* perform fetch operation */
    e.target.innerHTML = "Edit";
    editMode = false;
    window.focus();
  }
};

if (storyDeleteBtn) storyDeleteBtn.addEventListener("click", showDeleteModal);
if (storyEditBtn) storyEditBtn.addEventListener("click", editStory);
if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", confirmDelete);
if (modalCancelBtn) modalCancelBtn.addEventListener("click", hideDeleteModal);
if (favBtn) favBtn.addEventListener("click", toggleFavorite);
