import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("User signed in with Google:", user);
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
}

const signInWithGithub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;
        console.log("User signed in with GitHub:", user);
        return user;
    } catch (error) {
        console.error("Error signing in with GitHub:", error);
        throw error;
    }
}

const signOut = async () => {
    try {
        await auth.signOut();
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

export { signInWithGoogle, signInWithGithub, signOut };