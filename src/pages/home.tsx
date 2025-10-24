import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Dropdown from "../components/Dropdown";
import LogoHorizontal from "../images/LogoHorizontal.svg"
import LogoVertical from "../images/LogoVertical.svg"
import UserIcon from "../images/UserIcon.svg"
import Image from "next/image";
import Button from "../components/Button";
import { Bolt } from 'lucide-react';
import { LogOut } from 'lucide-react';
import {OrbitProgress} from "react-loading-indicators";
import Navbar from "../components/Navbar";
import AppSidebar from "../components/Sidebar";
import courseConetent from "../../src/courseContent/course1/content.json"

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
            </main>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <title>Home | MiniDesign</title>
            {/* Navbar */}
            <AppSidebar currentlyActive={"Home"}/>

            {/* Content */}
            <main className="flex flex-col items-center justify-center flex-1 p-6">
            </main>
        </div>
    );
}
