import { TokenError } from "@/app/lib/types";

// Shared token fetcher used by all widget components. (easier to implement for shared usage for multiple widgets)
// cache: no-store so we always get a fresh token from the server, not an old cached one
export async function fetchWidgetToken(url: string): Promise<string> {
    const res = await fetch(url, { cache: "no-store" });
    const payload = await res.json();

    if (!res.ok) {
        const err = new Error(payload.error ?? "Unable to load the widget token") as TokenError;
        err.status = res.status;
        throw err;
    }

    // Defensive check meaning, the API should always return a token if res.ok, but guard anyway
    if (!payload.token) {
        const err = new Error("Token missing") as TokenError;
        err.status = 500;
        throw err;
    }

    return payload.token;
}