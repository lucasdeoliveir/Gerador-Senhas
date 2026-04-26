/**
 * @fileoverview Módulo de lógica de geração de senhas seguras.
 *
 * Implementa geração criptograficamente segura usando Web Crypto API,
 * com suporte a diferentes conjuntos de caracteres e avaliação de força.
 *
 * @module password-generator
 * @version 1.0.0
 */

'use strict';

// ── Conjuntos de caracteres ────────────────────────────────────────────────

/** Caracteres maiúsculos do alfabeto latino. */
const CHARSET_UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Caracteres minúsculos do alfabeto latino. */
const CHARSET_LOWER   = 'abcdefghijklmnopqrstuvwxyz';

/** Dígitos decimais. */
const CHARSET_NUMBERS = '0123456789';

/** Símbolos e pontuação comuns. */
const CHARSET_SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

// ── Tipos de configuração ──────────────────────────────────────────────────

/**
 * @typedef {Object} PasswordConfig
 * @property {number}  length      - Comprimento desejado (6–64).
 * @property {boolean} useUpper    - Incluir letras maiúsculas.
 * @property {boolean} useLower    - Incluir letras minúsculas.
 * @property {boolean} useNumbers  - Incluir dígitos numéricos.
 * @property {boolean} useSymbols  - Incluir símbolos especiais.
 */

/**
 * @typedef {'fraca'|'razoável'|'boa'|'forte'|'muito forte'} StrengthLabel
 */

/**
 * @typedef {Object} StrengthResult
 * @property {StrengthLabel} label      - Rótulo textual da força.
 * @property {number}        score      - Pontuação normalizada 0–100.
 * @property {string}        color      - Cor CSS representativa.
 */

// ── Funções utilitárias ────────────────────────────────────────────────────

/**
 * Gera um inteiro aleatório seguro no intervalo [0, max).
 *
 * Usa `crypto.getRandomValues` para garantir aleatoriedade criptográfica,
 * eliminando viés por rejeição (rejection sampling).
 *
 * @param {number} max - Limite superior exclusivo.
 * @returns {number} Inteiro seguro no intervalo [0, max).
 * @throws {RangeError} Se `max` for menor ou igual a zero.
 *
 * @example
 * const idx = secureRandom(26); // 0 a 25
 */
function secureRandom(max) {
  if (max <= 0) throw new RangeError('max deve ser maior que zero.');

  const limit = 256 - (256 % max);
  let value;
  do {
    value = crypto.getRandomValues(new Uint8Array(1))[0];
  } while (value >= limit);

  return value % max;
}

/**
 * Monta o conjunto de caracteres disponíveis com base na configuração.
 *
 * @param {PasswordConfig} config - Configuração de geração.
 * @returns {string} String contendo todos os caracteres elegíveis.
 * @throws {Error} Se nenhum conjunto de caracteres estiver habilitado.
 *
 * @example
 * const charset = buildCharset({ useUpper: true, useLower: true, useNumbers: false, useSymbols: false });
 * // 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz'
 */
function buildCharset(config) {
  let charset = '';
  if (config.useUpper)   charset += CHARSET_UPPER;
  if (config.useLower)   charset += CHARSET_LOWER;
  if (config.useNumbers) charset += CHARSET_NUMBERS;
  if (config.useSymbols) charset += CHARSET_SYMBOLS;

  if (!charset) {
    throw new Error('Selecione ao menos um conjunto de caracteres.');
  }
  return charset;
}

/**
 * Garante que a senha contenha ao menos um caractere de cada conjunto habilitado.
 *
 * Escolhe um caractere aleatório de cada conjunto ativo e os embaralha
 * dentro da senha, garantindo conformidade com requisitos de complexidade.
 *
 * @param {string[]} chars     - Array mutável com os caracteres da senha.
 * @param {PasswordConfig} config - Configuração utilizada na geração.
 * @returns {void} Modifica `chars` in-place.
 */
