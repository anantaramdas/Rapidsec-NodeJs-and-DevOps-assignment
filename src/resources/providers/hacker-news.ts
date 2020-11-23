import axios from 'axios';
import * as xml2js from 'xml2js';
import {inject, injectable} from "inversify";

import Source from '../../models/source';
import {RssFeed} from "../../types/rss-feed";
import Formattable from "../../models/formattable";
import {HackerNewsRssItem} from "../../types/hacker-news-rss-item";
import {TYPES} from "../../types";

@injectable()
export default class HackerNews extends Source implements Formattable {
  private static instance: HackerNews;
  public readonly _fetchUrl: string;

  constructor( @inject(TYPES.HackerNewsEndpointURL) url: string) {
    super()
    this._fetchUrl = url;
  }

  /**
   * Fetching items from HackerNews source
   * @return object containing RSS items
   */
  async fetchItems(): Promise<RssFeed[] | null> {
    try {
      let response =  await axios.get(this._fetchUrl);
      let parsedData = await xml2js.parseStringPromise(response.data);

      let items = parsedData.rss.channel[0].item as HackerNewsRssItem[];

      return items.map(this.format);
    } catch (exception) {
      process.stderr.write(`ERROR received from ${this._fetchUrl}: ${exception}\n`);
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



