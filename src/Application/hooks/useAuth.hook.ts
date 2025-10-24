import type { LoginCredentials } from "@/Domain/interfaces/auth.interface";
import { auth } from "@/Infra";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const useAuth = () => {
  const login = ({email, password}: LoginCredentials) => {
    // Implement login logic here
    console.log(`Logging in user: ${email} with password: ${password}`);
   return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User logged in:", user);
        // ...
      })
      .catch((error) => {
        console.log(error.message);
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
    logout,
  };
};
