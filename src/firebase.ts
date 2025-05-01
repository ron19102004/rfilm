// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAX7Y-85uKEVyeq1ylu-lmQhhAIWav2-SA",
});
export async function askGemini(
  prompt: string,
  callback: (res: GenerateContentResponse) => void,
  retries: number = 3,
  timeout: number = 3000,
  error?: (error: unknown) => void
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    callback(response);
  } catch (err) {
    if (retries > 0) {
      setTimeout(async () => {
        await askGemini(prompt, callback, retries - 1, timeout, error);
      }, timeout);
    } else {
      if (error) {
        error(err);
      }
    }
  }
}
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default {
  auth,
  db,
  storage,
};
