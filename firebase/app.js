import * as Firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "./config.js";

console.log(firebaseConfig);
let app = Firebase.initializeApp(firebaseConfig);
export const firestore = app.firestore();
