import { EntriesModel } from "../models/entries-model";
import { dal } from "../utils/dal";

class EntriesService {

    public getEntries(): EntriesModel[] {
        
        // sql query:
        const sql = `select * from entries`;
        
        // get all the entries:
        const entries = dal.executeAll(sql) as EntriesModel[];
        return entries;
    }

    public getEntriesById(entryId: string): EntriesModel {
        
        // sql query and value:
        const sql = `select * from entries where id = ?`;
        const value = [entryId];
        
        // get all the entries:
        const entries = dal.executeGet(sql, value) as EntriesModel;
        return entries;
    }

}

export const entriesService = new EntriesService();