import { auth } from "./config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  showLoading,
  hideLoading,
  showAlert,
  getErrorMessage,
  redirectIfAuthenticated,
  setupPasswordToggle,
  rememberUser,
  getRememberedUser,
  forgetUser,
} from "./auth.js";

redirectIfAuthenticated();

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

setupPasswordToggle("password", "toggle-password");

const rememberedEmail = getRememberedUser();
if (rememberedEmail) {
  document.getElementById("email").value = rememberedEmail;
  document.getElementById("remember-me").checked = true;
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  showLoading();

  try {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
      rememberUser(email);
    } else {
      await setPersistence(auth, browserSessionPersistence);
      forgetUser();
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    hideLoading();

    if (!user.emailVerified) {
      showAlert(
        "Please verify your email address before accessing the dashboard.",
        "warning"
      );
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }
  } catch (error) {
    hideLoading();
    console.error("Login error:", error);
    showAlert(getErrorMessage(error.code), "error");
  }
});

document
  .getElementById("google-login-btn")
  .addEventListener("click", async () => {
    showLoading();

    try {
      await signInWithPopup(auth, googleProvider);
      hideLoading();
      showAlert("Successfully signed in with Google!", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      console.error("Google sign-in error:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });

document
  .getElementById("facebook-login-btn")
  .addEventListener("click", async () => {
    showLoading();

    try {
      await signInWithPopup(auth, facebookProvider);
      hideLoading();
      showAlert("Successfully signed in with Facebook!", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      console.error("Facebook sign-in error:", error);
      showAlert(getErrorMessage(error.code), "error");
    }
  });
