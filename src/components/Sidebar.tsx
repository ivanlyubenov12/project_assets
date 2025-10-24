"use client";

import styles from "../styles/Sidebar.module.css";
import {
    Person,
    PersonOutlined,
    Home,
    HomeOutlined,
    DesignServices,
    DesignServicesOutlined,
    Notifications,
    NotificationsOutlined,
    Settings,
    SettingsOutlined,
    Bookmark,
    BookmarkOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import AppIcon from "../../public/appIcon.svg";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from "../components/Loader"

type SidebarProps = {
    currentlyActive?: "Home" | "Learn" | "Saved" | "Notifications" | "Settings" | "Account";
};

export default function Sidebar({ currentlyActive }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <Image src={AppIcon} alt="MiniDesign Sidebar Logo" width={50} />
                </div>
                <nav className={styles.nav}>
                    <SidebarItem
                        active={currentlyActive === "Home"}
                        icon={currentlyActive === "Home" ? <Home /> : <HomeOutlined />}
                        label="Home"
                        badge=""
                        href="/home"

                    />
                    <SidebarItem
                        active={currentlyActive === "Learn"}
                        icon={
                            currentlyActive === "Learn" ? (
                                <DesignServices />
                            ) : (
                                <DesignServicesOutlined />
                            )
                        }
                        label="Learn"
                        badge=""
                        href="/learn"
                    />
                    <SidebarItem
                        active={currentlyActive === "Saved"}
                        icon={currentlyActive === "Saved" ? <Bookmark /> : <Bookmark />}
                        label="Saved"
                        href="/saved"
                    />
                </nav>
            </div>

            <div className={styles.bottom}>
                <SidebarItem
                    active={currentlyActive === "Notifications"}
                    icon={
                        currentlyActive === "Notifications" ? (
                            <Notifications />
                        ) : (
                            <NotificationsOutlined />
                        )
                    }
                    label=""
                    badge=""
                    href="/notifications"
                />
                <SidebarItem
                    active={currentlyActive === "Settings"}
                    icon={currentlyActive === "Settings" ? <Settings /> : <SettingsOutlined />}
                    label=""
                    href="/usersettings"
                />
                <SidebarItem
                    active={currentlyActive === "Account"}
                    icon={currentlyActive === "Account" ? <Person /> : <PersonOutlined />}
                    label=""
                    href="/profile"
                />
            </div>
        </div>
    );
}


function SidebarItem({
                                        icon,
                                        label,
                                        badge,
                                        active,
                                        href,
                                    }: SidebarItemProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        router.push(href); // trigger navigation manually
    };

    return (
        <>
            <Link
                href={href}
                onClick={handleClick}
                className={`${styles.item} ${active ? styles.active : ""} text-body-l`}
            >
                <div className={styles.icon}>{icon}</div>
                {label && <span className={styles.label}>{label}</span>}
                {badge && <span className={styles.badge}>{badge}</span>}
            </Link>

            {loading && (
                <div className={styles.loaderOverlay}>
                    <Loader />
                </div>
            )}
        </>
    );
}
