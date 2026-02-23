import assert from "node:assert/strict";
import {WorkOS} from "@workos-inc/node";


const {WORKOS_API_KEY, WORKOS_CLIENT_ID} = process.env
// assert.ok throws at server startup if env vars are missing fails early
// rather than a crash mid-request in prod when someone tries to use the client
assert.ok(WORKOS_API_KEY, "WORKOS_API_KEY is required")
assert.ok(WORKOS_CLIENT_ID, "WORKOS_CLIENT_ID is required");


// singleton instance where one client will be shared across all server requests in this process
export const workos = new WorkOS(WORKOS_API_KEY, {
    clientId: WORKOS_CLIENT_ID,
});
