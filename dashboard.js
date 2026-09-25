// First Merit Bank
// Dashboard

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


/* -----------------------------
   ELEMENTS
----------------------------- */

const userName = document.getElementById("userName");
const detailName = document.getElementById("detailName");

const mainBalance = document.getElementById("mainBalance");
const balanceToggle = document.getElementById("balanceToggle");

const accountNumber = document.getElementById("accountNumber");
const detailAccountNumber =
  document.getElementById("detailAccountNumber");

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


/* -----------------------------
   INHERITANCE ELEMENTS
----------------------------- */

const inheritanceBtn =
  document.getElementById("inheritanceBtn");

const inheritanceModal =
  document.getElementById("inheritanceModal");

const closeInheritanceBtn =
  document.getElementById("closeInheritanceBtn");

const inheritanceBalance =
  document.getElementById("inheritanceBalance");

const inheritanceTransferDate =
  document.getElementById("inheritanceTransferDate");

const inheritanceTransferStatus =
  document.getElementById("inheritanceTransferStatus");

const verificationStatus =
  document.getElementById("verificationStatus");

const submitVerificationBtn =
  document.getElementById("submitVerificationBtn");


/* -----------------------------
   STATE
----------------------------- */

let currentUser = null;
let currentAccountNumber = "";

let realBalance = 400000;
let balanceVisible = true;


/* -----------------------------
   TOAST
----------------------------- */

function showToast(message) {

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* -----------------------------
   DATE
----------------------------- */

function updateDate() {

  if (!dashboardDate) {
    return;
  }

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


/* -----------------------------
   ACCOUNT NUMBER
----------------------------- */

function generateAccountNumber() {

  const first =
    Math.floor(1000 + Math.random() * 9000);

  const second =
    Math.floor(1000 + Math.random() * 9000);

  const third =
    Math.floor(1000 + Math.random() * 9000);

  return `${first}${second}${third}`;
}


function formatAccountNumber(number) {

  if (!number) {
    return "Account ••••";
  }

  return `Account •••• ${number.slice(-4)}`;
}


/* -----------------------------
   CURRENCY
----------------------------- */

function formatCurrency(amount) {

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);

}


/* -----------------------------
   BALANCE
----------------------------- */

function renderBalance() {

  if (!mainBalance || !balanceToggle) {
    return;
  }

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


/* -----------------------------
   LOAD USER
----------------------------- */

async function loadUserProfile(user) {

  currentUser = user;

  const userRef =
    doc(db, "users", user.uid);

  try {

    const snapshot =
      await getDoc(userRef);


    /* EXISTING USER */

    if (snapshot.exists()) {

      const data =
        snapshot.data();


      const name =
        data.fullName ||
        user.displayName ||
        "Member";


      if (userName) {
        userName.textContent = name;
      }

      if (detailName) {
        detailName.textContent = name;
      }


      /* BALANCE */

      if (data.balanceInitialized !== true) {

        realBalance = 400000;

        await updateDoc(userRef, {

          balance: 400000,

          balanceInitialized: true,

          currency: "USD"

        });

      } else if (
        typeof data.balance === "number"
      ) {

        realBalance = data.balance;

      } else {

        realBalance = 400000;

        await updateDoc(userRef, {

          balance: 400000,

          balanceInitialized: true,

          currency: "USD"

        });

      }


      /* ACCOUNT NUMBER */

      if (data.accountNumber) {

        currentAccountNumber =
          data.accountNumber;

      } else {

        currentAccountNumber =
          generateAccountNumber();

        await updateDoc(userRef, {

          accountNumber:
            currentAccountNumber

        });

      }


      /* INHERITANCE */

      if (!data.inheritance) {

        await updateDoc(userRef, {

          inheritance: {

            balance: 250000,

            transferDate:
              serverTimestamp(),

            transferStatus:
              "inaccessible",

            verificationStatus:
              "required"

          }

        });

        loadInheritanceData({

          balance: 250000,

          transferStatus:
            "inaccessible",

          verificationStatus:
            "required"

        });

      } else {

        loadInheritanceData(
          data.inheritance
        );

      }

    }


    /* NEW USER */

    else {

      currentAccountNumber =
        generateAccountNumber();

      realBalance = 400000;


      await setDoc(userRef, {

        uid: user.uid,

        fullName:
          user.displayName ||
          "Member",

        email:
          user.email || "",

        accountType:
          "Checking",

        accountNumber:
          currentAccountNumber,

        balance:
          400000,

        balanceInitialized:
          true,

        currency:
          "USD",

        inheritance: {

          balance: 250000,

          transferDate:
            serverTimestamp(),

          transferStatus:
            "inaccessible",

          verificationStatus:
            "required"

        },

        createdAt:
          serverTimestamp()

      }, {
        merge: true
      });


      if (userName) {
        userName.textContent =
          user.displayName || "Member";
      }

      if (detailName) {
        detailName.textContent =
          user.displayName || "Member";
      }


      loadInheritanceData({

        balance: 250000,

        transferStatus:
          "inaccessible",

        verificationStatus:
          "required"

      });

    }


    if (accountNumber) {

      accountNumber.textContent =
        formatAccountNumber(
          currentAccountNumber
        );

    }


    if (detailAccountNumber) {

      detailAccountNumber.textContent =
        currentAccountNumber;

    }


    renderBalance();


  } catch (error) {

    console.error(
      "Unable to load account:",
      error
    );


    if (userName) {

      userName.textContent =
        user.displayName || "Member";

    }


    if (detailName) {

      detailName.textContent =
        user.displayName || "Member";

    }


    renderBalance();


    showToast(
      "Unable to load some account information"
    );

  }

}


/* -----------------------------
   INHERITANCE
----------------------------- */

function loadInheritanceData(data) {

  if (!data) {
    return;
  }


  if (inheritanceBalance) {

    const balance =
      typeof data.balance === "number"
        ? data.balance
        : 250000;

    inheritanceBalance.textContent =
      formatCurrency(balance);

  }


  if (inheritanceTransferStatus) {

    inheritanceTransferStatus.textContent =
      capitalize(
        data.transferStatus ||
        "inaccessible"
      );

  }


  if (verificationStatus) {

    verificationStatus.textContent =
      capitalize(
        data.verificationStatus ||
        "required"
      );

  }


  if (
    inheritanceTransferDate &&
    data.transferDate
  ) {

    let date;


    if (
      typeof data.transferDate.toDate ===
      "function"
    ) {

      date =
        data.transferDate.toDate();

    } else {

      date =
        new Date(data.transferDate);

    }


    if (!isNaN(date.getTime())) {

      inheritanceTransferDate.textContent =
        date.toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric"
          }
        );

    }

  }

}


