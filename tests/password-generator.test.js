/**
 * @file Suíte de testes unitários para o módulo password-generator.js
 *
 * Cobre:
 *  - generatePassword: valores válidos, casos de borda, erros esperados
 *  - evaluateStrength: cada faixa de força
 *  - buildCharset: combinações de opções
 *  - secureRandom: distribuição e erros
 */

'use strict';

// Mock da Web Crypto API para ambiente Node.js/Jest
const { Crypto } = require('@peculiar/webcrypto');
global.crypto = new Crypto();

const {
  generatePassword,
  evaluateStrength,
  buildCharset,
  secureRandom,
} = require('../src/password-generator');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Configuração padrão usada na maioria dos testes. */
const defaultConfig = {
  length: 16,
  useUpper: true,
  useLower: true,
  useNumbers: true,
  useSymbols: true,
};

// ── generatePassword ───────────────────────────────────────────────────────

describe('generatePassword()', () => {

  test('retorna string com comprimento correto', () => {
    const pwd = generatePassword({ ...defaultConfig, length: 16 });
    expect(typeof pwd).toBe('string');
    expect(pwd).toHaveLength(16);
  });

  test('respeita comprimento mínimo (6)', () => {
    const pwd = generatePassword({ ...defaultConfig, length: 6 });
    expect(pwd).toHaveLength(6);
  });

  test('respeita comprimento máximo (64)', () => {
    const pwd = generatePassword({ ...defaultConfig, length: 64 });
    expect(pwd).toHaveLength(64);
  });

  test('lança RangeError para comprimento menor que 6', () => {
    expect(() => generatePassword({ ...defaultConfig, length: 5 }))
      .toThrow(RangeError);
  });

  test('lança RangeError para comprimento maior que 64', () => {
    expect(() => generatePassword({ ...defaultConfig, length: 65 }))
      .toThrow(RangeError);
  });

  test('lança RangeError para comprimento não-inteiro', () => {
    expect(() => generatePassword({ ...defaultConfig, length: 12.5 }))
      .toThrow(RangeError);
  });

  test('lança Error quando nenhum charset está habilitado', () => {
    expect(() => generatePassword({
      length: 12,
      useUpper: false,
      useLower: false,
      useNumbers: false,
      useSymbols: false,
    })).toThrow(Error);
  });

  test('contém apenas maiúsculas quando somente useUpper=true', () => {
    const pwd = generatePassword({
      length: 20,
      useUpper: true,
      useLower: false,
      useNumbers: false,
      useSymbols: false,
    });
    expect(pwd).toMatch(/^[A-Z]+$/);
  });

  test('contém apenas minúsculas quando somente useLower=true', () => {
    const pwd = generatePassword({
      length: 20,
      useUpper: false,
      useLower: true,
      useNumbers: false,
      useSymbols: false,
    });
    expect(pwd).toMatch(/^[a-z]+$/);
  });

  test('contém apenas dígitos quando somente useNumbers=true', () => {
    const pwd = generatePassword({
      length: 20,
      useUpper: false,
      useLower: false,
      useNumbers: true,
      useSymbols: false,
    });
    expect(pwd).toMatch(/^[0-9]+$/);
  });

  test('contém ao menos uma maiúscula quando useUpper=true (all charsets)', () => {
    // Executa 10 vezes para garantir que ensureRequiredChars funciona
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword({ ...defaultConfig, length: 12 });
      expect(pwd).toMatch(/[A-Z]/);
    }
  });

  test('contém ao menos uma minúscula quando useLower=true (all charsets)', () => {
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword({ ...defaultConfig, length: 12 });
      expect(pwd).toMatch(/[a-z]/);
    }
  });

  test('contém ao menos um número quando useNumbers=true (all charsets)', () => {
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword({ ...defaultConfig, length: 12 });
      expect(pwd).toMatch(/[0-9]/);
    }
  });

  test('contém ao menos um símbolo quando useSymbols=true (all charsets)', () => {
    for (let i = 0; i < 10; i++) {
      const pwd = generatePassword({ ...defaultConfig, length: 12 });
      expect(pwd).toMatch(/[^A-Za-z0-9]/);
    }
  });

  test('duas senhas consecutivas são diferentes (aleatoriedade)', () => {
    const a = generatePassword(defaultConfig);
    const b = generatePassword(defaultConfig);
    expect(a).not.toBe(b);
  });

});

