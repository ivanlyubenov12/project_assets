"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Button from "../components/Button";
import UserIcon from "../images/UserIcon.svg";
import Checkbox from "../components/Checkbox";
import {OrbitProgress} from "react-loading-indicators";
import Input from "../components/Input";
import { MdLogin } from "react-icons/md";
import { FaGoogle } from "react-icons/fa"


export default function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);



    const createUserDoc = async (user: any) => {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            await setDoc(
                userRef,
                {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName ?? user.email.split("@")[0],
                    photo: user.photoURL ?? UserIcon,
                    xp: 0,
                    streak: 0,
                    accuracy: 0,
                    courseProgress: 0,
                    createdAt: Date.now(),
                    theme: "system",
                },
                { merge: true }
            );
        }
    };

    const redirectAfterAuth = () => {
        const returnUrl = router.query.returnUrl as string | undefined;
        router.push(returnUrl || "/home");
    };

    const handleGoogle = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await createUserDoc(result.user);
            redirectAfterAuth();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isForgot) {
                await sendPasswordResetEmail(auth, email);
                alert("Password reset email sent (if account exists).");
                setIsForgot(false);
                setLoading(false);
                return;
            }

            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                await createUserDoc(user);
            } else {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                await createUserDoc(user);
            }

            redirectAfterAuth();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Show loader if logging in/signing up
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
            </div>
        );
    }

    return (
        <div className="w-1/2 mx-auto mt-20 p-6 rounded-2xl shadow-md">
            <h2 className="text-heading-xl font-bold mb-6 text-center">
                {isForgot ? "Forgot Password" : isSignUp ? "Create an Account" : "Sign in"}
            </h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleEmailAuth} className="flex flex-col">
                {/* Email input */}
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="m"
                    className="flex-1"
                />

                {/* Password input */}
                {!isForgot && (
                    <>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="m"
                            placeholder="Password"
                            className="flex-1 password-input"
                        />

                        {isSignUp && (
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                size="m"
                                placeholder="Confirm Password"
                                className="flex-1 password-input"
                            />
                        )}
                    </>
                )}
                {!isForgot && (
                    <Checkbox
                        label="Show Password"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                )}


                {/* Primary submit button */}
                <Button type="submit" size="m" className="flex-1" variant="primary">
                    {isForgot ? "Send Reset Email" : isSignUp ? "Sign up" : "Sign in"}
                </Button>
                <p className={"text-center text-body-l"}>Or</p>
                {/* Google sign-in button */}
                {!isForgot && (
                    <Button onClick={handleGoogle} size="m" className="flex-1" variant="primary" leftIcon={FaGoogle()}>
                        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                    </Button>
                )}
            </form>

            {/* Bottom action buttons */}
            <div className="flex flex-row sm:flex-row justify-between mt-6 gap-2">
                <Button
                    variant="secondary"
                    size="m"
                    onClick={() => {
                        if (isForgot) {
                            // if on forgot screen → go back to login
                            setIsForgot(false);
                            setIsSignUp(false);
                        } else {
                            // normal toggle between login/signup
                            setIsSignUp(!isSignUp);
                            setIsForgot(false);
                        }
                    }}
                    className="flex-1"
                >
                    {isForgot
                        ? "Back to Login"
                        : isSignUp
                            ? "Already have an account? Login"
                            : "Need an account? Sign Up"}
                </Button>

                {!isSignUp && !isForgot && (
                    <Button
                        variant="secondary"
                        size="m"
                        onClick={() => {
                            setIsForgot(true);
                            setIsSignUp(false);
                        }}
                        className="flex-1"
                    >
                        Forgot password?
                    </Button>
                )}
            </div>
        </div>

    );
}
