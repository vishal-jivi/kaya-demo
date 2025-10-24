import type { UserDocument } from "@/Domain/interfaces";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveDataToDatabase = async (
  data: UserDocument
): Promise<string> => {
  try {
    // Save data to Firestore database
    await setDoc(doc(db, "users", data.id), data);
    return data.id;
  } catch (error) {
    console.error("Error saving user data to database:", error);
    throw new Error(
      `Failed to save user data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const getUserData = async (
  userId: string
): Promise<UserDocument | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserDocument;
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from database:", error);
    throw new Error(
      `Failed to fetch user data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const updateLastLogin = (userId: string): Promise<void> => {
    return setDoc(
        doc(db, "users", userId),
        { lastLogin: Date.now() },
        { merge: true }
    );
}