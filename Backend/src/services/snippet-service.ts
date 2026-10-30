import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { SnippetModel } from "../models/snippet-model";
import { dal } from "../utils/dal";

class SnippetService {

    public createNewSnippet(snippet: SnippetModel): void {
        
        // validate the snippet:
        snippet.validate();

        const sql = `insert into collections 
                     (name, description, created_at)
                     values (?,?,now())
                    `;

        const values = [snippet.name, snippet.description];

        const info = dal.executeRun(sql, values);

        if (info.changes === 0) {
            throw new ClientError(StatusCode.InternalServerError, "Could be that the server isn's liking you at the moment");
        }
    }

    public getSnippetById(snippetId: number): SnippetModel {
        
        // validate the snippet id:
        if (!Number(snippetId) || snippetId < 1) {
            throw new ClientError(StatusCode.BadRequest, "The id you sended is wrong");
        }

        // sql and values:
        const sql = `select * from collections where id = ?`;
        const value = [snippetId];

        // get the snipped:
        const snippet = dal.executeGet(sql, value) as SnippetModel;
        return snippet;
        
    }

}

export const snippetService = new SnippetService();