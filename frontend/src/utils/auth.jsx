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
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

// Errors that mean the user simply backed out; nothing to show
const CANCELLED = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"]);

/** User-facing message for a failed sign-in, or null if the user cancelled it. */
const authErrorMessage = (error) => {
    if (CANCELLED.has(error?.code)) return null;
    switch (error?.code) {
        case "auth/unauthorized-domain":
            return `Sign-in isn't enabled for ${location.hostname}. Use the main site to log in.`;
        case "auth/popup-blocked":
            return "Your browser blocked the sign-in popup. Allow popups for this site and try again.";
        case "auth/account-exists-with-different-credential":
            return "This email is already linked to a different sign-in method. Try the other provider.";
        case "auth/network-request-failed":
            return "Network error during sign-in. Check your connection and try again.";
        default:
            return "Sign-in failed. Please try again.";
    }
};

export { signInWithGoogle, signInWithGithub, signOut, authErrorMessage };