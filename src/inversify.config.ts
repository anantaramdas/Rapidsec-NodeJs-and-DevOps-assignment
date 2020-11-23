import "reflect-metadata";
import {Container} from "inversify";

import {TYPES} from "./types";
import HackerNews from "./resources/providers/hacker-news";
import ElasticsearchService from "./service/elasticsearch-service";
import Elasticsearch from "./service/elasticsearch";
import Repository from "./resources/repository";
import {App} from "./app";

require('dotenv').config();

let container = new Container();

container.bind<string>(TYPES.HackerNewsEndpointURL).toConstantValue(process.env.HACKER_NEWS_ENDPOINT_URL!);
container.bind<string>(TYPES.ElasticsearchConnectionString).toConstantValue(process.env.ELASTICSEARCH_CONNECTION_STR!);
container.bind<App>(TYPES.App).to(App).inSingletonScope();
container.bind<HackerNews>(TYPES.HackerNewsRssApiProvider).to(HackerNews).inSingletonScope();
container.bind<ElasticsearchService>(TYPES.ElasticsearchService).to(ElasticsearchService).inSingletonScope();
container.bind<Elasticsearch>(TYPES.Elasticsearch).to(Elasticsearch).inSingletonScope();
container.bind<Repository>(TYPES.Repository).to(Repository).inSingletonScope();

export default container;