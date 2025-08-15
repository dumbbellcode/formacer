/* eslint-disable @typescript-eslint/no-explicit-any */
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

  private static processArgs(args: any[]): any[] {
    return args.map((arg: any) => typeof arg === 'object' ? JSON.stringify(arg) : arg);
  }
  
  static error(message: string, ...args: any) {
    if (Logger.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...Logger.processArgs(args));
    }
  }
  
  static warn(message: string, ...args: any) {
    if (Logger.level >= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...Logger.processArgs(args));
    }
  }
  
  static info(message: string, ...args: any) {
    if (Logger.level >= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...Logger.processArgs(args));
    }
  }
  
  static debug(message: string, ...args: any) {
    if (Logger.level >= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, ...Logger.processArgs(args));
    }
  }
}

if (isDevelopmentEnv()) {
  Logger.setLevel(LogLevel.INFO)
} else {
  Logger.setLevel(LogLevel.DEBUG)
}
