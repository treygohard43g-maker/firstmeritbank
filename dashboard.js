import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { auth } from "./firebase.js";


const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const sendMoneyBtn = document.getElementById("sendMoneyBtn");
const transferNav = document.getElementById("transferNav");


/* CHECK LOGIN STATUS */

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.displayName) {
    userName.textContent = user.displayName;
  } else {
    userName.textContent = "Member";
  }

});


/* LOGOUT */

logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    window.location.href = "login.html";

  } catch (error) {

    console.error("Logout error:", error);

  }

});


/* SEND MONEY */

sendMoneyBtn.addEventListener("click", () => {

  alert(
    "Send Money will be connected to the First Merit Bank demo transfer system next."
  );

});


/* TRANSFER NAVIGATION */

transferNav.addEventListener("click", () => {

  alert(
    "The transfer system will be added next."
  );

});
