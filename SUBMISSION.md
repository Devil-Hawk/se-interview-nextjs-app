# Submission

## Live App

**URL:** https://work-os-eta.vercel.app/

**Demo credentials:**
- Email: `workos.demo.ankit@gmail.com`
- Password: `SomePassword12344`

The demo account is an admin, so all three widgets are fully accessible.

## What I Built

### Core requirement
- **Users Management widget** — invite, remove, and manage roles for organization members

### Bonus widgets
- **User Profile widget** — lets the signed-in user edit their own profile
- **Organization Switcher widget** — lets users switch between organizations they belong to

### Dark mode
Added a theme toggle in the header using `next-themes` and Radix UI's `appearance` prop. Defaults to the system preference.

## How It Works

Each widget needs a short-lived token generated on the server. I created a separate API route per widget (`/api/widgets/*-token`) that calls `workos.widgets.getToken()` with the right permission scope. On the client, I fetch these tokens using React Query with a 55-minute `staleTime` so the widget never receives an already-expired token.

The Users Management token also checks that the signed-in user has the `widgets:users-table:manage` permission before generating it, so members without that role get a clear error instead of a 403 from WorkOS.

## One Thing Worth Mentioning

The Organization Switcher had a subtle bug: after switching orgs, the page would still show the previous org's data. This happened because WorkOS's `switchToOrganization` does a soft Next.js redirect, which preserves the React Query cache. I fixed it by passing `revalidationStrategy: "none"` to stop the soft redirect, then doing `window.location.href = "/"` for a hard reload that clears the cache entirely.

## What I'd Add Next

A custom **Activity Feed** using the WorkOS Events API — showing authentication events, membership changes, and session activity per organization. It'd complement the Users Management widget well by giving admins visibility into what's actually happening in their org.

## Repo

https://github.com/Devil-Hawk/se-interview-nextjs-app
