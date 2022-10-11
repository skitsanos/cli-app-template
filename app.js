#!/usr/bin/env node

/**
 * cli-app-template
 * @version 1.0
 * @author skitsanos
 */

const {program} = require('commander');
const winston = require('winston');
const Transport = require('winston-transport');
const fs = require('fs');

class FileTransport extends Transport
{
    constructor(opts)
    {
        super(opts);
    }

    log(info, callback)
    {
        fs.appendFile(process.cwd() + '/app.log', `${info.level} ${info.message}\n`, (err) =>
        {
            if (err)
            {
                console.log(err.message);
            }
        });
        callback();
    }
}

const loggingFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(info =>
    {
        return ` ${(new Date()).getTime()} ${info.level}: ${info.message}`;
    }));

const log = winston.createLogger({
    exitOnError: false,
    transports: [
        new FileTransport(
            {
                format: loggingFormat,
                timestamp: true
            }
        ),
        new winston.transports.Console({
            format: loggingFormat
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
        .option('-a, --app <application name>', 'application name', 'Unknown App')
        .option('-d, --debug', 'Enable Debug mode')
        .parse(process.argv);

        const {app: applicationName, debug} = program.opts();

        log.info(`Booting ${applicationName} ...`);

        if (debug)
        {
            log.warn(`[${applicationName}]DEBUG mode enabled`);
        }
    }
};

app.init();
