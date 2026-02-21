"use client";

import {useQuery} from "@tanstack/react-query"
import { UsersManagement, UsersManagementLoading } from "@workos-inc/widgets";
import { Button, Callout } from "@radix-ui/themes";
import NextLink from "next/link";
import { USERS_TABLE_PERMISSION } from "@/app/lib/permissions";

type TokenError = Error & { status?: number };


export function UsersManagementWidget() {
    const {data: token, isLoading, error, refetch} = useQuery<string, TokenError>({
        queryKey: ["users-management-token"],
        queryFn: async () =>{
            //fetching the token here, also cache used as no store to get fresh response from server
            const res = await fetch("/api/widget-token", {cache: "no-store"});
            const payload = await res.json();
            if (!res.ok){
                const err = new Error(payload.error ?? "Unable to load the widget token") as TokenError;
                err.status = res.status;
                throw err;
            }
            //if no token is there
            if (!payload.token){
                const err = new Error("Token missing") as TokenError;
                err.status = 500;
                throw err;
            }
            return payload.token;
        },
        // tokens expire at 60 min; cache for 55 so the widget never receives an already-expired token
        staleTime: 55*60*1000,
        // 401/403 errors won't fix themselves on retry — avoid hammering the server
        retry: false,
    });
    if (isLoading) return <UsersManagementLoading />;

    if (error) {
        const message =
            error.status === 401 ? "Your session expired. Please sign in again." :
            error.status === 403 ? `Your role needs the ${USERS_TABLE_PERMISSION} permission. Ask an admin.` :
            "Could not load the user management widget.";

        return (
            <Callout.Root color="red" role="alert">
                <Callout.Text>
                    {message}{" "}
                    {error.status === 401 ? (
                        <Button asChild variant="ghost" size="1">
                            <NextLink href="/login">Sign in</NextLink>
                        </Button>
                    ) : (
                        <Button variant="ghost" size="1" onClick={() => refetch()}>
                            Try again
                        </Button>
                    )}
                </Callout.Text>
            </Callout.Root>
        );
    }

    if (!token) return (
        <Callout.Root color="red" role="alert">
            <Callout.Text>Could not load the user management widget.</Callout.Text>
        </Callout.Root>
    );

    return <UsersManagement authToken={token} />;
}