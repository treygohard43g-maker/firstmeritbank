import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { auth } from "./firebase.js";

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
      signupMessage.textContent = "Please complete all required fields.";
      return;
    }

    if (password !== confirmPassword) {
      signupMessage.textContent = "Passwords do not match.";
      return;
    }

    if (password.length < 6) {
      signupMessage.textContent =
        "Password must be at least 6 characters.";
      return;
    }

    signupMessage.textContent = "Creating your account...";

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

