import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { ClientError } from "../models/client-error";

class ToolLogger {

    public async run(toolName: string, fn: () => unknown): Promise<CallToolResult> {
        
        // start timer:
        const start = performance.now();
        
        try {
            
            // run the function: 
            const results = await fn();

            // return the results:
            return { content: [{ type: "text", text: `${JSON.stringify(results)}`}]}
        }
        catch(err: any) {
            
            // if the error part of client error enum: 
            if (err instanceof ClientError) {
                return {
                    content: [{ type: "text", text: `Error: ${err.message}` }],
                    isError: true
                };
            }

            // every other error:
            console.error(err);
            return {
                content: [{ type: "text", text: "Error: 'Internal error'" }],
                isError: true
            };
        }
        finally {
            this.log(toolName,)
        }
    }

    private log(toolName: string, status: string, start: number): void {
        const ms = Math.round(performance.now() - start);
        console.log(`tool=${toolName} status=${status} ms=${ms}`);
    } 

}

export const toolLogger = new ToolLogger();