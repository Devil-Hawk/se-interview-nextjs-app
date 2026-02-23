"use client";

import { useQuery } from "@tanstack/react-query";
import { UserProfile, UserProfileLoading } from "@workos-inc/widgets";
import { Button, Callout } from "@radix-ui/themes";
import NextLink from "next/link";
import { TokenError } from "@/app/lib/types";
import { fetchWidgetToken } from "@/app/lib/fetch-widget-token";

export function UserProfileWidget() {
    const { data: token, isLoading, error, refetch } = useQuery<string, TokenError>({
        queryKey: ["user-profile-token"],
        queryFn: () => fetchWidgetToken("/api/widgets/user-profile-token"),
        // tokens expire at 60 min; cache for 55 so the widget never receives an already-expired token
        staleTime: 55 * 60 * 1000,
        // 401/403 errors wont get fixed by retrying so we skip retries
        retry: false,
    });

    if (isLoading) return <UserProfileLoading />;

    if (error) {
        const message =
            error.status === 401 ? "Your session expired. Please sign in again." : "Could not load your profile.";

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
            <Callout.Text>Could not load user profile.</Callout.Text>
        </Callout.Root>
    );

    return <UserProfile authToken={token} />;
}