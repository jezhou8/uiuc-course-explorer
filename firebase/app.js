import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { firebaseConfig } from "./config.js";
import { DEBUG_LOG } from "../utility/Common.js";


DEBUG_LOG(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
// export const firebaseAuth = Firebase.auth;
// export const firebaseAuthFunc = app.auth();
export const firestoreRef = getFirestore(app);