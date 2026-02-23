import { workos } from "@/app/lib/workos";
import { authkit } from "@workos-inc/authkit-nextjs"; 
import { NextRequest, NextResponse } from "next/server";
import { USERS_TABLE_PERMISSION } from "@/app/lib/permissions"; 


export const GET = async (request: NextRequest) =>{
    // authkit reads the session cookie from the request, this runs on the server only
    const {session} = await authkit(request)
    // widget tokens are org-scoped: no active org means we cannot generate one
    if (!session?.user || !session.organizationId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    if (!session.permissions?.includes(USERS_TABLE_PERMISSION)){
        return NextResponse.json({error: "Forbidden"}, {status:403});
    }
    // generate token
    try {
        const token = await workos.widgets.getToken({
                organizationId: session.organizationId,
                userId: session.user.id,
                // scopes must exactly match what the widget requires
                scopes: [USERS_TABLE_PERMISSION],
        });
        return NextResponse.json({token})
    } catch {
        return NextResponse.json({error: "Failed to generate token"}, {status: 500});
    }
    
};