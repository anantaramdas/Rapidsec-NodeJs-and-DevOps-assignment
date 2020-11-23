import {Client, IndexDocumentParams} from 'elasticsearch';

import {inject, injectable} from "inversify";

import ElasticsearchService from "./elasticsearch-service";
import {Indexes} from "../models/indexes";
import {RssFeed} from "../types/rss-feed";
import {RssLog} from "../types/rss-log";
import {TYPES} from "../types";

@injectable()
export default class Elasticsearch implements Elasticsearch {
    private service: ElasticsearchService;

    constructor(@inject(TYPES.ElasticsearchService) service: ElasticsearchService) {
        this.service = service;
    }

    /**
     * Prints to console health of ElasticsearchService server
     * @return void
     */
    public async getHealth(): Promise<string> {
        console.log("Checking Elasticsearchable instance health");

        let response = await this.service.getHealth();

        console.log("-- Client Health --", response);

        return response;
    }

    /**
     * Init index on ElasticsearchService if not exists by provided name
     * @param name string name of index to be create
     */
    public async createIndexIfNotExists(name: string) {
        console.log(`Creating "${name}" index on Elasticsearch instance if it does not exist`);

        await this.service.createIndexIfNotExists(name);
    }

    /**
     * Uploading feed and log data to Elasticsearchable
     * @param feed
     * @param log
     */
    public async uploadData(feed: RssFeed[], log: RssLog[]) {
        await this.uploadFeedData(feed);
        await this.uploadLogData(log);

    }

    /**
     * Uploading Feed data into Elasticsearchable
     * @param feed
     * @private
     */
    private async uploadFeedData(feed: RssFeed[]) {
        let item: RssFeed;
        for(item of feed) {
            await this.insertIntoIndex({
                index: Indexes.RSS_FEED,
                id: item.link,
                type: 'constituencies',
                body: item
            });
        }
    }

    /**
     * Uploading Log data into elasticsearch
     * @param log: RssLog[]
     * @private
     */
    private async uploadLogData(log: RssLog[]) {
        let item: RssLog;
        for(item of log) {
            await this.insertIntoIndex({
                index: Indexes.RSS_LOG,
                id: `${item.request_time}`,
                type: 'constituencies',
                body: item
            });
        }
    }

    /**
     * Insert data into Elasticsearchable index
     * @param o
     */
    async insertIntoIndex(o: IndexDocumentParams<any>): Promise<void> {
        return await this.service.insertIntoIndex(o);
    }

    /**
     * Check if index exists in Elasticsearchable by provided name
     * @param name
     */
    async indexExist(name: string): Promise<boolean> {
        return await this.service.indexExist(name)
    }
}