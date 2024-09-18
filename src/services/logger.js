import winston from "winston"

import config from "../config.js"

const customLevelOptions = {
    levels : {fatal : 0, error : 1, warning: 2, info : 3, http: 4, debug : 5}
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({level: "debug"})
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({level: "info"}),
        new winston.transports.File({level: "info", filename: `${config.DIRNAME}/logs/error.log` })
    ]
})

const addLogger = (req, res, next) => {
    // req.logger = devLogger
    req.logger = config.MODE === "dev"? devLogger : prodLogger
    // req.logger.warning(`${new Date().toDateString()} ${req.method} ${req.url}`)
    next()
}

export default addLogger