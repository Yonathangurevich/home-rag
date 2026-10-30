import fs from "fs";
import { DatabaseSync, SQLInputValue } from "node:sqlite";
import path from "path";
import * as sqliteVec from "sqlite-vec";
import { appConfig } from "./app-config";

// Data Access Layer:
export class Dal {

    private db: DatabaseSync;

    private loadDb(dbPath: string): DatabaseSync {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        const db = new DatabaseSync(dbPath, { allowExtension: true });
        sqliteVec.load(db);
        db.exec("PRAGMA foreign_keys = ON");
        db.exec("PRAGMA journal_mode = WAL");
        db.exec(fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8"));
        return db;
    }

    public constructor(dbPath: string = appConfig.dbPath) {
        this.db = this.loadDb(dbPath);
    }

    public checkVecVersion(): string {
        const row = this.db.prepare("select vec_version() as v").get() as { v: string };
        return row.v;
    }

    // node:sqlite sends every JS number as REAL - sqlite-vec needs real integers (e.g. rowid):
    private toParams(values: SQLInputValue[]): SQLInputValue[] {
        return values.map(v => Number.isInteger(v) ? BigInt(v as number) : v);
    }

    // INSERT / UPDATE / DELETE - returns { changes, lastInsertRowid }:
    public executeRun(sql: string, values: SQLInputValue[] = []): any {
        const stmt = this.db.prepare(sql);
        return stmt.run(...this.toParams(values));
    }

    // SELECT one row - returns the row, or undefined if nothing was found:
    public executeGet(sql: string, values: SQLInputValue[] = []): any {
        const stmt = this.db.prepare(sql);
        return stmt.get(...this.toParams(values));
    }

    // SELECT many rows - returns an array (empty [] if nothing was found):
    public executeAll(sql: string, values: SQLInputValue[] = []): any[] {
        const stmt = this.db.prepare(sql);
        return stmt.all(...this.toParams(values));
    }

    public transaction<T>(fn: () => T): T {
        this.db.exec("BEGIN IMMEDIATE");
        try {
            const result = fn();
            this.db.exec("COMMIT");
            return result;
        }
        catch(err: any) {
            this.db.exec("ROLLBACK");
            throw err;
        }
    }

}

export const dal = new Dal();
