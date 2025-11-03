// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration is read from environment variables.
// IMPORTANT: In React apps, variables must be prefixed with REACT_APP_ to be exposed at build time.
// Do NOT hardcode credentials here.

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Basic runtime validation in development to help avoid misconfigurations
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('[Firebase] Missing env vars:', missing.join(', '));
  }
}

// Initialize Firebase only when required values exist to avoid runtime crashes
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const hasRequired = requiredKeys.every((k) => Boolean(firebaseConfig[k]));

let app, analytics, auth, googleProvider;
if (hasRequired) {
  app = initializeApp(firebaseConfig);
  // Only initialize analytics if measurementId is provided and environment supports it
  try {
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch {
    // ignore analytics init errors in environments where it's not supported
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Configure Google provider for better popup handling
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Add additional scopes if needed
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
} else {
  // eslint-disable-next-line no-console
  console.warn('[Firebase] Skipping initialization — missing required config (apiKey, authDomain, projectId, appId). Auth features will be disabled.');
}
export { auth, googleProvider };
