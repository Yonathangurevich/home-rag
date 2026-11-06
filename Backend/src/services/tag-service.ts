import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { TagModel } from "../models/tag-model";
import { dal, Dal } from "../utils/dal";

export class TagService {

    private dal: Dal;

    public constructor(dal: Dal) {
        this.dal = dal;
    }

    public normalizeTag(raw: string): string {
        
        // trim and lower case the raw string:
        let tagName = raw.trim().toLowerCase();
        
        // replace all snake cases to kebab case:
        tagName = tagName.replace(/[\s_]+/g, "-");
        
        // regex to validated the tag name:
        const ragex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        if (!ragex.test(tagName) || tagName.length > 40) {
            throw new ClientError(StatusCode.UnprocessableContent,
                `Invalid tag name "${raw}". Use lowercase letters, numbers and single dashes, e.g. "code-template".`
            );
        }

        // return the tagName:
        return tagName;
    }

    // return all tags:
    public getAllTags(): TagModel[] {
        const sql = `select id, name from tags order by name`;
        const tags = this.dal.executeAll(sql) as TagModel[];
        return tags;
    }

    // add new tag:
    public addTag(raw: string): TagModel {
        const tag = this.normalizeTag(raw);
        const sql = "insert into tags (name) values (?) on conflict(name) do nothing";
        this.dal.executeRun(sql, [tag]);
        return this.dal.executeGet("select id, name from tags where name = ?", [tag]);
    }

    public resolveTags(names: string[]): TagModel[] {
        
        if (names.length === 0) {
            throw new ClientError(StatusCode.UnprocessableContent, "At least one tag is required. Use list_tags to see existing tags.");
        }

        let normalizedTags = new Set<string>();

        // validate names and add to normalizedTags set:
        for (const name of names) {
            normalizedTags.add(this.normalizeTag(name));
        }

        // turn the set to array:
        const values: string[] = Array.from(normalizedTags);

        // each name turns into '?' and join all names:
        const placeholders = values.map(() => "?").join(", ");

        // sql query:
        const sql = `select id, name from tags where name in (${placeholders}) order by name`;
        const tags = this.dal.executeAll(sql, values) as TagModel[];

        // find unknown names:
        const foundNames = tags.map(t => t.name);
        const unknown = values.filter(name => !foundNames.includes(name));

        // if any unknown names exists throw:
        if (unknown.length > 0) {
            throw new ClientError(StatusCode.UnprocessableContent, `Unknown tags: ${unknown.join(", ")}. Use list_tags to see existing tags, or add_tag to create a new one.`)
        }

        // return tags from dal:
        return tags;
    }

}

export const tagService = new TagService(dal);