function ensureRequiredChars(chars, config) {
  const required = [];
  if (config.useUpper)   required.push(CHARSET_UPPER[secureRandom(CHARSET_UPPER.length)]);
  if (config.useLower)   required.push(CHARSET_LOWER[secureRandom(CHARSET_LOWER.length)]);
  if (config.useNumbers) required.push(CHARSET_NUMBERS[secureRandom(CHARSET_NUMBERS.length)]);
  if (config.useSymbols) required.push(CHARSET_SYMBOLS[secureRandom(CHARSET_SYMBOLS.length)]);

  // Substitui posições aleatórias para não criar padrão previsível
  required.forEach((ch) => {
    const pos = secureRandom(chars.length);
    chars[pos] = ch;
  });
}

// ── API pública ────────────────────────────────────────────────────────────

/**
 * Gera uma senha segura com base na configuração fornecida.
 *
 * Utiliza `crypto.getRandomValues` para aleatoriedade criptograficamente
 * segura, garantindo que cada conjunto de caracteres habilitado seja
 * representado na senha final (via `ensureRequiredChars`).
 *
 * @param {PasswordConfig} config - Parâmetros de geração.
 * @returns {string} Senha gerada.
 * @throws {RangeError} Se `length` estiver fora do intervalo [6, 64].
 * @throws {Error}      Se nenhum conjunto de caracteres estiver habilitado.
 *
 * @example
 * const senha = generatePassword({
 *   length: 20,
 *   useUpper: true,
 *   useLower: true,
 *   useNumbers: true,
 *   useSymbols: false,
 * });
 * console.log(senha); // ex.: 'Xk9mJpQr3Tn7YhWv2Ds4'
 */
function generatePassword(config) {
  const { length } = config;

  if (!Number.isInteger(length) || length < 6 || length > 64) {
    throw new RangeError('O comprimento deve ser um inteiro entre 6 e 64.');
  }

  const charset = buildCharset(config);
  const chars = Array.from({ length }, () => charset[secureRandom(charset.length)]);

  ensureRequiredChars(chars, config);

  return chars.join('');
}

/**
 * Avalia a força de uma senha com base em comprimento e variedade de caracteres.
 *
 * Usa uma heurística baseada em entropia estimada (bits = log2(charsetSize) * length),
 * com limites ajustados para uso prático.
 *
 * | Score (bits aprox.) | Rótulo       | Cor         |
 * |---------------------|--------------|-------------|
 * | < 40                | fraca        | #ff4d6d     |
 * | 40 – 59             | razoável     | #ff9f43     |
 * | 60 – 79             | boa          | #ffd32a     |
 * | 80 – 99             | forte        | #7bed9f     |
 * | ≥ 100               | muito forte  | #00ff88     |
 *
 * @param {string} password - Senha a ser avaliada.
 * @returns {StrengthResult} Resultado com label, score (0–100) e cor.
 *
 * @example
 * const { label, score, color } = evaluateStrength('abc');
 * // { label: 'fraca', score: 8, color: '#ff4d6d' }
 */
function evaluateStrength(password) {
  if (!password || password.length === 0) {
    return { label: '—', score: 0, color: '#6b6b8a' };
  }

  let charsetSize = 0;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

  const entropyBits = Math.log2(Math.max(charsetSize, 1)) * password.length;

  let label, color, score;

  if (entropyBits < 40) {
    label = 'FRACA';      color = '#ff4d6d'; score = Math.round((entropyBits / 40) * 20);
  } else if (entropyBits < 60) {
    label = 'RAZOÁVEL';   color = '#ff9f43'; score = 20 + Math.round(((entropyBits - 40) / 20) * 20);
  } else if (entropyBits < 80) {
    label = 'BOA';        color = '#ffd32a'; score = 40 + Math.round(((entropyBits - 60) / 20) * 20);
  } else if (entropyBits < 100) {
    label = 'FORTE';      color = '#7bed9f'; score = 60 + Math.round(((entropyBits - 80) / 20) * 20);
  } else {
    label = 'MUITO FORTE'; color = '#00ff88'; score = Math.min(100, 80 + Math.round(((entropyBits - 100) / 28) * 20));
  }

  return { label, score, color };
}

// ── Exportação (UMD-lite: funciona em browser e Node.js/Jest) ──────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePassword, evaluateStrength, buildCharset, secureRandom };
}
