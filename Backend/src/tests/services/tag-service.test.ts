import assert from "node:assert/strict";
import { test } from "node:test";
import { ClientError } from "../../models/client-error";
import { TagService, tagService } from "../../services/tag-service";
import { Dal } from "../../utils/dal";

test("normalizeTag normalize right tag names", () => {
    
    // test tags to normalize:
    const testTags = [
        "prompt", " Code Template ", 
        "code_template", "Code Template", "v2" 
    ];

    // the results that should appear after normalize:
    const expectedResults = [
        "prompt", "code-template",
        "code-template", "code-template", "v2"
    ];

    // run over each test tag and assert it against its expected tag:
    for (let i = 0; i < testTags.length; i++) {
        const normalize = tagService.normalizeTag(testTags[i]);
        assert.equal(normalize, expectedResults[i]);
    }

});

test("normalizeTag normalize bad tag names", () => {

    const random41String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmno";

    const testTags = [
        "bad!name", "", " ",
        "-code", "code-", "code--template", random41String
    ];

    for (const tag of testTags) {
        assert.throws(() => tagService.normalizeTag(tag), ClientError);
    }

});

test("getAllTags", () => {
    const service = new TagService(new Dal(":memory:"));
    const tags = service.getAllTags();
    assert.deepEqual(tags, []);
})

test("addTag adding new spaced tag", () => {
    const service = new TagService(new Dal(":memory:"));
    
    // should become 'code-template'
    service.addTag(" Code Template ");
    assert.deepEqual(service.getAllTags().map(t => t.name), ["code-template"]);
});

test("addTag should return same id for both tags", () => {
    
    const service = new TagService(new Dal(":memory:"));

    // should return same id:
    const tag1 = service.addTag("prompt");
    const tag2 = service.addTag("Prompt");
    
    assert.equal(tag1.id, tag2.id);
    assert.deepEqual(service.getAllTags().map(t => t.name), ["prompt"]);
});

test("addTag should throw client error", () => {
    
    const service = new TagService(new Dal(":memory:"));
    
    // should throw client error:
    assert.throws(() => service.addTag("bad name!"), ClientError);
    assert.deepEqual(service.getAllTags(), []);
});

test("getAllTags returns tags sorted by name", () => {
    
    const service = new TagService(new Dal(":memory:"));
    
    // should be ["zeta", "alpha"]:
    service.addTag("zeta");
    service.addTag("alpha");

    assert.deepEqual(service.getAllTags().map(t => t.name), ["alpha", "zeta"]);
})

