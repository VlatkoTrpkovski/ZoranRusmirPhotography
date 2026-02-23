// ============================================
// Firebase Configuration
// ============================================
// INSTRUCTIONS: Replace the values below with your own Firebase project config.
//
// To set up:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (e.g., "zoran-rusmir-portfolio")
// 3. Add a Web App (click </> icon)
// 4. Copy the firebaseConfig object and paste it below
// 5. Enable Authentication → Email/Password sign-in method
// 6. Create ONE admin user in Authentication → Users → Add User
// 7. Enable Cloud Firestore → Create database (test or production mode)
// 8. Set Firestore rules (see below)
//
// Firestore Security Rules (paste in Firestore → Rules):
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /{document=**} {
//         allow read: if true;
//         allow write: if request.auth != null;
//       }
//     }
//   }
//
// NOTE: Images are stored as Base64 directly in Firestore.
//       No Firebase Storage needed (no Blaze plan / credit card required).

const firebaseConfig = {
    apiKey: "AIzaSyBVnfGr5XKzt9eCuS9fgQZ1pl6jIFKD9oM",
    authDomain: "rusmirphotography.firebaseapp.com",
    projectId: "rusmirphotography",
    storageBucket: "rusmirphotography.firebasestorage.app",
    messagingSenderId: "822164769894",
    appId: "1:822164769894:web:8328c78e8baeb231c971a7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

