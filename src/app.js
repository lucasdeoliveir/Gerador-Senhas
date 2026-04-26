/**
 * @fileoverview Controlador de interface do Gerador de Senhas.
 *
 * Responsável por toda interação com o DOM: eventos, atualização de
 * estado visual e feedback ao usuário. Separado da lógica de negócio
 * (password-generator.js) seguindo o princípio SRP.
 *
 * @module app
 * @version 1.0.0
 */

'use strict';

// ── Elementos do DOM ───────────────────────────────────────────────────────

const $output     = document.getElementById('password-output');
const $copyBtn    = document.getElementById('copy-btn');
const $genBtn     = document.getElementById('generate-btn');
const $clearBtn   = document.getElementById('clear-btn');
const $slider     = document.getElementById('length-slider');
const $lengthVal  = document.getElementById('length-val');
const $strengthTx = document.getElementById('strength-text');
const $strengthFl = document.getElementById('strength-fill');
const $pwdBox     = document.getElementById('pwd-box');
const $toast      = document.getElementById('toast');

const $optUpper   = document.getElementById('opt-upper');
const $optLower   = document.getElementById('opt-lower');
const $optNumbers = document.getElementById('opt-numbers');
const $optSymbols = document.getElementById('opt-symbols');

// ── Estado ─────────────────────────────────────────────────────────────────

/** @type {ReturnType<typeof setTimeout>|null} */
let toastTimer = null;

// ── Funções auxiliares de UI ───────────────────────────────────────────────

/**
 * Exibe uma notificação toast temporária.
 *
 * @param {string} message - Texto a ser exibido.
 * @param {number} [duration=2000] - Duração em ms antes de ocultar.
 * @returns {void}
 */
function showToast(message, duration = 2000) {
  $toast.textContent = message;
  $toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove('show'), duration);
}

/**
 * Atualiza o indicador visual de força da senha.
 *
 * @param {string} password - Senha a ser avaliada.
 * @returns {void}
 */
function updateStrengthUI(password) {
  const { label, score, color } = evaluateStrength(password);
  $strengthTx.textContent      = label;
  $strengthTx.style.color      = color;
  $strengthFl.style.width      = `${score}%`;
  $strengthFl.style.background = color;
}

/**
 * Lê o estado atual dos controles e retorna a configuração de geração.
 *
 * @returns {import('./password-generator').PasswordConfig} Configuração atual.
 */
function getCurrentConfig() {
  return {
    length:     parseInt($slider.value, 10),
    useUpper:   $optUpper.checked,
    useLower:   $optLower.checked,
    useNumbers: $optNumbers.checked,
    useSymbols: $optSymbols.checked,
  };
}

// ── Handlers de eventos ────────────────────────────────────────────────────

/**
 * Gera uma nova senha e atualiza a interface.
 *
 * Captura erros de validação (ex.: nenhum charset selecionado) e
 * exibe feedback via toast.
 *
 * @returns {void}
 */
function handleGenerate() {
  try {
    const config   = getCurrentConfig();
    const password = generatePassword(config);
    $output.value  = password;
    updateStrengthUI(password);
    $pwdBox.classList.remove('copied');
  } catch (err) {
    showToast('⚠️ ' + err.message, 3000);
  }
}

/**
 * Copia a senha atual para a área de transferência.
 *
 * Usa a Clipboard API quando disponível, com fallback para
 * `execCommand`. Exibe confirmação via toast.
 *
 * @returns {void}
 */
function handleCopy() {
  const pwd = $output.value;
  if (!pwd) { showToast('Gere uma senha primeiro!'); return; }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(pwd)
      .then(() => {
        showToast('✅ Copiada!');
        $pwdBox.classList.add('copied');
        $copyBtn.textContent = '✅';
        setTimeout(() => { $copyBtn.textContent = '📋'; }, 1500);
      })
      .catch(() => showToast('❌ Falha ao copiar.'));
  } else {
    $output.select();
    document.execCommand('copy');
    showToast('✅ Copiada!');
  }
}

/**
 * Limpa a senha e reseta os indicadores visuais.
 *
 * @returns {void}
 */
function handleClear() {
  $output.value = '';
  $strengthTx.textContent      = '—';
  $strengthTx.style.color      = '';
  $strengthFl.style.width      = '0%';
  $strengthFl.style.background = '';
  $pwdBox.classList.remove('copied');
}

/**
 * Sincroniza o rótulo de comprimento com o valor do slider.
 *
 * @returns {void}
 */
function handleSlider() {
  $lengthVal.textContent = $slider.value;
}

/**
 * Alterna o estado ativo de uma label de opção ao clicar.
 *
 * @param {Event} e - Evento de clique na label.
 * @returns {void}
 */
function handleOptionClick(e) {
  const label    = e.currentTarget;
  const checkbox = label.querySelector('input[type=checkbox]');
  // O estado do checkbox já foi atualizado pelo browser antes desse handler
  label.classList.toggle('active', checkbox.checked);
}

// ── Inicialização ──────────────────────────────────────────────────────────

/**
 * Registra todos os listeners e gera a primeira senha automaticamente.
 *
 * @returns {void}
 */
function init() {
  $genBtn.addEventListener('click', handleGenerate);
  $copyBtn.addEventListener('click', handleCopy);
  $clearBtn.addEventListener('click', handleClear);
  $slider.addEventListener('input', handleSlider);

  document.querySelectorAll('#options-grid .option').forEach((label) => {
    label.addEventListener('click', handleOptionClick);
  });

  // Gera senha inicial
  handleGenerate();
}

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
