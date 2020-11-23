import axios from 'axios';
import axiosRetry from 'axios-retry';
import {injectable} from "inversify";
import "reflect-metadata";

import {TYPES} from "./types";
import {RepositoryOutput} from "./types/repository-output";
import Repository from './resources/repository';
import container from "./inversify.config";

import Elasticsearch from "./service/elasticsearch";
import Logger from "./models/logger";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

require('dotenv').config();

@injectable()
export class App {
    async runApp() {
        let logger = container.get<Logger>(TYPES.Logger);

        try {
            logger.info('Starting Rss feed processing...')

            let repository = container.get<Repository>(TYPES.Repository);
            let result: RepositoryOutput = await repository.fetchItems();

            let elasticsearch: Elasticsearch = container.get<Elasticsearch>(TYPES.Elasticsearch);
            if(process.env.NODE_ENV === 'development') await elasticsearch.getHealth();

            await elasticsearch.uploadData(result.items, result.logs);

            logger.info('Rss feed processing finished.')
        } catch (e) {
            logger.error(`Error occurred: ${e}`)
        }
    }
}

let app = new App()
app.runApp()
