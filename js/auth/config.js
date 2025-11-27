import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE4qfmaGfCEWaCrLnKIAzCV9XZdguYKTo",
  authDomain: "gui-project-d2276.firebaseapp.com",
  projectId: "gui-project-d2276",
  storageBucket: "gui-project-d2276.firebasestorage.app",
  messagingSenderId: "228656676322",
  appId: "1:228656676322:web:1991316438f1ddf8f98dbb",
  measurementId: "G-QYV10DDPWC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
