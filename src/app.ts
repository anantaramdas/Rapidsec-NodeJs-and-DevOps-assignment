import axios from 'axios';
import axiosRetry from 'axios-retry';
import {injectable} from "inversify";
import "reflect-metadata";

import {TYPES} from "./types";
import {RepositoryOutput} from "./types/repository-output";
import Repository from './resources/repository';
import container from "./inversify.config";

import Elasticsearch from "./service/elasticsearch";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

require('dotenv').config();

@injectable()
export class App {
    async runApp() {
        try {
            console.log('Starting Rss feed processing...');
            let repository = container.get<Repository>(TYPES.Repository);
            let result: RepositoryOutput = await repository.fetchItems();

            let elasticsearch: Elasticsearch = container.get<Elasticsearch>(TYPES.Elasticsearch);
            if(process.env.NODE_ENV === 'development') await elasticsearch.getHealth();
            //
            await elasticsearch.uploadData(result.items, result.logs);
            console.log('Rss feed processing finished.');
        } catch (e) {
            console.log(`Error occurred: ${e}`);
        }
    }
}

let app = new App()
app.runApp()
