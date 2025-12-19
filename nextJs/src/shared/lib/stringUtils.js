/*
 * path           : src/shared/lib/stringUtils.js
 * fileName       : stringUtils
 * author         : changhyeon
 * date           : 25. 10. 22.
 * description    : 문자열 변환 및 검증 유틸리티 (stringify, formatTemplate, isEmpty 등)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 10. 22.       changhyeon       최초 생성
 * 25. 10. 24.       changhyeon       stringify, formatTemplate 함수 추가
 * 25. 11. 11.       changhyeon       stringify catch 블록 미사용 변수 정리, 파일 헤더 추가
 */

import { isBrowser, isProduction } from './envUtils';

// MARK : 문자열 변환

/**
 * 다양한 타입의 값을 문자열로 변환합니다.
 * @param {any} value - 변환할 값
 * @param {Object} options - 변환 옵션
 * @param {boolean} options.includeStack - Error 객체에서 스택 트레이스 포함 여부 (기본: false)
 * @param {boolean} options.isBrowser - 브라우저 환경 여부 (기본: typeof window !== 'undefined')
 * @returns {string} 변환된 문자열
 */
export const stringify = function (value, options = {}) {
  const { includeStack = false, isBrowser: optionIsBrowser = isBrowser() } = options;

  // null, undefined 처리
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }

  // Error 객체 처리
  if (value instanceof Error) {
    return _stringifyError(value, includeStack, optionIsBrowser);
  }

  // 기본 타입 처리
  if (typeof value !== 'object') {
    return String(value);
  }

  // 객체 처리
  return _stringifyObject(value);
};

const _stringifyError = (value, includeStack, isBrowserEnv) => {
  // 브라우저에서는 기본적으로 스택 제외, 서버에서는 포함
  const shouldIncludeStack = includeStack && !isBrowserEnv;
  return shouldIncludeStack ? `${value.message}${value.stack ? `\n${value.stack}` : ''}` : value.message;
};

const _stringifyObject = (value) => {
  try {
    const stringified = JSON.stringify(value);

    // 빈 객체인 경우 생성자 이름 제공
    if (stringified === '{}' && value.constructor && value.constructor.name !== 'Object') {
      return `[${value.constructor.name}]`;
    }

    return stringified;
  } catch {
    // JSON 직렬화 실패 시 타입 정보 반환
    return value.constructor ? `[${value.constructor.name}]` : '[Object]';
  }
};

/**
 * 템플릿 문자열에서 {} 플레이스홀더를 순차적으로 값들로 교체합니다.
 * @param {string} template - 템플릿 문자열 (예: "Hello, {}!")
 * @param {Object} options - 변환 옵션
 * @param {...any} values - 교체할 값들
 * @returns {string} 포맷팅된 문자열
 *
 * @example
 * formatTemplate('User {} has {} points', 'john', 100);
 * // → "User john has 100 points"
 *
 * formatTemplate('Error: {}', new Error('Connection failed'));
 * // → "Error: Connection failed"
 */
export const formatTemplate = function (template, options, ...values) {
  if (typeof template !== 'string') {
    return stringify(template, options);
  }

  let valueIndex = 0;
  return template.replace(/{}/g, () => {
    if (valueIndex < values.length) {
      const value = values[valueIndex++];
      return stringify(value, options);
    }
    return '{}';
  });
};

/**
 * 프로덕션에서는 민감한 정보를 숨기고 간단한 메시지만 반환합니다.
 * @param {any} value - 변환할 값
 * @param {string} fallbackMessage - 프로덕션에서 사용할 대체 메시지
 * @returns {string} 환경에 맞는 문자열
 * @example
 * stringifySecure(new Error('Database connection failed')); // 개발: 전체 에러, 프로덕션: 'Error occurred'
 */
export const stringifySecure = function (value, fallbackMessage = 'Error occurred') {
  if (isProduction() && value instanceof Error) {
    // 프로덕션에서는 Error 객체의 상세 정보 숨김
    return fallbackMessage;
  }

  return stringify(value, {
    includeStack: !isProduction()
  });
};

/**
 * 객체의 특정 속성들을 문자열로 변환합니다.
 * @param {Object} obj - 대상 객체
 * @param {string[]} keys - 추출할 키들
 * @returns {string} 추출된 속성들의 문자열 표현
 */
export const stringifyPick = function (obj, keys) {
  if (!obj || typeof obj !== 'object') {
    return stringify(obj);
  }

  const picked = {};
  keys.forEach((key) => {
    if (key in obj) {
      picked[key] = obj[key];
    }
  });

  return stringify(picked);
};

// MARK : 문자열 조작

/**
 * 문자열을 kebab-case로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} kebab-case 문자열
 * @example
 * toKebabCase('userName') // → 'user-name'
 * toKebabCase('UserProfile') // → 'user-profile'
 */
export const toKebabCase = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * 문자열을 camelCase로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} camelCase 문자열
 * @example
 * toCamelCase('user-name') // → 'userName'
 * toCamelCase('user_profile') // → 'userProfile'
 */
