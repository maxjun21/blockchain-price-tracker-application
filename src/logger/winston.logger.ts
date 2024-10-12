// src/winston.logger.ts

import config from '../config/configuration';
import { createLogger, format, transports, Logger } from 'winston';
import { Logger as TypeORMLogger } from 'typeorm';
const DirConfig = config().log;

// Define the log format for console output
const logFormat = format.printf(
  (info) => `${info.timestamp} : ${info.message}`,
);

const options = {
  file: {
    level: 'info',
    filename: `${DirConfig.dir}/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(format.timestamp(), format.colorize(), logFormat),
  },
};

// Create the Winston logger instance
export const logger: Logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

// Custom TypeORM Logger Implementation
export class WinstonTypeORMLogger implements TypeORMLogger {
  logQuery(query: string, parameters?: any[]) {
    logger.debug(`Query: ${query} Parameters: ${JSON.stringify(parameters)}`);
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    logger.error(
      `Query failed: ${query} Parameters: ${JSON.stringify(parameters)} Error: ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    logger.warn(
      `Slow Query: ${query} Parameters: ${JSON.stringify(parameters)} Time: ${time}ms`,
    );
  }

  logSchemaBuild(message: string) {
    logger.info(`Schema Build: ${message}`);
  }

  logMigration(message: string) {
    logger.info(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    logger[level](message);
  }
}
