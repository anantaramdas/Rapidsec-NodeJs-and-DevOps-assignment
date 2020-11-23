import axios from 'axios';
import * as xml2js from 'xml2js';
import {inject, injectable} from "inversify";

import Source from '../../models/source';
import {RssFeed} from "../../types/rss-feed";
import Formattable from "../../models/formattable";
import {HackerNewsRssItem} from "../../types/hacker-news-rss-item";
import {TYPES} from "../../types";
import Logger from "../../models/logger";

@injectable()
export default class HackerNews extends Source implements Formattable {
  public readonly _fetchUrl: string;
  private readonly logger: Logger;

  constructor( @inject(TYPES.HackerNewsEndpointURL) url: string, @inject(TYPES.Logger) logger: Logger) {
    super()
    this._fetchUrl = url;
    this.logger = logger;
  }

  /**
   * Fetching items from HackerNews source
   * @return object containing RSS items
   */
  async fetchItems(): Promise<RssFeed[] | null> {
    try {
      this.logger.info(`...connecting to ${this._fetchUrl} to retrieve data`);
      let response =  await axios.get(this._fetchUrl);
      let parsedData = await xml2js.parseStringPromise(response.data);

      let items = parsedData.rss.channel[0].item as HackerNewsRssItem[];

      this.logger.info(`...reformatting received items`);
      return items.map(this.format);
    } catch (exception) {
      this.logger.error(`Receiving data from ${this._fetchUrl} failed: ${exception}`);
      return null;
    }
  }

  /**
   * Format hackerNewsRss item data to RssFeed class
   * @param o HackerNewsRssItem
   * @return RssFeed object
   */
  public format(o: HackerNewsRssItem): RssFeed {

    // Parsing data from object
    let creator: string = o["dc:creator"][0];
    let date = new Date(o.pubDate[0])
    let link: string = o.link[0];

    // Parsing HTML text for points and comments number from description field
    const description = o.description[0];

    let points: number = 0;
    const matchesPoints = description.match(/Points: (\d+)/);
    if(matchesPoints && matchesPoints.length >0) {
       points = +matchesPoints[1];
    }

    let comments: number = 0;
    const matchesComments = description.match(/Comments: (\d+)/);
    if(matchesComments && matchesComments.length >0) {
      points = +matchesComments[1]
    }

    return {
      title: o.title[0],
      timestamp: date,
      link: link,
      creator: creator,
      points: points,
      comments: comments,
    }
  }
}



