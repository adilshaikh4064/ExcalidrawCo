"use client";

import { useEffect, useState } from "react";

function LightIcon() {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#F8F9FA"
            >
                <path d="M480.03-371q45.43 0 77.2-31.8Q589-434.6 589-480.03q0-45.43-31.8-77.2Q525.4-589 479.97-589q-45.43 0-77.2 31.8Q371-525.4 371-479.97q0 45.43 31.8 77.2Q434.6-371 480.03-371Zm-.03 91q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM205.5-434.5h-171v-91h171v91Zm720 0h-171v-91h171v91Zm-491-320v-171h91v171h-91Zm0 720v-171h91v171h-91ZM255.76-641.87 147.35-746.52l64.41-67.13 104.13 107.17-60.13 64.61Zm492.48 495.52L643.11-254.52 704-317.65l108.65 104.17-64.41 67.13ZM642.35-704l104.17-108.65 67.13 64.41-107.17 104.13L642.35-704Zm-496 492.24 108.17-105.13L317.65-256 213.48-147.35l-67.13-64.41ZM480-480Z" />
            </svg>
        </>
    );
}

function DarkIcon() {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#212529"
            >
                <path d="M479.96-116.41q-151.48 0-257.51-106.04-106.04-106.03-106.04-257.51 0-151.47 106.05-257.67Q328.51-843.83 480-843.83q13.28 0 26.3.88 13.03.88 25.55 2.88-38.13 29.96-61.08 75.15-22.94 45.18-22.94 97.27 0 91.69 64.32 155.88 64.33 64.18 156.22 64.18 52.61 0 97.41-22.82 44.81-22.83 74.52-60.96 1.77 12.52 2.65 25.23.88 12.72.88 25.9 0 151.44-106.2 257.63-106.2 106.2-257.67 106.2Zm.04-91q81.78 0 147.96-43.72 66.17-43.72 98.41-114.78-17.61 4.04-35.22 6.32-17.61 2.29-34.98 1.81-122.04-4.07-207.94-89.37-85.9-85.31-90.45-209.26-.24-17.37 1.93-34.98 2.16-17.61 6.44-34.98-70.82 32.48-114.78 98.65-43.96 66.18-43.96 147.72 0 112.93 79.83 192.76 79.83 79.83 192.76 79.83Zm-13.11-259.48Z" />
            </svg>
        </>
    );
}

export const ThemeButton = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const ifSystemDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if ((!storedTheme && ifSystemDark) || storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const isCurrentlyDark =
            document.documentElement.classList.contains("dark");

        if (isCurrentlyDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <div
            className={`${isDark ? "bg-keep-800" : "bg-keep-200"} rounded-full h-[32] w-[32] flex justify-center items-center drop-shadow-md drop-shadow-red-400/40 hover:drop-shadow-red-400 hover:border-red-400/40 hover:border-1 hover:scale-120  transition-all duration-300 ease-in-out dark:hover:drop-shadow-red-800 dark:hover:border-red-800/40`}
        >
            <button onClick={toggleTheme}>
                {isDark ? <LightIcon /> : <DarkIcon />}
            </button>
        </div>
    );
};
