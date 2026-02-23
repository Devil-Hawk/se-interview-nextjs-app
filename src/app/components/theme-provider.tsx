"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Theme } from "@radix-ui/themes";

// reads the resolved theme from next-themes and passes it to Radix UI Theme
// we need this as a separate component because useTheme only works inside NextThemesProvider
function RadixTheme({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    return (
        <Theme
            appearance={resolvedTheme === "dark" ? "dark" : "light"}
            accentColor="iris"
            panelBackground="solid"
            style={{ backgroundColor: "var(--gray-1)" }}
        >
            {children}
        </Theme>
    );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <RadixTheme>{children}</RadixTheme>
        </NextThemesProvider>
    );
}
