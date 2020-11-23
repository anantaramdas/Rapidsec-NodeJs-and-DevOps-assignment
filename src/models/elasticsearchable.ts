import {IndexDocumentParams} from "elasticsearch";

export default interface Elasticsearchable {
    /**
     * Prints to console health of ElasticsearchService server
     * @return void
     */
    getHealth(): Promise<string>;

    /**
     * Init index on ElasticsearchService if not exists by provided name
     * @param name string name of index to be create
     */
    createIndexIfNotExists(name: string): Promise<void>;

    /**
     * Insert data into Elasticsearchable index
     * @param o
     */
    insertIntoIndex(o: IndexDocumentParams<any>): Promise<void>;

    /**
     * Check if index exists in Elasticsearchable by provided name
     * @param name
     */
    indexExist(name: string): Promise<boolean>;
}