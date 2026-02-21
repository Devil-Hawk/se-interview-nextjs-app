import { withAuth } from "@workos-inc/authkit-nextjs";
import { USERS_TABLE_PERMISSION } from "@/app/lib/permissions";
import { UsersManagementWidget } from "@/app/components/users-management-widget";
import { Flex, Heading, Text } from "@radix-ui/themes";


export default async function TeamPage() {
    // EnsureSignedin makes sure if there isnt a session then we redirect to login. 
    const {permissions} = await withAuth({ensureSignedIn: true});
    const hasAccess = permissions?.includes(USERS_TABLE_PERMISSION);

    if (!hasAccess){
        return (<Flex direction= "column" align="center" gap="2">
            <Heading size="6">Access Denied</Heading>
            <Text color="gray">You need the <strong>{USERS_TABLE_PERMISSION}</strong> permission to view this page.</Text>
        </Flex>)
    }
    return <UsersManagementWidget />;
}


