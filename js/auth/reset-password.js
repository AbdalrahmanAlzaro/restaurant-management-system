import { auth } from "./config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  showLoading,
  hideLoading,
  showAlert,
  getErrorMessage,
} from "./auth.js";

document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  showLoading();

  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/login.html",
      handleCodeInApp: false,
    });

    hideLoading();

    document.getElementById("reset-form").classList.add("hidden");
    document.getElementById("success-message").classList.remove("hidden");

    showAlert("Password reset email sent successfully!", "success");
  } catch (error) {
    hideLoading();
    console.error("Password reset error:", error);

    if (error.code === "auth/user-not-found") {
      showAlert("No account found with this email address.", "error");
    } else if (error.code === "auth/too-many-requests") {
      showAlert(
        "Too many reset attempts. Please wait before trying again.",
        "error"
      );
    } else {
      showAlert(getErrorMessage(error.code), "error");
    }
  }
});

document.getElementById("email").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("reset-form").dispatchEvent(new Event("submit"));
  }
});
