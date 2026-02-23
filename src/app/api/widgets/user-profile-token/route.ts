import { workos } from "@/app/lib/workos";
import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) =>{
    // authkit reads the session cookie from the request, this runs on the server only
    const {session} = await authkit(request)
    // no special permission needed, any signed-in user can view their own profile
    if (!session?.user || !session.organizationId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    // generate token
    try {
        const token = await workos.widgets.getToken({
                organizationId: session.organizationId,
                userId: session.user.id,
                // no scopes here since user profile doesn't need a scope
        });
        return NextResponse.json({token})
    } catch {
        return NextResponse.json({error: "Failed to generate token"}, {status: 500});
    }
    
};