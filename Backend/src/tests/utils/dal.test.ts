import { test } from "node:test";
import assert from "node:assert/strict";
import { Dal } from "../../utils/dal";


test("transaction rolls back all writes when fn throws", () => {
    
    const db = new Dal(":memory:");
    
    assert.throws(() => db.transaction(() => {
        db.executeRun("insert into tags (name) values (?)", ["a"]);
        throw new Error("boom");
    }), /boom/);

    // check if tags table is empty:
    const result = db.executeGet("select count(*) as count from tags");
    assert.equal(result.count, 0, "tags table should be empty after rollback");

});

test("transaction commits and returns fn's result", () => {
    
    const db = new Dal(":memory:");

    // insert one tag to tags table:
    const result = db.transaction(() => {
        return db.executeRun("insert into tags (name) values (?)", ["a"]);
    });
    assert.equal(result.changes, 1, "Exactly one row should be inserted");
    
    // get count of tabs table:
    const rowCount = db.transaction(() => {
        return db.executeGet("select count(*) as count from tags");
    })
    assert.equal(rowCount.count, 1, "tags table should exactly have one row");

});