import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import express, { Request, Response, Router } from "express";
import { StatusCode } from "../models/enums";
import { homeRagMcpServer } from "../tools/mcp-server";
import { errorMessages } from "../utils/error-messages";
import { securityMiddleware } from "../middleware/security-middleware";

class McpController {

    public route: Router = express.Router();

    public constructor() {
        this.route.get("/mcp", securityMiddleware.verifyToken, this.methodNotAllowed);
        this.route.post("/mcp", securityMiddleware.verifyToken, this.handleMcpRequest);
    }

    private async handleMcpRequest(request: Request, response: Response): Promise<void> {
        
        // create mcp server:
        const mcpServer = homeRagMcpServer.create();
        
        // create steaming connection: 
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        
        // when response get close, will close connection:
        response.on("close", () => {
            transport.close();
            mcpServer.close();
        });

        // connect the server with the streaming connection:
        await mcpServer.connect(transport);
        
        // handle the request, response and the body:
        await transport.handleRequest(request, response, request.body);
    }

    // return on get "/mcp" route:
    private async methodNotAllowed(request: Request, response: Response): Promise<void> {
        
        const jsonMessage = errorMessages.error405();

        response.status(StatusCode.MethodNotAllowed).json(jsonMessage);
    }

}

export const mcpController = new McpController();