import type { LoginCredentials, SignupCredentials } from "@/Domain/interfaces/auth.interface";
import { auth, saveDataToDatabase, updateLastLogin } from "@/Infra";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";

export const useAuth = () => {
  const login = ({email, password}: LoginCredentials) => {
    // Implement login logic here
    console.log(`Logging in user: ${email} with password: ${password}`);
   return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
       await updateLastLogin(userCredential.user.uid)
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const signup = ({email, password, role}: SignupCredentials) => {
    // Implement signup logic here
    console.log(`Signing up user: ${email} with password: ${password} and role: ${role}`);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("User signed up:", user);
        saveDataToDatabase({
          id: user.uid,
          email: user.email || '',
          role: role,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }).then((userId) => {
          console.log("User data saved with ID:", userId);
        }).catch((error) => {
          console.log("Error saving user data:", error.message);
        });
      })
      .catch((error) => {
        console.log(error.message);
        throw error;
      });
  };

  const logout = () => {
    // Implement logout logic here
    console.log("Logging out user");
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User logged out");
      }).catch((error) => {
        // An error happened.
        console.log(error.message);
      });
  };

  return {
    login,
    signup,
    logout,
  };
};
