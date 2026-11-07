import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

const EntryModelSchema = z.object({
    title: z.string()
        .refine(v => v.trim() !== "", "title is required.")
        .max(200, "title is too long (max 200 characters)."),
    description: z.string()
        .refine(v => v.trim() !== "", "description is required.")
        .max(2000, "description is too long (max 2000 characters)."),
    content: z.string()
        .refine(v => v.trim() !== "", "content is required.")
        .refine(v => Buffer.byteLength(v, "utf8") <= 1024 * 1024, "content is too large (max 1 MB).")
});

type IEntryModel = z.infer<typeof EntryModelSchema>;

export class EntryModel implements IEntryModel {
    
    public id: string;
    public title: string;
    public description: string;
    public content: string;
    public tags: string[];
    public current_version: number;
    public created_at: string;
    public updated_at: string;
    public deleted_at: string | null;

    public constructor(entry: EntryModel) {
        this.id = entry.id;
        this.title = entry.title;
        this.description = entry.description;
        this.content = entry.content;
        this.tags = entry.tags;
        this.current_version = entry.current_version;
        this.created_at = entry.created_at;
        this.updated_at = entry.updated_at;
        this.deleted_at = entry.deleted_at;
    }

    public validate(): void {
        const result = EntryModelSchema.safeParse(this);
        if (!result.success) {
            throw new ClientError(StatusCode.UnprocessableContent, result.error.issues[0].message);
        }
    }
}