import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Button from "../components/Button";
import {OrbitProgress} from "react-loading-indicators";

export default function LandingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // ✅ Redirect ONLY if logged in
                router.replace("/home");
            } else {
                // ❌ Do NOT redirect if logged out
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
            </main>
        );
    }

    // Landing page UI
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
                Welcome to Design School 🎨
            </h1>
            <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
                Learn design the fun way! Interactive lessons, challenges, and more.
            </p>

            <Button size={"xl"} onClick={() => router.push("/login")}>Get Started</Button>
        </div>
    );
}
