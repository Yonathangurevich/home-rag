import { test } from "node:test";
// import { Assert } from "node:assert/strict";

import { appConfig } from "../../utils/app-config";
import { startApp } from "../../startup";
import { once } from "events";
import { AddressInfo } from "net";
import assert from "node:assert/strict";

// start the app on random port:
async function spawnApp() {
    const server = startApp.build().listen(0, appConfig.host);
    await once(server, "listening");
    const port = (server.address() as AddressInfo).port;
    return {
        url: `http://${appConfig.host}:${port}`,
        close: () => { 
            server.closeAllConnections();
            server.close();
        }
    };
}

test("POST /mcp without a token returns 401", async (t) => {
    
    // run the server:
    const app = await spawnApp();
    t.after(() => app.close());

    const response = await fetch(`${app.url}/mcp`, { method: "POST" });
    assert.equal(response.status, 401);

});

test("POST /mcp with wrong Bearer", async (t) => {
    const app = await spawnApp();
    t.after(() => app.close());

    const response =  await fetch(`${app.url}/mcp`, { 
        method: "POST",
        headers: {
            "Authorization": "Bearer blah-la-la-la-im-real-token"
        } 
    });
    assert.equal(response.status, 401);
});

test("POST /mcp with right Bearer token", async (t) => {
    const app = await spawnApp();
    t.after(() => app.close());

    const response = await fetch(`${app.url}/mcp`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${appConfig.mcpToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        },
        body: JSON.stringify({
            jsonrpc: "2.0", id: 1, method: "initialize",
            params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } },
        }),
    });
    assert.equal(response.status, 200);
});

test("GET /mcp with right Bearer token", async (t) => {
    const app = await spawnApp();
    t.after(() => app.close());

    const response = await fetch(`${app.url}/mcp`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${appConfig.mcpToken}` 
        }
    });
    assert.equal(response.status, 405);
});

test("GET /health with no Bearer token", async (t) => {
    const app = await spawnApp();
    t.after(() => app.close());

    const response = await fetch(`${app.url}/health`);
    assert.equal(response.status, 200);
});