import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

const EntriesSchema = z.object({
    id: z.uuid().optional(),
    collection_id: z.number().int().positive(),
    title: z.string().min(2).max(100),
    description: z.string().min(4).max(1000),
    content: z.string().min(4).max(100_000),
    current_version: z.number().int().positive(),
});

type IEntiresModel = z.infer<typeof EntriesSchema>;

export class EntriesModel implements IEntiresModel {
    public id: string;
    public collection_id: number;
    public title: string;
    public description: string;
    public content: string;
    public current_version: number;

    public constructor(entry: EntriesModel) {
        this.id = entry.id;
        this.collection_id = entry.collection_id;
        this.title = entry.title;
        this.description = entry.description;
        this.content = entry.content;
        this.current_version = entry.current_version;
    }

    public validate(): void {
        const result = EntriesSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }
}