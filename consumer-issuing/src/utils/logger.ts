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

// ANSI escape codes for colors and styles
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m", // Makes text bold/bright
  dim: "\x1b[2m",

  // Foreground (text) colors
  fg: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    // Add more colors as needed
  },
};

const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog("debug")) {
      // eslint-disable-next-line no-console
      console.debug(colors.bright, colors.fg.blue, ...args, colors.reset);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) {
      // eslint-disable-next-line no-console
      console.info(colors.fg.green, ...args, colors.reset);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) {
      // eslint-disable-next-line no-console
      console.warn(colors.fg.yellow, ...args, colors.reset);
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog("error")) {
      // eslint-disable-next-line no-console
      console.error(colors.fg.red, ...args, colors.reset);
    }
  },
};

export default logger;
