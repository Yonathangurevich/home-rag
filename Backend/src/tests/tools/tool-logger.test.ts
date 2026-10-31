import { test } from "node:test";
import assert  from "node:assert/strict";
import { toolLogger } from "../../tools/tool-logger";
import { ClientError } from "../../models/client-error";
import { StatusCode } from "../../models/enums";

test("ToolLogger run logs ok", async (t) => {
    const fakeLog = t.mock.method(console, "log", () => {});
    const x: any = await toolLogger.run("test_tool4", () => ({a: 1}));
    assert.equal(x.content[0].text, '{"a":1}');
    assert.equal(fakeLog.mock.callCount(), 1);
    assert.match(fakeLog.mock.calls[0].arguments[0], /^tool=test_tool4 status=ok ms=\d+$/);
});

test("ToolLogger run logs client_error", async (t) => {
    const fakeLog = t.mock.method(console, "log", () => {});
    const x: any = await toolLogger.run("test_tool5", () => {throw new ClientError(StatusCode.UnprocessableContent, "bad tag")});
    assert.equal(x.content[0].text, "Error: bad tag");
    assert.equal(x.isError, true);
    assert.equal(fakeLog.mock.callCount(), 1);
    assert.match(fakeLog.mock.calls[0].arguments[0], /^tool=test_tool5 status=client_error ms=\d+$/);
});

test("ToolLogger run logs internal_error", async (t) => {
    const fakeLog = t.mock.method(console, "log", () => {});
    const x: any = await toolLogger.run("test_tool6", () => {throw new Error("SQL secret")});
    assert.equal(x.content[0].text, "Error: 'Internal error'");
    assert.equal(x.isError, true);
    assert.equal(fakeLog.mock.callCount(), 1);
    assert.match(fakeLog.mock.calls[0].arguments[0], /^tool=test_tool6 status=internal_error ms=\d+$/);
});