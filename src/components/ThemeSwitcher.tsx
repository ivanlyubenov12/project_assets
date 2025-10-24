"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Theme</h2>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="border rounded p-2"
            >
                <option value="system">System (Follow device)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    );
}
