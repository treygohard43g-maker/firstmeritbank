// First Merit Bank
// Functional Dashboard

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


// ========================================
// ELEMENTS
// ========================================

const userName = document.getElementById("userName");

const accountNumber = document.getElementById("accountNumber");
const detailAccountNumber =
  document.getElementById("detailAccountNumber");

const detailName =
  document.getElementById("detailName");

const mainBalance =
  document.getElementById("mainBalance");

const balanceToggle =
  document.getElementById("balanceToggle");

const copyAccountBtn =
  document.getElementById("copyAccountBtn");

const dashboardDate =
  document.getElementById("dashboardDate");

const menuBtn =
  document.getElementById("menuBtn");

const closeMenuBtn =
  document.getElementById("closeMenuBtn");

const menuOverlay =
  document.getElementById("menuOverlay");

const sideMenu =
  document.getElementById("sideMenu");

const logoutBtn =
  document.getElementById("logoutBtn");

const profileBtn =
  document.getElementById("profileBtn");

const notificationBtn =
  document.getElementById("notificationBtn");

const toast =
  document.getElementById("dashboardToast");


// ========================================
// STATE
// ========================================

let currentUser = null;

let realBalance = 400000;

let balanceVisible = true;

let currentAccountNumber = "";


// ========================================
// TOAST
// ========================================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}


// ========================================
// DATE
// ========================================

function updateDate() {

  const today = new Date();

  dashboardDate.textContent =
    today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

}

updateDate();


// ========================================
// ACCOUNT NUMBER GENERATOR
// ========================================

function generateAccountNumber() {

  const first =
    Math.floor(1000 + Math.random() * 9000);

  const second =
    Math.floor(1000 + Math.random() * 9000);

  const third =
    Math.floor(1000 + Math.random() * 9000);

  return `${first}${second}${third}`;

}


// ========================================
// FORMAT ACCOUNT NUMBER
// ========================================

function formatAccountNumber(number) {

  if (!number) {
    return "Account ••••••••••";
  }

  const lastFour =
    number.slice(-4);

  return `Account •••• ${lastFour}`;

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(amount);

}


// ========================================
// DISPLAY BALANCE
// ========================================

function renderBalance() {

  if (balanceVisible) {

    mainBalance.textContent =
      formatCurrency(realBalance);

    balanceToggle.innerHTML =
      `<i class="fa-regular fa-eye"></i>`;

    balanceToggle.setAttribute(
      "aria-label",
      "Hide balance"
    );

  } else {

    mainBalance.textContent =
      "••••••••";

    balanceToggle.innerHTML =
      `<i class="fa-regular fa-eye-slash"></i>`;

    balanceToggle.setAttribute(
      "aria-label",
      "Show balance"
    );

  }

}


// ========================================
// LOAD USER
// ========================================

async function loadUserProfile(user) {

  currentUser = user;

  const userRef =
    doc(db, "users", user.uid);

  try {

    const userSnapshot =
      await getDoc(userRef);


    if (userSnapshot.exists()) {

      const data =
        userSnapshot.data();


      // NAME

      const name =
        data.fullName ||
        user.displayName ||
        "Member";

      userName.textContent = name;

      detailName.textContent = name;


      // BALANCE

      if (
        typeof data.balance === "number"
      ) {

        realBalance = data.balance;

      } else {

        realBalance = 400000;

        await updateDoc(
          userRef,
          {
            balance: 400000,
            currency: "USD"
          }
        );

      }


      // ACCOUNT NUMBER

      if (data.accountNumber) {

        currentAccountNumber =
          data.accountNumber;

      } else {

        currentAccountNumber =
          generateAccountNumber();

        await updateDoc(
          userRef,
          {
            accountNumber:
              currentAccountNumber
          }
        );

      }


    } else {

      currentAccountNumber =
        generateAccountNumber();

      realBalance = 400000;


      await setDoc(
        userRef,
        {
          uid: user.uid,
          fullName:
            user.displayName || "Member",
          email:
            user.email || "",
          accountType:
            "Checking",
          accountNumber:
            currentAccountNumber,
          balance:
            400000,
          currency:
            "USD"
        },
        {
          merge: true
        }
      );


      userName.textContent =
        user.displayName || "Member";

      detailName.textContent =
        user.displayName || "Member";

    }


    // DISPLAY ACCOUNT NUMBER

    accountNumber.textContent =
      formatAccountNumber(
        currentAccountNumber
      );

    detailAccountNumber.textContent =
      currentAccountNumber;


    // DISPLAY BALANCE

    renderBalance();


  } catch (error) {

    console.error(
      "Unable to load account:",
      error
    );

    userName.textContent =
      user.displayName || "Member";

    detailName.textContent =
      user.displayName || "Member";

    renderBalance();

  }

}


