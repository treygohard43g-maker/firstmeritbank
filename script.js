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


const signupForm = document.getElementById("signupForm");
const signupButton = document.getElementById("signupButton");
const signupMessage = document.getElementById("signupMessage");


function showMessage(message, type = "") {
  signupMessage.textContent = message;
  signupMessage.className = "auth-message";

  if (type) {
    signupMessage.classList.add(type);
  }
}


signupForm.addEventListener("submit", async (event) => {

  event.preventDefault();

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


  // Basic validation

  if (!fullName || !email || !password || !confirmPassword) {
    showMessage("Please complete all required fields.", "error");
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


  if (!idType || !demoIdNumber || !demoSsn) {
    showMessage(
      "Please complete the demo identity verification fields.",
      "error"
    );
    return;
  }


  // Prevent double submission

  signupButton.disabled = true;
  signupButton.textContent = "Creating Account...";

  showMessage("Creating your account...");


  try {

    /*
      STEP 1
      Create Firebase Authentication account
    */

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user = userCredential.user;


    /*
      STEP 2
      Save the user's display name
    */

    await updateProfile(user, {
      displayName: fullName
    });


    /*
      STEP 3
      Create the user's demo banking profile
      in Firestore.

      The password is NEVER stored here.
    */

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        fullName: fullName,
        email: email,

        demoIdentity: {
          idType: idType,
          demoIdNumber: demoIdNumber,
          demoSsn: demoSsn
        },

        accountType: "Demo Checking",
        balance: 0,
        currency: "USD",

        createdAt: serverTimestamp()
      }
    );


    /*
      Account successfully created
    */

    showMessage(
      "Account created successfully! Redirecting...",
      "success"
    );


    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);


  } catch (error) {

    console.error("Firebase signup error:", error);


    let message =
      "Unable to create your account. Please try again.";


    if (error.code === "auth/email-already-in-use") {

      message =
        "An account with this email already exists.";

    } else if (error.code === "auth/invalid-email") {

      message =
        "Please enter a valid email address.";

    } else if (error.code === "auth/weak-password") {

      message =
        "Your password is too weak. Use at least 6 characters.";

    } else if (error.code === "auth/network-request-failed") {

      message =
        "Network error. Check your internet connection.";

    } else if (error.code === "auth/api-key-not-valid") {

      message =
        "Firebase configuration is invalid. Please check firebase.js.";

    }


    showMessage(message, "error");


    signupButton.disabled = false;
    signupButton.textContent = "Create Account";
  }

});
