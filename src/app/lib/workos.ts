import assert from "node:assert/strict";
import {WorkOS} from "@workos-inc/node";


const {WORKOS_API_KEY, WORKOS_CLIENT_ID} = process.env
// assert.ok throws at server startup if env vars are missing — fails loudly early
// rather than a cryptic crash mid-request when something tries to use the client
assert.ok(WORKOS_API_KEY, "WORKOS_API_KEY is required")
assert.ok(WORKOS_CLIENT_ID, "WORKOS_CLIENT_ID is required");


// The workOS client, after importing it from node, we need to export the instance
export const workos = new WorkOS(WORKOS_API_KEY, {
    clientId:WORKOS_CLIENT_ID,
});
