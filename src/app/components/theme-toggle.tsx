"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    return (
        <IconButton
            variant="soft"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </IconButton>
    );
}
