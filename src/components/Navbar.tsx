// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { Bolt, LogOut } from "lucide-react"; // icons
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown"; // adjust to your import
import LogoHorizontal from "../images/LogoHorizontal.svg";
import UserIcon from "../images/UserIcon.svg";
import { MdSettings, MdLogout } from "react-icons/md";

type NavbarProps = {
    user: {
        email?: string | null;
        photoURL?: string | null;
    };
    onLogout: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
    const router = useRouter();

    return (
        <nav className="flex items-center justify-between p-4 shadow-md sticky top-0">
            {/* Logo click → home */}
            <Image
                src={LogoHorizontal}
                alt="MiniDesign Logo"
                width={400}
                onClick={() => router.push("/home")}
                className="cursor-pointer"
            />

            <Dropdown
                trigger={
                    <Image
                        src={user.photoURL || UserIcon}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border cursor-pointer"
                        width={40}
                        height={40}
                    />
                }
                align="right"
            >
                <p className="text-body-m">Logged in as {user.email || "User"}</p>
                <Button
                    size="m"
                    onClick={() => router.push("/usersettings")}
                    className="w-full"
                    leftIcon={MdSettings()}
                >
                    Settings
                </Button>
                <Button
                    size="m"
                    onClick={onLogout}
                    className="w-full"
                    leftIcon={MdLogout()}
                >
                    Log out
                </Button>
            </Dropdown>
        </nav>
    );
}
