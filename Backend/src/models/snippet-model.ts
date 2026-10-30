import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

const SnippetSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().min(2).max(100),
    description: z.string().min(4).max(1000)
});

type ISnippetModel = z.infer<typeof SnippetSchema>;

export class SnippetModel implements ISnippetModel {
    
    public id: number;
    public name: string;
    public description: string;

    public constructor(snippet: SnippetModel) {
        this.id = snippet.id;
        this.name = snippet.name;
        this.description = snippet.description;
    }

    public validate(): void {
        const result = SnippetSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}
