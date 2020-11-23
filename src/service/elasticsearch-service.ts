import {Client, IndexDocumentParams} from 'elasticsearch';

import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import Elasticsearchable from "../models/elasticsearchable";

@injectable()
export default class ElasticsearchService implements Elasticsearchable {
    private client: Client;
    private readonly _connectUrl: string;

    constructor(@inject(TYPES.ElasticsearchConnectionString) url: string) {
        this._connectUrl = url;

        this.client = new Client({
            hosts: [
                this._connectUrl,
            ]
        });
    }

    /**
     * Prints to console health of ElasticsearchService server
     * @return void
     */
    public async getHealth(): Promise<string> {
        return await this.client.cluster.health({});
    }

    /**
     * Init index on ElasticsearchService if not exists by provided name
     * @param name string name of index to be create
     */
    public async createIndexIfNotExists(name: string) {
        let exist = this.indexExist(name);

        if(!exist) {
            await this.client.indices.create({
                index: name
            });
        }
    }

    /**
     * Insert data into Elasticsearchable index
     * @param o
     */
    async insertIntoIndex(o: IndexDocumentParams<any>): Promise<void> {
        return await this.client.index(o);
    }

    /**
     * Check if index exists in Elasticsearchable by provided name
     * @param name
     */
    async indexExist(name: string): Promise<boolean> {
        return await this.client.indices.exists({index: name});
    }
}