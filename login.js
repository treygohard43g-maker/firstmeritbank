// First Merit Bank
// Login

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginButton = document.querySelector(".auth-button");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message, type = "") {
  loginMessage.textContent = message;
  loginMessage.className = "auth-message";

  if (type) {
    loginMessage.classList.add(type);
  }
}

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = document
    .getElementById("loginEmail")
    .value
    .trim();

  const password = document
    .getElementById("loginPassword")
    .value;

  if (!email || !password) {
    showMessage("Please enter your email and password.", "error");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Signing In...";

  showMessage("Signing you in...");

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    showMessage(
      "Login successful. Opening dashboard...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);

  } catch (error) {

    console.error("Login error:", error);

    let message = "Unable to sign in.";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      message = "Incorrect email or password.";
    }

    if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email address.";
    }

    if (error.code === "auth/network-request-failed") {
      message = "Network error. Check your internet connection.";
    }

    showMessage(message, "error");

    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
  }
});
