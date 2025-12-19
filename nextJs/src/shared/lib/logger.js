/*
 * path           : src/shared/lib/logger.js
 * fileName       : logger
 * author         : changhyeon
 * date           : 24. 10. 15.
 * description    : Context 기반 비동기 추적 로깅 시스템 (Pino SSR/CSR 지원)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 24. 10. 15.       changhyeon       최초 생성
 * 25. 10. 22.       changhyeon       브라우저 환경 로거 개선
 * 25. 10. 24.       changhyeon       async_hooks 예외 처리 추가
 * 25. 11. 11.       changhyeon       파일 헤더 추가
 */

import pino from 'pino';

const isBrowser = typeof window !== 'undefined';

// --- LoggingContext --- //
let AsyncLocalStorage;
let contextStorage;

if (!isBrowser) {
  try {
    const { AsyncLocalStorage: AsyncLocalStorageImport } = require('async_hooks');
    AsyncLocalStorage = AsyncLocalStorageImport;
    contextStorage = new AsyncLocalStorage();
  } catch {
    // async_hooks를 사용할 수 없는 환경
    contextStorage = null;
  }
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

// 브라우저용 간단한 로거
/* eslint-disable no-console */
const createBrowserLogger = () => ({
  trace: (msg) => console.debug(`[TRACE] ${msg}`),
  debug: (msg) => console.debug(`[DEBUG] ${msg}`),
  info: (msg) => console.info(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  fatal: (msg) => console.error(`[FATAL] ${msg}`),
  child: () => createBrowserLogger(),
  isLevelEnabled: () => true
});
/* eslint-enable no-console */

// 서버용 pino 로거
const createServerLogger = () =>
  pino({
    level: getLogLevel(),
    mixin() {
      if (!contextStorage) {
        return {};
      }
      const store = contextStorage.getStore();
      return store && store.size > 0 ? Object.fromEntries(store) : {};
    },
    ...(process.env.NODE_ENV === 'development'
      ? {
          prettyPrint: false // pino-pretty 대신 기본 출력
        }
      : {
          formatters: {
            level: (label) => ({ level: label }),
            log: (obj) => ({ ...obj, timestamp: new Date().toISOString() })
          }
        })
  });

// 환경별 로거 선택
const rootLogger = isBrowser ? createBrowserLogger() : createServerLogger();

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

    if (isBrowser) {
      // 브라우저: 간단한 문자열 로깅
      const formattedMessage = this.formatMessage(message, ...args.filter((arg) => !(arg instanceof Error)));
      if (lastArg instanceof Error) {
        this.logger[level](`${formattedMessage} | Error: ${lastArg.message}`);
      } else {
        this.logger[level](formattedMessage);
      }
    } else {
      // 서버: pino 방식 로깅
      if (lastArg instanceof Error) {
        const formatArgs = args.slice(0, -1);
        this.logger[level]({ err: lastArg }, this.formatMessage(message, ...formatArgs));
      } else {
        this.logger[level](this.formatMessage(message, ...args));
      }
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
