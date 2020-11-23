# Rapidsec-NodeJs-and-DevOps-assignment

## Assignment

In this assignment, you need to create a rss processor and deploy it.

### Specifications:
- Use Nodejs
- Query hackernews each 5 minutes on https://hnrss.org/newest?points=10 endpoint and send transformed results to elasticsearch server
- Code should be ready to add another rss endpoint with specifics for that endpoint formatter of its data to the structure stored in elasticsearch by using adapter pattern 
- Data sent to elastic should use batch API in index “rss_feed”
- Requests logs should be sent to “rss_logs” via post API
- ElasticsearchService api should be extracted into service and use proxy pattern

### The application needs to:
1. Be running in cron `*/5 * * * *` with a fetch backoff strategy of (400ms, 1s, 2s) per each rss endpoints separate.
2. Use prettier and eslint.
3. Have helpful and sane logging.

### This assignment evaluates the following:
1. You can set up a good environment and the correct data flow.
2. A good structure. 
3. Clean understandable code.
4. Use GitHub and break the progress into several commits.
5. Don’t reinvent the wheel - Use good libraries where it makes sense.

### Tasks that need to be implemented:
1. Queries rss endpoint and data is converted into correct structure
    - Data is queried from each endpoint one by one
    - Each endpoint has assigned formatter
    - Rss structure should be like this for any incoming rss feed(formatters should have default values)
        ```javascript       
        type RSS_FEED = {
            title: string,
            timestamp: Date,
            link: string,
            creator: string,
            points: number,
            comments: number
        }
        ```
2. Requests logs are gathered and converted into correct structure
    - Each rss request gathers meta information
    - This information is gathered and transformed into
        ```javascript       
        type RSS_LOGS = {
            url: string, 
            request_time: number,  
            amount_returned: number,
            status: "success" | "failure"
        }
        ```

3. Elastic is configured to accept logs into 2 indexes with non-dynamic mappings
    - Mapping docs https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
4. Rss feeds and rss logs are sent into related indexes
5. Create dashboard with data charts
    - Line chart of amount of post in last 12h per 5 minutes
    - Heat map between points and comments
6. Deploy app to fly.io / heroku / other hosting...
7. Bonus (Optional)
    - Use typescript to make sure everything has a bit of documentation
    - Add visualization (in Kibana or custom UI)  of which shared articles domain are most popular(medium etc), required additional fields

## Setup
1. Make sure you have NodeJS and Docker installed on your machine
2. Run `npm install` in checkout directory
3. **OPTIONAL:** setup `.env` file using provided example
4. Build TypeScript code using `npm run build`
5. Build docker containers by running `docker-compose build`
6. Start docker containers by running `docker-compose up`
7. Enjoy :)