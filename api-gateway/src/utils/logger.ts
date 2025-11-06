/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const myFormat = printf(
  ({ level, message, label = 'General', timestamp }: any) => {
    const date = new Date(timestamp);
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const displayLabel = `[${label}] `;

    return `${date.toDateString()} ${hour}:${minutes}:${seconds} ${displayLabel}${level}: ${message}`;
  }
);

const createBaseLogger = (
  logLevel: string,
  logType: 'successes' | 'errors'
) => {
  return createLogger({
    level: logLevel,
    format: combine(timestamp(), myFormat),
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: path.join(
          process.cwd(),
          'logs',
          logType,
          `server-log-%DATE%-${
            logType === 'successes' ? 'successes' : 'errors'
          }.log`
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '50m',
        maxFiles: '100d',
      }),
    ],
  });
};

const logger = createBaseLogger('debug', 'successes');
const errorLogger = createBaseLogger('debug', 'errors');

export { logger, errorLogger };