// ── evaluateStrength ───────────────────────────────────────────────────────

describe('evaluateStrength()', () => {

  test('retorna score 0 e label "—" para senha vazia', () => {
    const result = evaluateStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('—');
  });

  test('classifica senha curta/simples como FRACA', () => {
    const result = evaluateStrength('abc');
    expect(result.label).toBe('FRACA');
    expect(result.score).toBeLessThan(20);
  });

  test('classifica senha média como RAZOÁVEL ou BOA', () => {
    const result = evaluateStrength('Senha123');
    expect(['RAZOÁVEL', 'BOA']).toContain(result.label);
  });

  test('classifica senha longa e complexa como FORTE ou MUITO FORTE', () => {
    const result = evaluateStrength('X#9kLp@2qRw!7mZv$4nT');
    expect(['FORTE', 'MUITO FORTE']).toContain(result.label);
  });

  test('score está no intervalo [0, 100]', () => {
    const passwords = ['a', 'abc123', 'Abc123!@#', 'X#9kLp@2qRw!7mZv$4nTsY'];
    passwords.forEach((pwd) => {
      const { score } = evaluateStrength(pwd);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  test('retorna uma cor CSS válida (string com #)', () => {
    const { color } = evaluateStrength('Test@1234');
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test('senhas mais longas têm score maior ou igual', () => {
    const short  = evaluateStrength('Ab1!');
    const longer = evaluateStrength('Ab1!Ab1!Ab1!Ab1!Ab1!');
    expect(longer.score).toBeGreaterThanOrEqual(short.score);
  });

});

// ── buildCharset ───────────────────────────────────────────────────────────

describe('buildCharset()', () => {

  test('inclui maiúsculas quando useUpper=true', () => {
    const cs = buildCharset({ useUpper: true, useLower: false, useNumbers: false, useSymbols: false });
    expect(cs).toMatch(/[A-Z]/);
    expect(cs).not.toMatch(/[a-z]/);
  });

  test('inclui minúsculas quando useLower=true', () => {
    const cs = buildCharset({ useUpper: false, useLower: true, useNumbers: false, useSymbols: false });
    expect(cs).toMatch(/[a-z]/);
  });

  test('inclui dígitos quando useNumbers=true', () => {
    const cs = buildCharset({ useUpper: false, useLower: false, useNumbers: true, useSymbols: false });
    expect(cs).toMatch(/[0-9]/);
  });

  test('combina todos os charsets corretamente', () => {
    const cs = buildCharset({ useUpper: true, useLower: true, useNumbers: true, useSymbols: true });
    expect(cs).toMatch(/[A-Z]/);
    expect(cs).toMatch(/[a-z]/);
    expect(cs).toMatch(/[0-9]/);
    expect(cs.length).toBeGreaterThan(60);
  });

  test('lança Error quando todos os charsets estão desabilitados', () => {
    expect(() => buildCharset({
      useUpper: false, useLower: false, useNumbers: false, useSymbols: false
    })).toThrow(Error);
  });

});

// ── secureRandom ───────────────────────────────────────────────────────────

describe('secureRandom()', () => {

  test('retorna inteiro no intervalo [0, max)', () => {
    for (let i = 0; i < 50; i++) {
      const n = secureRandom(10);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  test('lança RangeError para max <= 0', () => {
    expect(() => secureRandom(0)).toThrow(RangeError);
    expect(() => secureRandom(-5)).toThrow(RangeError);
  });

  test('distribui resultados de forma razoável (sem viés extremo)', () => {
    const counts = new Array(5).fill(0);
    const trials = 500;
    for (let i = 0; i < trials; i++) {
      counts[secureRandom(5)]++;
    }
    // Cada bucket deve ser preenchido ao menos 5% das vezes (muito abaixo dos ~20% esperados)
    counts.forEach((c) => expect(c / trials).toBeGreaterThan(0.05));
  });

});
