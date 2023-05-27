/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./leaflet";
import { login } from "./login";

// DOM elements
const leafletMap = document.getElementById("map");
const loginForm = document.querySelector(".form");

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
