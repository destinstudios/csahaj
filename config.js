/*
  Firebase setup instructions:
  1. Create a Firebase project at https://console.firebase.google.com/
  2. Register a Web App and copy its Firebase config below.
  3. Enable Authentication > Email/Password.
  4. Create a Firestore database.
  5. Add the authorized admin email in Authentication users.
  6. Apply the Firestore rules in firestore.rules before deploying.
  7. Keep API configuration public but NEVER put private service-account keys here.
*/
window.SAHAJ_CONFIG = {
  whatsappNumber: "919648909066",
  phoneNumber: "9648909066",
  address: "Lihai, Dhata-Khaga Road, Dhata, Fatehpur, Uttar Pradesh 212641",
  mapsQuery: "Lihai, Dhata-Khaga Road, Dhata, Fatehpur, Uttar Pradesh 212641",
  adminEmail: "adityasinghworks1612@gmail.com",
  firebase: {
    apiKey: "PASTE_FIREBASE_API_KEY",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
    appId: "PASTE_APP_ID"
  }
};
window.SAHAJ_FIREBASE_READY = Boolean(
  window.SAHAJ_CONFIG.firebase.apiKey &&
  !window.SAHAJ_CONFIG.firebase.apiKey.startsWith("PASTE_") &&
  window.SAHAJ_CONFIG.firebase.projectId &&
  !window.SAHAJ_CONFIG.firebase.projectId.startsWith("PASTE_")
);
