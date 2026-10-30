import { test } from "node:test";
import assert from "node:assert/strict";
import { buildQueryText, buildDocumentText, EmbeddingService } from "../../services/embedding-service";

test("buildQueryText uses the model's search query format", () => {
    assert.equal(buildQueryText("jwt auth"), "task: search result | query: jwt auth");
});

test("buildDocumentText puts title, description and tags in the model's document format", () => {
    assert.equal(buildDocumentText(
        "JWT Service", "Creates and verifies JWT's", ["typescript", "auth"]
    ), "title: JWT Service | text: Creates and verifies JWT's Tags: typescript, auth");
});

test("a failed model load is retried on the next call", async () => {
    
    const service = new EmbeddingService();
    let calls = 0;

    // fake loadExtractor without loading the model:
    (service as any).loadExtractor = async () => {
        
        // each call will increase:
        calls++;

        // first query will fail
        if (calls === 1) throw new Error("network down");
        
        // return on the second time the dims:
        return async () => ({data: new Float32Array(768)});
    }

    // first call which fails:
    await assert.rejects(service.embedQuery("x"), /network down/);
    
    // second call which will work:
    const v = await service.embedQuery("x");
    
    // should return 768 dims:
    assert.equal(v.length, 768);
    
    // the load run twice:
    assert.equal(calls, 2);
});