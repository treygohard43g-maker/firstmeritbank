// First Merit Bank - Account Creation
// Demo banking simulator

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ================================
// GET FORM ELEMENTS
// ================================

const signupForm = document.getElementById("signupForm");
const signupButton = document.getElementById("signupButton");
const signupMessage = document.getElementById("signupMessage");


// ================================
// DISPLAY MESSAGE
// ================================

function showMessage(message, type = "") {

  if (!signupMessage) return;

  signupMessage.textContent = message;

  signupMessage.className = "auth-message";

  if (type) {
    signupMessage.classList.add(type);
  }
}


// ================================
// SIGNUP FORM
// ================================

if (signupForm) {

  signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // ================================
    // GET FORM VALUES
    // ================================

    const fullName =
      document.getElementById("signupFullName").value.trim();

    const email =
      document.getElementById("signupEmail").value.trim();

    const password =
      document.getElementById("signupPassword").value;

    const confirmPassword =
      document.getElementById("signupConfirmPassword").value;

    const idType =
      document.getElementById("signupIdType").value;

    const demoIdNumber =
      document.getElementById("signupDemoIdNumber").value.trim();

    const demoSsn =
      document.getElementById("signupDemoSsn").value.trim();


    // ================================
    // VALIDATION
    // ================================

    if (!fullName) {
      showMessage("Please enter your full name.", "error");
      return;
    }


    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }


    if (!password) {
      showMessage("Please create a password.", "error");
      return;
    }


    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }


    if (password.length < 6) {
      showMessage(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }


    if (!idType) {
      showMessage("Please select an ID type.", "error");
      return;
    }


    if (!demoIdNumber) {
      showMessage("Please enter your demo ID number.", "error");
      return;
    }


    if (!demoSsn) {
      showMessage("Please enter your demo SSN.", "error");
      return;
    }


    // ================================
    // DISABLE BUTTON
    // ================================

    signupButton.disabled = true;
    signupButton.textContent = "Creating Account...";

    showMessage("Creating your account...");


    try {

      // ================================
      // CREATE FIREBASE AUTH ACCOUNT
      // ================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      const user = userCredential.user;


      console.log(
        "Firebase account created:",
        user.uid
      );


      // ================================
      // UPDATE USER DISPLAY NAME
      // ================================

      await updateProfile(user, {
        displayName: fullName
      });


      // ================================
      // CREATE FIRESTORE PROFILE
      // ================================

      await setDoc(
        doc(db, "users", user.uid),
        {

          uid: user.uid,

          fullName: fullName,

          email: email,

          accountType: "Demo Checking",

          balance: 0,

          currency: "USD",

          demoIdentity: {
            idType: idType,
            demoIdNumber: demoIdNumber,
            demoSsn: demoSsn
          },

          createdAt: serverTimestamp()

        }
      );


      console.log(
        "Firestore profile created."
      );


      // ================================
      // SUCCESS
      // ================================

      showMessage(
        "Account created successfully!",
        "success"
      );


      signupButton.textContent =
        "Account Created";


      // ================================
      // REDIRECT TO DASHBOARD
      // ================================

      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 1000);


    } catch (error) {

      console.error(
        "Firebase signup error:",
        error
      );


      // ================================
      // FIREBASE ERROR MESSAGES
      // ================================

      let message =
        "Unable to create your account. Please try again.";


      switch (error.code) {

        case "auth/email-already-in-use":

          message =
            "An account with this email already exists.";

          break;


        case "auth/invalid-email":

          message =
            "Please enter a valid email address.";

          break;


        case "auth/weak-password":

          message =
            "Your password is too weak. Use at least 6 characters.";

          break;


        case "auth/network-request-failed":

          message =
            "Network error. Please check your internet connection.";

          break;


        case "auth/api-key-not-valid":

          message =
            "Firebase API key is invalid. Check your Firebase configuration.";

          break;


        case "auth/operation-not-allowed":

          message =
            "Email/Password sign-in is not enabled in Firebase.";

          break;


        case "permission-denied":

          message =
            "Firestore permission denied. Check your Firestore rules.";

          break;


        default:

          message =
            "Firebase error: " +
            (error.code || error.message);

      }


      // ================================
      // SHOW ERROR
      // ================================

      showMessage(
        message,
        "error"
      );


      // ================================
      // ENABLE BUTTON AGAIN
      // ================================

      signupButton.disabled = false;

      signupButton.textContent =
        "Create Account";

    }

  });

}
