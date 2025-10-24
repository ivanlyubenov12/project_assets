"use client";
import { useState, useRef, useEffect } from "react";

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: "left" | "right"; // default right-aligned
    gap?: number; // optional pixel gap from trigger
}

export default function Dropdown({
                                     trigger,
                                     children,
                                     align = "right",
                                     gap = 0,
                                 }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {trigger}
            </div>

            {open && (
                <div
                    className={`absolute flex flex-col top-full mt-2 rounded-lg shadow-lg z-50 bg-white border
                    ${align === "right" ? "right-0" : "left-0"} min-w-[200px] max-w-[90vw]`}
                    style={{ [align]: gap + "px" }}
                >
                    <div className="flex-1 p-3 gap-2 max-w-full break-words">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
