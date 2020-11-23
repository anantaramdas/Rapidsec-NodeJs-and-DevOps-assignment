import winston from "winston";
import path from "path";
import {injectable} from "inversify";

@injectable()
class Logger {
    private logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
        ),
        defaultMeta: {service: 'rss-parser'},
        transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.Console(),
            new winston.transports.File({filename: path.join('logs', 'error.log'), level: 'error'}),
            new winston.transports.File({filename: path.join('logs', 'combined.log')}),
        ]
    });

    public info(message: string) {
        this.logger.log('info', message);
    }
    public warning(message: string) {
        this.logger.log('warning', message);
    }
    public error(message: string) {
        this.logger.log('error', message);
    }
}

export default Logger;