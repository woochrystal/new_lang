/**
 * @fileoverview Pino 기반 Context 지원 로깅 시스템
 * @author Park ChangHyeon
 *
 * @example
 * import { LoggerFactory, LoggingContext } from '@/shared/lib/logger';
 *
 * // 1. 요청 처리의 시작점에서 컨텍스트 설정
 * LoggingContext.run({ requestId: 'uuid-1234' }, () => {
 *
 *   // 2. 로거 가져오기
 *   const logger = LoggerFactory.getLogger('UserService');
 *
 *   // 3. 로그 남기기 (requestId가 자동으로 포함됨)
 *   logger.info('사용자 정보를 조회합니다. userId={}', userId);
 * });
 */

import { AsyncLocalStorage } from 'async_hooks';

import pino from 'pino';

const isBrowser = typeof window !== 'undefined';

// --- LoggingContext --- //
let contextStorage;

if (!isBrowser) {
  contextStorage = new AsyncLocalStorage();
}

/**
 * 비동기 작업 흐름 전반에 걸쳐 컨텍스트 정보를 전파합니다.
 * 브라우저 환경에서는 no-op으로 동작합니다.
 */
export class LoggingContext {
  /**
   * 주어진 컨텍스트로 콜백 함수를 실행합니다.
   * 이 컨텍스트는 콜백 함수 및 그 내부에서 호출되는 모든 비동기 작업에 유지됩니다.
   * @param {object} context - 로그에 추가할 컨텍스트 객체 (예: { requestId, userId })
   * @param {() => any} callback - 실행할 함수
   */
  static run(context, callback) {
    if (isBrowser || !contextStorage) {
      return callback();
    }
    return contextStorage.run(new Map(Object.entries(context)), callback);
  }

  /**
   * 현재 컨텍스트에 키-값 쌍을 추가합니다.
   * @param {string} key
   * @param {any} value
   */
  static set(key, value) {
    if (isBrowser || !contextStorage) {
      return;
    }
    const store = contextStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }
}

// --- Logger Configuration --- //
const getLogLevel = () => {
  return process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug');
};

const rootLogger = pino({
  level: getLogLevel(),
  mixin() {
    if (!contextStorage) {
      return {};
    } // Return empty object in browser
    const store = contextStorage.getStore();
    return store ? Object.fromEntries(store) : {};
  },
  ...(isBrowser
    ? {
        browser: { asObject: true }
      }
    : {
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: process.platform !== 'win32',
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
                  ignore: 'pid,hostname',
                  sync: true
                }
              }
            : undefined,
        formatters:
          process.env.NODE_ENV === 'production'
            ? {
                level: (label) => ({ level: label }),
                log: (obj) => ({ ...obj, timestamp: new Date().toISOString() })
              }
            : undefined
      })
});

// --- Logger & LoggerFactory --- //

/**
 * 컨텍스트 기반의 로거 클래스.
 * LoggerFactory를 통해 인스턴스를 생성해야 합니다.
 */
export class Logger {
  constructor(name, pinoLogger) {
    this.name = name;
    this.logger = pinoLogger;
  }

  /**
   * 메시지 템플릿 포맷팅을 수행합니다. ex) 'Hello, {}', 'World' -> 'Hello, World'
   * @private
   */
  formatMessage(message, ...args) {
    if (typeof message !== 'string') {
      return message;
    }
    let i = 0;
    return message.replace(/{}/g, () => (i < args.length ? args[i++] : '{}'));
  }

  /**
   * 모든 로그 레벨의 실제 로직. 마지막 인자가 Error 객체이면 분리하여 처리합니다.
   * @private
   */
  log(level, message, ...args) {
    const lastArg = args[args.length - 1];
    if (lastArg instanceof Error) {
      const formatArgs = args.slice(0, -1);
      this.logger[level]({ err: lastArg }, this.formatMessage(message, ...formatArgs));
    } else {
      this.logger[level](this.formatMessage(message, ...args));
    }
  }

  /**
   * TRACE 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지 (예: '메서드 진입: {}')
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  trace(message, ...args) {
    this.log('trace', message, ...args);
  }

  /**
   * DEBUG 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  debug(message, ...args) {
    this.log('debug', message, ...args);
  }

  /**
   * INFO 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  info(message, ...args) {
    this.log('info', message, ...args);
  }

  /**
   * WARN 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  /**
   * ERROR 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  error(message, ...args) {
    this.log('error', message, ...args);
  }

  /**
   * FATAL 레벨 로그를 기록합니다.
   * @param {string} message - 로그 메시지
   * @param {...any} args - 메시지 템플릿에 삽입할 값, 마지막 인자로 Error 객체 전달 가능
   */
  fatal(message, ...args) {
    this.log('fatal', message, ...args);
  }

  isTraceEnabled() {
    return this.logger.isLevelEnabled('trace');
  }

  isDebugEnabled() {
    return this.logger.isLevelEnabled('debug');
  }

  isInfoEnabled() {
    return this.logger.isLevelEnabled('info');
  }

  isWarnEnabled() {
    return this.logger.isLevelEnabled('warn');
  }

  isErrorEnabled() {
    return this.logger.isLevelEnabled('error');
  }
}

/**
 * Logger 인스턴스를 생성하고 관리하는 팩토리 클래스.
 */
export class LoggerFactory {
  /** @private */
  static loggerCache = new Map();

  /**
   * 지정된 이름으로 Logger 인스턴스를 생성하거나 캐시된 인스턴스를 반환합니다.
   * @param {string | Function} nameOrClass - 로거 이름(string) 또는 클래스 생성자(Function)
   * @returns {Logger} 로거 인스턴스
   *
   * @example
   * // 문자열로 로거 가져오기
   * const logger = LoggerFactory.getLogger('MyService');
   *
   * // 클래스로 로거 가져오기 (클래스 이름이 로거 이름이 됨)
   * const logger = LoggerFactory.getLogger(UserService);
   */
  static getLogger(nameOrClass) {
    const name = typeof nameOrClass === 'string' ? nameOrClass : nameOrClass.name;
    if (!name) {
      throw new Error('Logger name must be provided as a string or a class.');
    }

    if (!this.loggerCache.has(name)) {
      const childLogger = rootLogger.child({ logger: name });
      this.loggerCache.set(name, new Logger(name, childLogger));
    }
    return this.loggerCache.get(name);
  }
}

export default LoggerFactory;
