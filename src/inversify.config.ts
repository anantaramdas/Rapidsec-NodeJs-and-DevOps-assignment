import "reflect-metadata";
import {Container} from "inversify";

import {TYPES} from "./types";
import HackerNews from "./resources/providers/hacker-news";
import ElasticsearchService from "./service/elasticsearch-service";
import Elasticsearch from "./service/elasticsearch";
import Repository from "./resources/repository";
import Logger from "./models/logger";

require('dotenv').config();

let container = new Container();

container.bind<string>(TYPES.HackerNewsEndpointURL).toConstantValue(process.env.HACKER_NEWS_ENDPOINT_URL ? process.env.HACKER_NEWS_ENDPOINT_URL : "https://hnrss.org/newest?points=10");
container.bind<string>(TYPES.ElasticsearchConnectionString).toConstantValue(process.env.ELASTICSEARCH_CONNECTION_STR ? process.env.ELASTICSEARCH_CONNECTION_STR : "http://elastic:changeme@elasticsearch:9200/");
container.bind<HackerNews>(TYPES.HackerNewsRssApiProvider).to(HackerNews).inSingletonScope();
container.bind<ElasticsearchService>(TYPES.ElasticsearchService).to(ElasticsearchService).inSingletonScope();
container.bind<Elasticsearch>(TYPES.Elasticsearch).to(Elasticsearch).inSingletonScope();
container.bind<Repository>(TYPES.Repository).to(Repository).inSingletonScope();
container.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();

export default container;