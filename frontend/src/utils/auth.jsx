import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
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
        return user;
    } catch (error) {
        console.error("Error signing in with GitHub:", error);
        throw error;
    }
}

const signOut = async () => {
    try {
        await auth.signOut();
        window.location.reload(); // Reload
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

export { signInWithGoogle, signInWithGithub, signOut };