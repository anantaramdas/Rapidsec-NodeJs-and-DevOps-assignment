import {RssFeed} from "../types/rss-feed";

export default interface Formattable {
    format(o: object): RssFeed;
}