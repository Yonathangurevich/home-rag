import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { tagToolsRegister } from "./tag-tools-register";

class HomeRagMcpServer {

    public create(): McpServer {
        
        // create mcp server:
        const mcpServer =  new McpServer({
            name: "home-rag",
            version: "1.0.0"
        });
        
        // register the tools:
        tagToolsRegister.registerGetAllTagsTool(mcpServer);
        tagToolsRegister.registerAddTagTool(mcpServer);

        // return mcp server:
        return mcpServer
    }

    

}

export const homeRagMcpServer = new HomeRagMcpServer();