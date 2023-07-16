import winston from 'winston';

// Create a logger instance
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, functionName }) => {
            return `${timestamp} [${functionName}]: ${level} - ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console()
    ],
});

