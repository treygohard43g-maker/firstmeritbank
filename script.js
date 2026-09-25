import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { auth } from "./firebase.js";


/* =========================================
   SIGN UP
========================================= */

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

if (signupForm) {

  signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (!fullName || !email || !password || !confirmPassword) {
      signupMessage.textContent =
        "Please complete all required fields.";
      return;
    }

    if (password !== confirmPassword) {
      signupMessage.textContent =
        "Passwords do not match.";
      return;
    }

    if (password.length < 6) {
      signupMessage.textContent =
        "Password must be at least 6 characters.";
      return;
    }

    signupMessage.textContent =
      "Creating your account...";

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName
      });

      await sendEmailVerification(user);

      signupMessage.textContent =
        "Account created! Check your email to verify your account.";

      signupForm.reset();

    } catch (error) {

      console.error(error);

      if (error.code === "auth/email-already-in-use") {

        signupMessage.textContent =
          "An account with this email already exists.";

      } else if (error.code === "auth/invalid-email") {

        signupMessage.textContent =
          "Please enter a valid email address.";

      } else if (error.code === "auth/weak-password") {

        signupMessage.textContent =
          "Your password is too weak.";

      } else {

        signupMessage.textContent =
          "Could not create the account. Please try again.";

      }

    }

  });

}


/* =========================================
   LOGIN
========================================= */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("loginEmail").value.trim();

    const password =
      document.getElementById("loginPassword").value;

    if (!email || !password) {

      loginMessage.textContent =
        "Please enter your email and password.";

      return;
    }

    loginMessage.textContent =
      "Signing you in...";

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      loginMessage.textContent =
        "Login successful. Opening your dashboard...";

      window.location.href = "dashboard.html";

    } catch (error) {

      console.error(error);

      if (error.code === "auth/invalid-credential" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found") {

        loginMessage.textContent =
          "Incorrect email or password.";

      } else if (error.code === "auth/invalid-email") {

        loginMessage.textContent =
          "Please enter a valid email address.";

      } else {

        loginMessage.textContent =
          "Unable to sign in. Please try again.";

      }

    }

  });

}
