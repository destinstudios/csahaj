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
  mapsQuery: "25°34'09.6"N 81°11'35.4"E",
  adminEmails: [
  "adityasinghworks1612@gmail.com",
  "adityasinghzrx@gmail.com"
],
  firebase: {
     apiKey: "AIzaSyCSLRivs-ZXOTWMStgfmP1xAdRXDSFzUwk",
  authDomain: "chandan-sahaj.firebaseapp.com",
  projectId: "chandan-sahaj",
  storageBucket: "chandan-sahaj.firebasestorage.app",
  messagingSenderId: "599153312755",
  appId: "1:599153312755:web:ddebf125c39a9494314886"
}
};
window.SAHAJ_FIREBASE_READY = Boolean(
  window.SAHAJ_CONFIG.firebase.apiKey &&
  !window.SAHAJ_CONFIG.firebase.apiKey.startsWith("PASTE_") &&
  window.SAHAJ_CONFIG.firebase.projectId &&
  !window.SAHAJ_CONFIG.firebase.projectId.startsWith("PASTE_")
);
