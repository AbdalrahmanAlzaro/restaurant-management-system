import { auth } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function showLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.add("hidden");
}

export function showAlert(message, type = "info") {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const alertColors = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };

  const alertIcons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  const alert = document.createElement("div");
  alert.className = `${alertColors[type]} border-l-4 p-4 rounded-lg shadow-lg mb-4`;
  alert.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i class="fas ${alertIcons[type]} text-xl"></i>
                <p class="font-medium">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
                <i class="fas fa-times hover:opacity-70"></i>
            </button>
        </div>
    `;

  container.innerHTML = "";
  container.appendChild(alert);

  setTimeout(() => {
    if (alert.parentElement) alert.remove();
  }, 5000);
}

export function getErrorMessage(errorCode) {
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "The email address is not valid.",
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid login credentials.",
    "auth/too-many-requests": "Too many failed attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-blocked": "Popup was blocked by browser.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/account-exists-with-different-credential":
      "Account exists with different sign-in method.",
  };
  return errorMessages[errorCode] || "An error occurred. Please try again.";
}

export function protectPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "index.html";
  });
}

export function redirectIfAuthenticated(redirectTo = "dashboard.html") {
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) window.location.href = redirectTo;
  });
}

export function setupPasswordToggle(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (input && button) {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }
}

export function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#84cc16", "#22c55e"];

  return {
    strength: Math.min(strength, 5),
    level: levels[Math.min(strength - 1, 4)],
    color: colors[Math.min(strength - 1, 4)],
  };
}

export function rememberUser(email) {
  localStorage.setItem("rememberedEmail", email);
}

export function getRememberedUser() {
  return localStorage.getItem("rememberedEmail");
}

export function forgetUser() {
  localStorage.removeItem("rememberedEmail");
}
