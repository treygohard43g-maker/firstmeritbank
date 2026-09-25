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


  signupButton.disabled = true;
  signupButton.textContent = "Creating Account...";

  showMessage("Connecting to Firebase...");


  try {

    console.log("Starting Firebase signup...");
    console.log("Email:", email);


    // Create Firebase Authentication account

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    const user = userCredential.user;

    console.log("Firebase Authentication account created.");
    console.log("UID:", user.uid);


    // Save display name

    await updateProfile(user, {
      displayName: fullName
    });

    console.log("Profile updated.");


    // Create Firestore user document

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


    console.log("Firestore user document created.");


    showMessage(
      "Account created successfully!",
      "success"
    );


    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);


  } catch (error) {

    console.error("========== FIREBASE ERROR ==========");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error:", error);
    console.error("====================================");


    let message = "Firebase error: " + error.code;


    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered.";

    } else if (error.code === "auth/invalid-email") {
      message = "The email address is invalid.";

    } else if (error.code === "auth/weak-password") {
      message = "The password is too weak.";

    } else if (error.code === "auth/network-request-failed") {
      message = "Network error. Check your internet connection.";

    } else if (error.code === "permission-denied") {
      message = "Firestore permission denied. Check your Firestore rules.";

    } else if (error.code === "auth/operation-not-allowed") {
      message =
        "Email/Password authentication is not enabled in Firebase.";

    }


    showMessage(message, "error");


    signupButton.disabled = false;
    signupButton.textContent = "Create Account";
  }

});
