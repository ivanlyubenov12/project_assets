"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import {
    signOut,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updateProfile,
} from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { OrbitProgress } from "react-loading-indicators";
import AppSidebar from "@/components/Sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function UserSettings() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (!u) {
                router.push(`/login?redirect=${router.asPath}`);
            } else {
                setUser(u);
                setDisplayName(u.displayName || "");
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (!user)
        return (
            <main className="flex items-center justify-center min-h-screen">
                <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
            </main>
        );

    // --- Actions ---
    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const handleNameChange = async () => {
        if (!displayName) return;
        await updateProfile(user, { displayName });
        await updateDoc(doc(db, "users", user.uid), { name: displayName });
        alert("Display name updated!");
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const cred = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPassword);
        alert("Password updated!");
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This will permanently delete your account.")) return;

        try {
            const cred = EmailAuthProvider.credential(
                user.email,
                prompt("Enter your password") || ""
            );
            await reauthenticateWithCredential(user, cred);

            await deleteDoc(doc(db, "users", user.uid));
            await user.delete();
            router.push("/login");
        } catch (err: any) {
            alert("Failed to delete account: " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <title>User Settings | MiniDesign</title>
            {/* Sidebar (fixed) */}
            <AppSidebar currentlyActive="Settings" />

            {/* Main content with left padding to not overlap sidebar */}
            <main className="flex-1 pl-[100px] p-8">
                <div className="max-w-xl mx-auto flex flex-col gap-6">
                    <h1 className="text-heading-l">User Settings</h1>

                    {/* Display name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-body-l">Display Name</label>
                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} size="m" />
                        <Button
                            onClick={handleNameChange}
                            className="self-start px-4 py-2 bg-blue-500 text-white rounded"
                            size="m"
                        >
                            Update Name
                        </Button>
                    </div>

                    {/* Change password */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-body-l">Change Password</h2>
                        <Input
                            type="password"
                            placeholder="Old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border rounded p-2"
                        />
                        <Input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded p-2"
                        />
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border rounded p-2"
                        />
                        <Button
                            onClick={handleChangePassword}
                            className="self-start px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Update Password
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-body-l">Manage session/delete account</h2>
                        {/* Logout */}
                        <Button
                            onClick={handleLogout}
                            className="self-start px-4 py-2 bg-gray-600 text-white rounded"
                            variant="primary"
                            size="m"
                        >
                            Logout
                        </Button>

                        {/* Delete account */}
                        <Button variant={"secondary"} onClick={handleDeleteAccount} className="self-start px-4 py-2 bg-red-600 text-white rounded" size={"m"}>
                            Delete Account
                        </Button>

                    </div>
                    <ThemeSwitcher />

                </div>

            </main>
        </div>
    );
}
