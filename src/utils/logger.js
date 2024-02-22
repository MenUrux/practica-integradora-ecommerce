import winston from 'winston';
import config from '../config/config.js'


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }

}


export const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple(),

            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: "error",
            format: winston.format.simple()
        }),

    ]

});

export const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple(),
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss' // Este es el formato de la fecha y hora
                }),
            )
        })
    ]
});


export const loggerConfig = config.env === 'production' ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
    req.logger = loggerConfig;
    next();
}

export function generateLoggerMessage(req) {
    return `${new Date().toLocaleTimeString()} - ${req.method} - route: ${req.url}`;
}