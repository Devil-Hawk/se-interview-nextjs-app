"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { switchToOrganization } from "@workos-inc/authkit-nextjs";
import { OrganizationSwitcher, OrganizationSwitcherLoading } from "@workos-inc/widgets";
import { Button, Callout } from "@radix-ui/themes";
import NextLink from "next/link";
import { TokenError } from "@/app/lib/types";
import { fetchWidgetToken } from "@/app/lib/fetch-widget-token";

export function OrganizationSwitcherWidget() {
    const { user } = useAuth();
    const { data: token, isLoading, error, refetch } = useQuery<string, TokenError>({
        queryKey: ["org-switcher-token"],
        queryFn: () => fetchWidgetToken("/api/widgets/org-switcher-token"),
        // tokens expire at 60 min; cache for 55 so the widget never receives an already-expired token
        staleTime: 55 * 60 * 1000,
        // 401/403 errors wont get fixed by retrying so we skip retries
        retry: false,
        // dont fetch if user is not signed in, no point showing the switcher
        enabled: !!user,
    });

    if (!user) return null;

    if (isLoading) return <OrganizationSwitcherLoading />;

    if (error) {
        const message =
            error.status === 401 ? "Your session expired. Please sign in again." : "Could not load the org switcher.";

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
            <Callout.Text>Could not load the org switcher.</Callout.Text>
        </Callout.Root>
    );

    // switchToOrganization is a server action from authkit, it updates the session to the new org.
    // The widget gives us { organizationId } as an object but the action needs just the string id, so we pull it out
    return (
        <OrganizationSwitcher
            authToken={token}
            switchToOrganization={async ({ organizationId }) => {
                // revalidationStrategy none stops authkit from doing its own soft redirect
                // so we can do a hard reload instead, which clears React Query cache and shows the new org correctly
                await switchToOrganization(organizationId, { revalidationStrategy: "none" });
                window.location.href = "/";
            }}
        />
    );
}