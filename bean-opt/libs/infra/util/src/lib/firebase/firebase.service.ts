// import { inject, Injectable, isDevMode } from "@angular/core";
// /** Firebase Declarations */
// import { initializeApp, FirebaseApp } from 'firebase/app';
// import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
// import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
// import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
// import { getAnalytics, Analytics } from 'firebase/analytics';
// /** App Config Token */
// import { APP_CONFIG } from "../app-config.token";

// /** The service to connect to firebase infrastructure (or Emulators) */
// @Injectable({ providedIn: 'root' })
// export class FirebaseService {
//     private config = inject(APP_CONFIG);

//     public appId = typeof this.config.appId !== 'undefined' ? this.config.appId : 'wfi-v1';

//     /** Holds the default directory for accessing the firestore directory for this app */
//     public firestoreAppDirectory = ['artefacts', this.appId]

//     /** The Firebase App */
//     public app!: FirebaseApp;
//     /** The Firestore Database for this app */
//     public db!: Firestore;
//     /** The Storage Bucket for this app */
//     public storage!: FirebaseStorage;
//     /** The  */
//     public auth!: Auth;
//     public analytics!: Analytics;

//     private isInitialized = false;

//     /** Initialize Firebase and connect to local emulators if in Dev Mode.
//      * This method is safe to run multiple times, as it will only run once
//      */
//     public Init() {
//         if (this.isInitialized) return;

//         try {
//             // Initialize Core App
//             this.app = initializeApp(this.config.firebaseConfig);

//             // Initialize Services
//             this.auth = getAuth(this.app);
//             this.db = getFirestore(this.app);
//             this.storage = getStorage(this.app);
//             this.analytics = getAnalytics(this.app);

//             // Environment check & Emulator binding
//             const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

//             if (isDevMode() || isLocalhost) {
//                 console.log("Firestore Service: Connecting to local emulators...");
//                 try {
//                     connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
//                     connectFirestoreEmulator(this.db, 'localhost', 8080);
//                     connectStorageEmulator(this.storage, 'localhost', 9199);
//                 } catch (e) {
//                     // Ignore the "already connected" errors during angulars hot reloads
//                 }
//             }

//             this.isInitialized = true;
//         } catch (e) {
//             console.error('Firebase Infrastructure Failed to Initialize:', e);
//         }
//     }
// }