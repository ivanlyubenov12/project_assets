import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "../components/AuthForm";
import { auth } from "../../lib/firebase";

export default function LoginPage() {
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.push((redirect as string) || "/home");
            }
        });
        return () => unsubscribe();
    }, [router, redirect]);

    return (
        <div className="flex justify-center items-center h-screen">
            <title>Login | MiniDesign</title>
            <AuthForm />
        </div>
    );
}
