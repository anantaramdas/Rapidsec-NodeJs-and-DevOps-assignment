import { RssFeed } from "./rss-feed";
import { RssLog } from "./rss-log";

export type RepositoryOutput = {
    items: RssFeed[],
    logs: RssLog[]
}