"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Theme = "system" | "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "system",
    setTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");

    // Listen for auth changes
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Load user theme from Firestore
                const snap = await getDoc(doc(db, "users", user.uid));
                const pref = snap.exists() ? (snap.data().theme as Theme) : null;
                if (pref) {
                    console.log("Loaded theme from Firestore:", pref);
                    setThemeState(pref);
                }
            } else {
                // No user -> reset to system
                console.log("No user logged in, reverting to system theme");
                setThemeState("system");
            }
        });
        return () => unsub();
    }, []);

    // Apply theme to <html>
    useEffect(() => {
        console.log("Applying theme:", theme);
        if (theme === "system") {
            document.documentElement.removeAttribute("data-theme");
            document.documentElement.style.colorScheme = "light dark";
        } else {
            document.documentElement.dataset.theme = theme;
            document.documentElement.style.colorScheme = theme;
        }
    }, [theme]);

    // Save + update state for logged-in users
    const setTheme = async (t: Theme) => {
        console.log("Setting theme:", t);
        setThemeState(t);
        const user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, "users", user.uid), { theme: t }, { merge: true });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
