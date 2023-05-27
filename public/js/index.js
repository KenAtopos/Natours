/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./leaflet";
import { login, logout } from "./login";

// DOM elements
const leafletMap = document.getElementById("map");
const loginForm = document.querySelector(".form");
const logoutBtn = document.querySelector(".nav__el--logout");

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
