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

    const fullName =
      document.getElementById("fullName")?.value.trim();

    const email =
      document.getElementById("signupEmail")?.value.trim();

    const password =
      document.getElementById("signupPassword")?.value;

    const confirmPassword =
      document.getElementById("confirmPassword")?.value;


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


      try {
        await sendEmailVerification(user);
      } catch (emailError) {
        console.warn(
          "Verification email could not be sent:",
          emailError
        );
      }


      signupMessage.textContent =
        "Account created successfully! Redirecting to login...";


      /*
        Give the user a moment to see
        the success message.
      */

      setTimeout(() => {

        window.location.href = "login.html";

      }, 1500);


    } catch (error) {

      console.error("Signup error:", error);


      if (error.code === "auth/email-already-in-use") {

        signupMessage.textContent =
          "An account with this email already exists.";

      }

      else if (error.code === "auth/invalid-email") {

        signupMessage.textContent =
          "Please enter a valid email address.";

      }

      else if (error.code === "auth/weak-password") {

        signupMessage.textContent =
          "Password must be at least 6 characters.";

      }

      else if (error.code === "auth/operation-not-allowed") {

        signupMessage.textContent =
          "Email/Password sign-in is not enabled in Firebase.";

      }

      else {

        signupMessage.textContent =
          "Account creation failed: " + error.message;

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
      document.getElementById("loginEmail")?.value.trim();

    const password =
      document.getElementById("loginPassword")?.value;


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


      setTimeout(() => {

        window.location.href = "dashboard.html";

      }, 500);


    } catch (error) {

      console.error("Login error:", error);


      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {

        loginMessage.textContent =
          "Incorrect email or password.";

      }

      else if (error.code === "auth/invalid-email") {

        loginMessage.textContent =
          "Please enter a valid email address.";

      }

      else {

        loginMessage.textContent =
          "Unable to sign in: " + error.message;

      }

    }

  });

}
 