export const toCamelCase = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * 문자열을 PascalCase로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} PascalCase 문자열
 * @example
 * toPascalCase('user-name') // → 'UserName'
 * toPascalCase('user_profile') // → 'UserProfile'
 */
export const toPascalCase = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
};

/**
 * 문자열을 snake_case로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} snake_case 문자열
 * @example
 * toSnakeCase('userName') // → 'user_name'
 * toSnakeCase('UserProfile') // → 'user_profile'
 */
export const toSnakeCase = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
};

// MARK :문자열 검증

/**
 * 문자열이 비어있는지 확인합니다. (null, undefined, 빈 문자열, 공백만 있는 문자열)
 * @param {any} str - 확인할 값
 * @returns {boolean} 비어있으면 true
 * @example
 * isEmpty('') // → true
 * isEmpty('  ') // → true
 * isEmpty(null) // → true
 * isEmpty('hello') // → false
 */
export const isEmpty = function (str) {
  return str == null || (typeof str === 'string' && str.trim() === '');
};

/**
 * 문자열이 비어있지 않은지 확인합니다.
 * @param {any} str - 확인할 값
 * @returns {boolean} 비어있지 않으면 true
 */
export const isNotEmpty = function (str) {
  return !isEmpty(str);
};

/**
 * 이메일 형식인지 확인합니다.
 * @param {string} email - 확인할 이메일 문자열
 * @returns {boolean} 유효한 이메일 형식이면 true
 * @example
 * isValidEmail('user@example.com') // → true
 * isValidEmail('invalid-email') // → false
 */
export const isValidEmail = function (email) {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 숫자로만 이루어진 문자열인지 확인합니다.
 * @param {string} str - 확인할 문자열
 * @returns {boolean} 숫자로만 이루어져 있으면 true
 * @example
 * isNumeric('123') // → true
 * isNumeric('12.34') // → true
 * isNumeric('abc') // → false
 */
export const isNumeric = function (str) {
  if (typeof str !== 'string') {
    return false;
  }
  return /^-?\d*\.?\d+$/.test(str) && !isNaN(parseFloat(str));
};

// MARK : 문자열 포맷팅

/**
 * 문자열을 지정된 길이로 자르고 생략 표시를 추가합니다.
 * @param {string} str - 자를 문자열
 * @param {number} length - 최대 길이
 * @param {string} suffix - 생략 표시 (기본: '...')
 * @returns {string} 잘린 문자열
 * @example
 * truncate('Hello World', 5) // → 'Hello...'
 * truncate('Hello World', 5, '···') // → 'Hello···'
 */
export const truncate = function (str, length, suffix = '...') {
  if (typeof str !== 'string') {
    return '';
  }
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + suffix;
};

/**
 * 문자열의 첫 글자를 대문자로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} 첫 글자가 대문자인 문자열
 * @example
 * capitalize('hello world') // → 'Hello world'
 */
export const capitalize = function (str) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 각 단어의 첫 글자를 대문자로 변환합니다.
 * @param {string} str - 변환할 문자열
 * @returns {string} 각 단어의 첫 글자가 대문자인 문자열
 * @example
 * titleCase('hello world') // → 'Hello World'
 */
export const titleCase = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * 숫자를 천단위 콤마가 있는 문자열로 변환합니다.
 * @param {number|string} num - 변환할 숫자
 * @returns {string} 콤마가 포함된 문자열
 * @example
 * addCommas(1234567) // → '1,234,567'
 * addCommas('1234567') // → '1,234,567'
 */
export const addCommas = function (num) {
  if (num == null) {
    return '';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 문자열에서 HTML 태그를 제거합니다.
 * @param {string} str - HTML이 포함된 문자열
 * @returns {string} HTML 태그가 제거된 문자열
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>') // → 'Hello World'
 */
export const stripHtml = function (str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/<[^>]*>/g, '');
};

/**
 * 문자열의 앞뒤 공백 및 지정된 문자들을 제거합니다.
 * @param {string} str - 정리할 문자열
 * @param {string} chars - 제거할 문자들 (기본: 공백 문자들)
 * @returns {string} 정리된 문자열
 * @example
 * trim('  hello  ') // → 'hello'
 * trim('--hello--', '-') // → 'hello'
 */
export const trim = function (str, chars) {
  if (typeof str !== 'string') {
    return '';
  }
  if (!chars) {
    return str.trim();
  }

  const pattern = new RegExp(
    `^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+|[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`,
    'g'
  );
  return str.replace(pattern, '');
};

/**
 * 문자열을 간단한 해시값으로 변환합니다 (djb2 알고리즘)
 * @param {string} str - 해시할 문자열
 * @returns {string} 해시값 (36진수 문자열)
 * @example
 * simpleHash('error-message') // → 'abc123xyz'
 * simpleHash('error-message') // → 'abc123xyz' (동일)
 * simpleHash('other-message') // → 'def456uvw' (다름)
 */
export const simpleHash = function (str) {
  if (typeof str !== 'string') {
    str = String(str);
  }

  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return (hash >>> 0).toString(36);
};