// ========================================
// AUTHENTICATION
// ========================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }

    await loadUserProfile(user);

  }
);


// ========================================
// BALANCE VISIBILITY
// ========================================

balanceToggle.addEventListener(
  "click",
  () => {

    balanceVisible =
      !balanceVisible;

    renderBalance();

  }
);


// ========================================
// COPY ACCOUNT NUMBER
// ========================================

copyAccountBtn.addEventListener(
  "click",
  async () => {

    if (!currentAccountNumber) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        currentAccountNumber
      );

      showToast(
        "Account number copied"
      );

    } catch (error) {

      console.error(
        "Copy error:",
        error
      );

      showToast(
        "Unable to copy account number"
      );

    }

  }
);


// ========================================
// OPEN MENU
// ========================================

function openMenu() {

  sideMenu.classList.add("open");

  menuOverlay.classList.add("open");

}


// ========================================
// CLOSE MENU
// ========================================

function closeMenu() {

  sideMenu.classList.remove("open");

  menuOverlay.classList.remove("open");

}


menuBtn.addEventListener(
  "click",
  openMenu
);

closeMenuBtn.addEventListener(
  "click",
  closeMenu
);

menuOverlay.addEventListener(
  "click",
  closeMenu
);


// ========================================
// PROFILE
// ========================================

profileBtn.addEventListener(
  "click",
  () => {

    showToast(
      "Profile section is ready for the next module"
    );

  }
);


// ========================================
// NOTIFICATIONS
// ========================================

notificationBtn.addEventListener(
  "click",
  () => {

    showToast(
      "No new notifications"
    );

  }
);


// ========================================
// QUICK ACTIONS
// ========================================

document
  .getElementById("sendMoneyBtn")
  .addEventListener(
    "click",
    () => {

      showToast(
        "Send Money module coming next"
      );

    }
  );


document
  .getElementById("addMoneyBtn")
  .addEventListener(
    "click",
    () => {

      showToast(
        "Add Money module coming next"
      );

    }
  );


document
  .getElementById("withdrawBtn")
  .addEventListener(
    "click",
    () => {

      showToast(
        "Withdraw module coming next"
      );

    }
  );


document
  .getElementById("transferBtn")
  .addEventListener(
    "click",
    () => {

      showToast(
        "Transfer module coming next"
      );

    }
  );


// ========================================
// SERVICE BUTTONS
// ========================================

const serviceButtons = [

  ["paymentsBtn", "Payments"],
  ["cardsBtn", "Cards"],
  ["statementsBtn", "Statements"],
  ["supportBtn", "Help & Support"],
  ["securityBtn", "Security"],
  ["settingsBtn", "Settings"],
  ["profileServiceBtn", "Profile"],
  ["notificationsServiceBtn", "Notifications"]

];


serviceButtons.forEach(
  ([id, name]) => {

    const button =
      document.getElementById(id);

    if (!button) return;

    button.addEventListener(
      "click",
      () => {

        showToast(
          `${name} module coming next`
        );

      }
    );

  }
);


// ========================================
// MENU BUTTONS
// ========================================

const menuActions = [

  ["menuAccount", "Account"],
  ["menuTransfer", "Transfers"],
  ["menuPayments", "Payments"],
  ["menuCards", "Cards"],
  ["menuTransactions", "Transactions"],
  ["menuStatements", "Statements"],
  ["menuNotifications", "Notifications"],
  ["menuSupport", "Help & Support"],
  ["menuSecurity", "Security"],
  ["menuSettings", "Settings"]

];


menuActions.forEach(
  ([id, name]) => {

    const button =
      document.getElementById(id);

    if (!button) return;

    button.addEventListener(
      "click",
      () => {

        closeMenu();

        showToast(
          `${name} module coming next`
        );

      }
    );

  }
);


// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      window.location.href =
        "login.html";

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      showToast(
        "Unable to sign out"
      );

    }

  }
);
