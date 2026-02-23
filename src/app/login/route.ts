import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const GET = async () => {
  const signInUrl = await getSignInUrl({ organizationId: process.env.WORKOS_DEFAULT_ORGANIZATION_ID });

  return redirect(signInUrl);
};
