export class EntryModel {
    
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
}