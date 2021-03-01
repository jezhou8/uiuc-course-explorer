import * as Firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "./config.js";
import { DEBUG_LOG } from "../utility/Common.js";


DEBUG_LOG(firebaseConfig);
let app = Firebase.initializeApp(firebaseConfig);
export const firestore = app.firestore();
export const firebaseAuth = Firebase.auth;
export const firebaseAuthFunc = app.auth();
export const firestoreRef = Firebase.firestore;
