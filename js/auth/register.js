import { auth } from "./config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  showLoading,
  hideLoading,
  showAlert,
  getErrorMessage,
  redirectIfAuthenticated,
  setupPasswordToggle,
  checkPasswordStrength,
} from "./auth.js";

redirectIfAuthenticated();

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

setupPasswordToggle("password", "toggle-password");
setupPasswordToggle("confirm-password", "toggle-confirm-password");

const passwordInput = document.getElementById("password");
const strengthContainer = document.getElementById("password-strength");
const strengthText = document.getElementById("strength-text");
const strengthBars = [
  document.getElementById("strength-bar-1"),
  document.getElementById("strength-bar-2"),
  document.getElementById("strength-bar-3"),
  document.getElementById("strength-bar-4"),
];

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (password.length === 0) {
    strengthContainer.classList.add("hidden");
    return;
  }

  strengthContainer.classList.remove("hidden");
  const result = checkPasswordStrength(password);

  strengthBars.forEach((bar, index) => {
    if (index < result.strength) {
      bar.style.backgroundColor = result.color;
    } else {
      bar.style.backgroundColor = "#e5e7eb";
    }
  });

  strengthText.textContent = `Password strength: ${result.level}`;
  strengthText.style.color = result.color;
});

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", "error");
      return;
    }

    const strengthCheck = checkPasswordStrength(password);
    if (strengthCheck.strength < 2) {
      showAlert(
        "Password is too weak. Please use a stronger password.",
        "error"
      );
      return;
    }

    if (!termsAccepted) {
      showAlert("Please accept the Terms and Conditions.", "error");
      return;
    }

    showLoading();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullname,
      });

      await sendEmailVerification(user, {
        url: window.location.origin + "/dashboard.html",
        handleCodeInApp: true,
      });

      hideLoading();

      showAlert(
        "Account created! Please check your email to verify your account.",
        "success"
      );

      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
    } catch (error) {
      hideLoading();
      console.error("Registration error:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });

document
  .getElementById("google-signup-btn")
  .addEventListener("click", async () => {
    showLoading();

    try {
      await signInWithPopup(auth, googleProvider);
      hideLoading();
      showAlert("Account created successfully with Google!", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      console.error("Google sign-up error:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });

document
  .getElementById("facebook-signup-btn")
  .addEventListener("click", async () => {
    showLoading();

    try {
      await signInWithPopup(auth, facebookProvider);
      hideLoading();
      showAlert("Account created successfully with Facebook!", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      console.error("Facebook sign-up error:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });

document.getElementById("confirm-password").addEventListener("input", () => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const confirmInput = document.getElementById("confirm-password");

  if (confirmPassword.length > 0) {
    if (password === confirmPassword) {
      confirmInput.classList.remove("border-red-500");
      confirmInput.classList.add("border-green-500");
    } else {
      confirmInput.classList.remove("border-green-500");
      confirmInput.classList.add("border-red-500");
    }
  } else {
    confirmInput.classList.remove("border-red-500", "border-green-500");
  }
});
