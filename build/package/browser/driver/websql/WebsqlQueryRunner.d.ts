import { Table } from "../../schema-builder/schema/Table";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import { WebsqlDriver } from "./WebsqlDriver";
/**
 * Runs queries on a single websql database connection.
 */
export declare class WebsqlQueryRunner extends AbstractSqliteQueryRunner {
    /**
     * Real database connection from a connection pool used to perform queries.
     */
    protected databaseConnection: any;
    /**
     * Promise used to obtain a database connection for a first time.
     */
    protected databaseConnectionPromise: Promise<any>;
    /**
     * Database driver used by connection.
     */
    driver: WebsqlDriver;
    constructor(driver: WebsqlDriver);
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Starts transaction.
     */
    startTransaction(): Promise<void>;
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Insert a new row with given values into the given table.
     * Returns value of the generated column if given and generate column exist in the table.
     // todo: check if it works
    async insert(tableName: string, keyValues: ObjectLiteral): Promise<InsertResult> {
        const keys = Object.keys(keyValues);
        const columns = keys.map(key => `"${key}"`).join(", ");
        const values = keys.map((key, index) => "$" + (index + 1)).join(",");
        const generatedColumns = this.connection.hasMetadata(tableName) ? this.connection.getMetadata(tableName).generatedColumns : [];
        const sql = columns.length > 0 ? (`INSERT INTO "${tableName}"(${columns}) VALUES (${values})`) : `INSERT INTO "${tableName}" DEFAULT VALUES`;
        const parameters = keys.map(key => keyValues[key]);

        return new Promise<InsertResult>(async (ok, fail) => {
            this.driver.connection.logger.logQuery(sql, parameters, this);

            const db = await this.connect();
            // todo: check if transaction is not active
            db.transaction((tx: any) => {
                tx.executeSql(sql, parameters, (tx: any, result: any) => {
                    const generatedMap = generatedColumns.reduce((map, generatedColumn) => {
                        const value = generatedColumn.isPrimary && generatedColumn.generationStrategy === "increment" && result["insertId"] ? result["insertId"] : keyValues[generatedColumn.databaseName];
                        if (!value) return map;
                        return OrmUtils.mergeDeep(map, generatedColumn.createValueMap(value));
                    }, {} as ObjectLiteral);

                    ok({
                        result: undefined,
                        generatedMap: Object.keys(generatedMap).length > 0 ? generatedMap : undefined
                    });

                }, (tx: any, err: any) => {
                    this.driver.connection.logger.logQueryError(err, sql, parameters, this);
                    return fail(err);
                });
            });
        });
    }*/
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    getTables(tableNames: string[]): Promise<Table[]>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(): Promise<void>;
}
