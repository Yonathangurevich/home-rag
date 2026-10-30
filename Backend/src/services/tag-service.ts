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

}

export const tagService = new TagService(dal);