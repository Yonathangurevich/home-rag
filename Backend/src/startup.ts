import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express";
import { healthController } from "./controllers/health-controller";
import { mcpController } from "./controllers/mcp-controller";
import { startChecker } from "./utils/start-checker";
import { appConfig } from "./utils/app-config";
import e from "express";

class StartApp {

    // build the server:
    public build(): e.Express {
        
        // create mcp app:
        const server = createMcpExpressApp({ host: appConfig.host });

        // register controllers:
        server.use(healthController.route);
        server.use(mcpController.route);
        
        return server;
    }
    
    public async start(): Promise<e.Express> {
        
        await startChecker.check();

        return this.build();
    }

}

export const startApp = new StartApp();