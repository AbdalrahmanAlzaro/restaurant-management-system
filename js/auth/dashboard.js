import { auth } from "./config.js";
import {
  signOut,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  showLoading,
  hideLoading,
  showAlert,
  getErrorMessage,
  protectPage,
} from "./auth.js";

protectPage();

auth.onAuthStateChanged((user) => {
  if (user) {
    displayUserInfo(user);

    if (!user.emailVerified) {
      showVerificationBanner();
    }
  }
});

function displayUserInfo(user) {
  const displayName = user.displayName || "User";
  document.getElementById("user-name").textContent = displayName;
  document.getElementById("welcome-name").textContent = displayName;

  if (user.photoURL) {
    const avatar = document.getElementById("user-avatar");
    avatar.src = user.photoURL;
    avatar.classList.remove("hidden");
    document.getElementById("user-avatar-placeholder").classList.add("hidden");
  } else {
    const placeholder = document.getElementById("user-avatar-placeholder");
    placeholder.textContent = displayName.charAt(0).toUpperCase();
  }
}

function showVerificationBanner() {
  const banner = document.getElementById("verification-banner");
  banner.classList.remove("hidden");
}

document
  .getElementById("resend-verification-btn")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await sendEmailVerification(user, {
        url: window.location.origin + "/dashboard.html",
        handleCodeInApp: true,
      });

      showAlert("Verification email sent! Please check your inbox.", "success");

      const btn = document.getElementById("resend-verification-btn");
      btn.disabled = true;
      btn.textContent = "Email Sent";

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Resend Email";
      }, 60000);
    } catch (error) {
      console.error("Error sending verification email:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });

document.getElementById("logout-btn").addEventListener("click", async () => {
  showLoading();

  try {
    await signOut(auth);
    hideLoading();
    showAlert("Logged out successfully!", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    hideLoading();
    console.error("Logout error:", error);
    showAlert("Error logging out. Please try again.", "error");
  }
});

window.addEventListener("load", () => {
  const user = auth.currentUser;
  if (user) {
    user.reload().then(() => {
      if (user.emailVerified) {
        const banner = document.getElementById("verification-banner");
        if (banner) {
          banner.classList.add("hidden");
        }
      }
    });
  }
});
