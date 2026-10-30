import { embeddingService } from ".././services/embedding-service";
import { appConfig } from ".././utils/app-config";
import { dal } from ".././utils/dal";

class StartChecker {

    public async check(): Promise<void> {
        
        console.log("Starting Home RAG...");

        const mcpToken = appConfig.mcpToken;
        if (mcpToken.length < 32) {
            throw new Error(`
                MCP_TOKEN is missing or too short (min 32 chars).... Generate one with: openssl rand -hex 32
            `);
        }
        
        // check the sqlite connection:
        const sqlVersion = dal.checkVecVersion();
        
        // throw on sql connection error:
        if (sqlVersion.length === 0) {
            throw new Error("SQL server doesn't working.");
        }

        console.log(`SQL version: ${sqlVersion}`);

        console.log("Loading embedding model...");
        
        // warm up the embedding service:
        const modelTime = embeddingService.warmUp().catch(err => {
            throw err;
        });

        console.log(`Model is ready (${await modelTime} ms)`);
        
        console.log(`Ready. Data dir: ${appConfig.dataDir}`);
        
    }

}

export const startChecker = new StartChecker();