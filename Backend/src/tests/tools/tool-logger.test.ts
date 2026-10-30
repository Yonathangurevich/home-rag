import { test } from "node:test";
import assert  from "node:assert/strict";
import { toolLogger } from "../../tools/tool-logger";
import { ClientError } from "../../models/client-error";
import { StatusCode } from "../../models/enums";

test("ToolLogger run function no errors", async () => {
    const x: any = await toolLogger.run(() => ({a: 1}));
    assert.equal(x.content[0].text, '{"a":1}');
});

test("ToolLogger run function isError should be true for client error", async () => {
    const x: any = await toolLogger.run(() => {throw new ClientError(StatusCode.UnprocessableContent, "bad tag")});
    assert.equal(x.isError, true);
    assert.equal(x.content[0].text, "Error: bad tag");
});

test("ToolLogger run function isError should be true for Internal error", async () => {
    const x: any = await toolLogger.run(() => {throw new Error("SQL secret")});;
    assert.equal(x.isError, true);
    assert.equal(x.content[0].text, "Error: 'Internal error'");
});