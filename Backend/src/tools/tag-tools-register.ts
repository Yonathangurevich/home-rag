import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import { tagService } from "../services/tag-service";
import { toolLogger } from "./tool-logger";

class TagToolsRegister {

    public registerGetAllTagsTool(server: McpServer): void {
        const name = "list_tags";
        const config = {
            description: "List all existing tags. Tags are the categories that saved entries are filed under " +
            "(e.g. code-template, prompt). Call this before save_entry or search_entries to pick " +
            "existing tags, instead of inventing new ones. Returns [{ id, name }], sorted by name."
        }
        const tags = () => toolLogger.run(() => tagService.getAllTags());
        server.registerTool(name, config, tags);
    }

    public registerAddTagTool(server: McpServer): void {
        const name = "add_tag";
        const config = {
            description: "Create a new tag (a category for saved entries). Only use it when no tag from list_tags fits. " +
            "save_entry only accepts tags that already exist. The name is normalized to lowercase " +
            "kebab-case ('Code Template' becomes 'code-template'); names with other characters are rejected. " +
            "Adding a tag that already exists is safe and returns the existing tag. Returns { id, name }.",
    
            inputSchema: z.object({ name: z.string().describe("Tag name, e.g. 'code-template' or 'prompt'") })
        }
        const addTag = (args: { name: string }) => toolLogger.run(() => tagService.addTag(args.name));
        server.registerTool(name, config, addTag);
    }

}

export const tagToolsRegister = new TagToolsRegister();