function capitalize(value) {

  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase()
    + value.slice(1);

}


/* -----------------------------
   AUTH
----------------------------- */

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


/* -----------------------------
   BALANCE TOGGLE
----------------------------- */

if (balanceToggle) {

  balanceToggle.addEventListener(
    "click",
    () => {

      balanceVisible =
        !balanceVisible;

      renderBalance();

    }
  );

}


/* -----------------------------
   COPY ACCOUNT
----------------------------- */

if (copyAccountBtn) {

  copyAccountBtn.addEventListener(
    "click",
    async () => {

      if (!currentAccountNumber) {
        return;
      }

      try {

        await navigator.clipboard
          .writeText(
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

}


/* -----------------------------
   SIDE MENU
----------------------------- */

function openMenu() {

  if (sideMenu) {
    sideMenu.classList.add("open");
  }

  if (menuOverlay) {
    menuOverlay.classList.add("open");
  }

}


function closeMenu() {

  if (sideMenu) {
    sideMenu.classList.remove("open");
  }

  if (menuOverlay) {
    menuOverlay.classList.remove("open");
  }

}


if (menuBtn) {

  menuBtn.addEventListener(
    "click",
    openMenu
  );

}


if (closeMenuBtn) {

  closeMenuBtn.addEventListener(
    "click",
    closeMenu
  );

}


if (menuOverlay) {

  menuOverlay.addEventListener(
    "click",
    closeMenu
  );

}


/* -----------------------------
   HEADER BUTTONS
----------------------------- */

if (profileBtn) {

  profileBtn.addEventListener(
    "click",
    () => {

      window.location.href =
        "settings.html";

    }
  );

}


if (notificationBtn) {

  notificationBtn.addEventListener(
    "click",
    () => {

      window.location.href =
        "notifications.html";

    }
  );

}


/* -----------------------------
   MONEY ACTIONS
----------------------------- */

function goToPage(page) {

  closeMenu();

  window.location.href = page;

}


/* SEND MONEY */

const sendMoneyBtn =
  document.getElementById("sendMoneyBtn");

if (sendMoneyBtn) {

  sendMoneyBtn.addEventListener(
    "click",
    () => {
      goToPage("send-money.html");
    }
  );

}


/* ZELLE */

const zelleBtn =
  document.getElementById("zelleBtn");

if (zelleBtn) {

  zelleBtn.addEventListener(
    "click",
    () => {
      goToPage("zelle.html");
    }
  );

}


/* ADD MONEY */

const addMoneyBtn =
  document.getElementById("addMoneyBtn");

if (addMoneyBtn) {

  addMoneyBtn.addEventListener(
    "click",
    () => {
      goToPage("add-money.html");
    }
  );

}


/* WITHDRAW */

const withdrawBtn =
  document.getElementById("withdrawBtn");

if (withdrawBtn) {

  withdrawBtn.addEventListener(
    "click",
    () => {
      goToPage("withdraw.html");
    }
  );

}


/* TRANSFER */

const transferBtn =
  document.getElementById("transferBtn");

if (transferBtn) {

  transferBtn.addEventListener(
    "click",
    () => {
      goToPage("transfer.html");
    }
  );

}


/* TRANSACTIONS */

const transactionsBtn =
  document.getElementById("transactionsBtn");

if (transactionsBtn) {

  transactionsBtn.addEventListener(
    "click",
    () => {
      goToPage("transactions.html");
    }
  );

}


/* ACCOUNT DETAILS */

const accountDetailsBtn =
  document.getElementById("accountDetailsBtn");

if (accountDetailsBtn) {

  accountDetailsBtn.addEventListener(
    "click",
    () => {
      goToPage("account.html");
    }
  );

}


/* INHERITANCE */

if (inheritanceBtn) {

  inheritanceBtn.addEventListener(
    "click",
    () => {

      window.location.href =
        "inheritance.html";

    }
  );

}


/* -----------------------------
   MENU NAVIGATION
----------------------------- */

const menuPages = {

  menuDashboard:
    "dashboard.html",

  menuAccount:
    "account.html",

  menuTransfer:
    "transfer.html",

  menuPayments:
    "payments.html",

  menuCards:
    "cards.html",

  menuTransactions:
    "transactions.html",

  menuStatements:
    "statements.html",

  menuNotifications:
    "notifications.html",

  menuSupport:
    "support.html",

  menuSecurity:
    "security.html",

  menuSettings:
    "settings.html"

};


Object.entries(menuPages).forEach(
  ([id, page]) => {

    const button =
      document.getElementById(id);

    if (!button) {
      return;
    }


    button.addEventListener(
      "click",
      () => {

        closeMenu();

        window.location.href =
          page;

      }
    );

  }
);


/* -----------------------------
   INHERITANCE VERIFICATION
----------------------------- */

if (submitVerificationBtn) {

  submitVerificationBtn.addEventListener(
    "click",
    async () => {

      if (!currentUser) {
        return;
      }


      submitVerificationBtn.disabled =
        true;

      submitVerificationBtn.textContent =
        "Submitting...";


      try {

        const userRef =
          doc(
            db,
            "users",
            currentUser.uid
          );


        await updateDoc(
          userRef,
          {
            "inheritance.verificationStatus":
              "submitted"
          }
        );


        if (verificationStatus) {

          verificationStatus.textContent =
            "Submitted";

        }


        submitVerificationBtn.textContent =
          "Verification submitted";


        showToast(
          "Verification request submitted"
        );


      } catch (error) {

        console.error(
          "Verification error:",
          error
        );


        submitVerificationBtn.disabled =
          false;

        submitVerificationBtn.textContent =
          "Submit verification";


        showToast(
          "Unable to submit verification"
        );

      }

    }
  );

}


/* -----------------------------
   LOGOUT
----------------------------- */

if (logoutBtn) {

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

}
