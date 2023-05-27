/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./leaflet";
import { login, logout } from "./login";
import { updateData } from "./updateSettings";

// DOM elements
const leafletMap = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");

// delegation
if (leafletMap) {
  const locations = JSON.parse(leafletMap.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = document.getElementById("name").value;
    const userEmail = document.getElementById("email").value;

    updateData(userName, userEmail);
  });
}
