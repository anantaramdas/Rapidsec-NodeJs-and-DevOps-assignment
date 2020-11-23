import container from "../inversify.config";
import {injectable} from "inversify";

import HackerNews from "./providers/hacker-news";
import Source from "../models/source";
import {RssFeed} from "../types/rss-feed";
import {RssLog} from "../types/rss-log";
import {RepositoryOutput} from "../types/repository-output";
import {TYPES} from "../types";
import {Statuses} from "../models/statuses";

@injectable()
export default class Repository {
    private _sources: Source[] = [
        container.get<HackerNews>(TYPES.HackerNewsRssApiProvider),
    ];

    /**
     * Fetching items from all source repositories which are available one by one
     * @return object containing both RSS items and generated logs to process further
     */
    async fetchItems(): Promise<RepositoryOutput> {

        let source: Source;
        let resultItems: RssFeed[] = [];
        let resultLogs: RssLog[] = [];

        for (source of this._sources) {
            // Getting current date
            let reqTime = Date.now();

            // Fetching results
            let repositoryResult = await source.fetchItems();

            if( repositoryResult ) {
                resultItems = [...resultItems, ...repositoryResult];
                resultLogs = [...resultLogs, {
                    url: source._fetchUrl,
                    request_time: reqTime,
                    amount_returned: repositoryResult.length,
                    status: Statuses.SUCCESS
                } as RssLog]
            } else {
                resultLogs = [...resultLogs, {
                    url: source._fetchUrl,
                    request_time: reqTime,
                    amount_returned: 0,
                    status: Statuses.FAILURE
                } as RssLog]
            }
        }

        return {items: resultItems, logs: resultLogs};
    }
}
