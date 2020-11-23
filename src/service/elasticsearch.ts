import {Client, IndexDocumentParams} from 'elasticsearch';

import {inject, injectable} from "inversify";

import ElasticsearchService from "./elasticsearch-service";
import {Indexes} from "../models/indexes";
import {RssFeed} from "../types/rss-feed";
import {RssLog} from "../types/rss-log";
import {TYPES} from "../types";
import Logger from "../models/logger";

@injectable()
export default class Elasticsearch implements Elasticsearch {
    private service: ElasticsearchService;
    private readonly logger: Logger;

    constructor(@inject(TYPES.ElasticsearchService) service: ElasticsearchService, @inject(TYPES.Logger) logger: Logger) {
        this.service = service;
        this.logger = logger;
    }

    /**
     * Prints to console health of ElasticsearchService server
     * @return void
     */
    public async getHealth(): Promise<string> {
        this.logger.info("Checking Elasticsearchable instance health");

        let response = await this.service.getHealth();

        this.logger.info("-- Client Health --");
        this.logger.info(response);

        return response;
    }

    /**
     * Init index on ElasticsearchService if not exists by provided name
     * @param name string name of index to be create
     */
    public async createIndexIfNotExists(name: string) {
        this.logger.info(`Creating "${name}" index on Elasticsearch instance if it does not exist`);

        await this.service.createIndexIfNotExists(name);
    }

    /**
     * Uploading feed and log data to Elasticsearchable
     * @param feed
     * @param log
     */
    public async uploadData(feed: RssFeed[], log: RssLog[]) {
        this.logger.info(`...Uploading data`);

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
            try {
                await this.insertIntoIndex({
                    index: Indexes.RSS_FEED,
                    id: item.link,
                    type: 'constituencies',
                    body: item
                });
            } catch (exception) {
                this.logger.error(`Uploading to ${Indexes.RSS_FEED} failed: ${exception}`);
            }
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
            try {
                await this.insertIntoIndex({
                    index: Indexes.RSS_LOG,
                    id: `${item.request_time}`,
                    type: 'constituencies',
                    body: item
                });
            } catch (exception) {
                this.logger.error(`Uploading to ${Indexes.RSS_LOG} failed: ${exception}`);
            }
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