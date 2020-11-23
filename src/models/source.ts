import {injectable} from "inversify";

import {RssFeed} from "../types/rss-feed";

@injectable()
export default abstract class Source {
    abstract fetchItems(): Promise<RssFeed[] | null>;
    public readonly _fetchUrl: string | undefined;
}