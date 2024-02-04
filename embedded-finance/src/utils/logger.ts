type LogLevel = "debug" | "info" | "warn" | "error";
const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Determine the current log level from the environment variable or default to "info"
const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

// Check if a message at the given level should be logged
const shouldLog = (level: LogLevel): boolean => {
  return logLevels[level] >= logLevels[currentLogLevel];
};

const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog("debug")) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog("error")) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
};

export default logger;
