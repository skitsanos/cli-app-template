#!/usr/bin/env node

/**
 * cli-app-template
 * @version 1.0
 * @author skitsanos
 */

const program = require('commander');
const winston = require('winston');

const log = winston.createLogger({
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        //new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //new winston.transports.File({ filename: 'combined.log' })
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.printf(info =>
                {
                    return ` ${(new Date()).getTime()} ${info.level}: ${info.message}`;
                }))
        })
    ]
});

const app = {
    meta: require('./package'),

    init: () =>
    {
        log.info(`${app.meta.name} ver. ${app.meta.version}`);

        program
            .version(`${app.meta.version}`, '-v, --version')
            .usage('-name -path')
            .option('-a, --app <application name>', 'application name')
            .parse(process.argv);
    }
};


app.init();