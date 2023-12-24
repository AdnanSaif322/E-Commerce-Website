const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
  transports: [
    new transports.File({
        filename: 'src/logs/info.log',
        level: 'info',
        maxsize: 20971520, // 10MB,
        maxFiles: 5
    })
  ],
  transports:[
    new transports.File({
        filename: 'src/logs/error.log',
        level: 'error',
        maxsize: 20971520, // 20MB,
        maxFiles: 5
    })
  ]
});

module.exports = logger;
