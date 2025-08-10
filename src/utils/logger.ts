export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
};

export class Logger {
  static level = LogLevel.INFO;
  
  static setLevel(level: LogLevel) {
    Logger.level = level;
  }
  
  static error(message: any, ...args: any) {
    if (Logger.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  static warn(message: any, ...args: any) {
    if (Logger.level >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  static info(message: any, ...args: any) {
    if (Logger.level >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  static debug(message: any, ...args: any) {
    if (Logger.level >= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}
