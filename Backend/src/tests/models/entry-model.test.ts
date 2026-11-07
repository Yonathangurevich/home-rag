import test from "node:test";
import assert  from "node:assert/strict";
import { EntryModel } from "../../models/entry-model";
import { ClientError } from "../../models/client-error";

function makeEntry(fields: Partial<EntryModel>): EntryModel {
    return new EntryModel({
        id: "x",
        title: "a",
        description: "a",
        content: "a",
        tags: ["test"],
        current_version: 1,
        created_at: "2026-01-01 00:00:00",
        updated_at: "2026-01-01 00:00:00",
        deleted_at: null,
        ...fields
    } as EntryModel);
}

test("EntryModel should be a valid model", () => {
    const entry = {
        id: "x",
        title: "test",
        description: "this is a test",
        content: "some content in here",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }
    const validEntry = new EntryModel(entry as EntryModel);
    assert.doesNotThrow(() => validEntry.validate());
});

test("EntryModel should return too long title", () => {
    const entry = {
        id: "x",
        title: "a".repeat(201),
        description: "a",
        content: "a",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(
        () => notValidEntry.validate(),
        (err: any) => err instanceof ClientError && err.message.includes("title")
    );
});

test("EntryModel should return too long description", () => {
    const entry = {
        id: "x",
        title: "a",
        description: "a".repeat(2001),
        content: "a",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(
        () => notValidEntry.validate(),
        (err: any) => err instanceof ClientError && err.message.includes("description")
    );
});

test("EntryModel should return too long content", () => {
    const entry = {
        id: "x",
        title: "a",
        description: "a",
        content: "a".repeat(1024 * 1024 + 1),
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(
        () => notValidEntry.validate(),
        (err: any) => err instanceof ClientError && err.message.includes("content")
    );
});

test("EntryModel should return title required", () => {
    const entry = {
        id: "x",
        title: "",
        description: "x",
        content: "x",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }
    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(() => notValidEntry.validate(), 
        (err: any) => err instanceof ClientError && err.message === "title is required."
    );
});

test("EntryModel should return description required", () => {
    const entry = {
        id: "x",
        title: "x",
        description: "",
        content: "x",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }
    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(() => notValidEntry.validate(), 
        (err: any) => err instanceof ClientError && err.message === "description is required."
    );
});
test("EntryModel should return content required", () => {
    const entry = {
        id: "x",
        title: "x",
        description: "x",
        content: "",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }
    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.throws(() => notValidEntry.validate(), 
        (err: any) => err instanceof ClientError && err.message === "content is required."
    );
});

test("EntryModel should be ok sending 200 characters of title", () => {
    const entry = {
        id: "x",
        title: "a".repeat(200),
        description: "a",
        content: "a",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.doesNotThrow(() => notValidEntry.validate());
});

test("EntryModel should be ok sending 2000 characters of description", () => {
    const entry = {
        id: "x",
        title: "a",
        description: "a".repeat(2000),
        content: "a",
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.doesNotThrow(() => notValidEntry.validate());
});

test("EntryModel should be ok sending max characters of content", () => {
    const entry = {
        id: "x",
        title: "a",
        description: "a",
        content: "a".repeat(1024 * 1024),
        tags: ["test"],
        current_version: 1,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        deleted_at: null
    }

    const notValidEntry = new EntryModel(entry as EntryModel);
    assert.doesNotThrow(() => notValidEntry.validate());
});

test("EntryModel should measure content in bytes", () => {
    const entry = makeEntry({ content: "é".repeat(600_000) });
    assert.throws(
        () => entry.validate(),
        (err: any) => err instanceof ClientError && err.message.includes("content")
    );
});

test("EntryModel should return title required", () => {
    for (const title of ["", "   "]) {
        assert.throws(() => makeEntry({ title }).validate(),
            (err: any) => err instanceof ClientError && err.message === "title is required."
        );
    }
});