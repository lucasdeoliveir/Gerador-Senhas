# 🔐 Gerador de Senhas Seguras

> Aplicação web simples para geração de senhas criptograficamente seguras, construída como miniprojeto do laboratório de IA Generativa (UFG/AKCIT/Embrapii).

---

## Sumário

- [Sobre](#sobre)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Como a IA Acelerou Este Projeto](#como-a-ia-acelerou-este-projeto)
- [Limitações e Próximos Passos](#limitações-e-próximos-passos)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre

O **Gerador de Senhas Seguras** é uma aplicação web front-end puro (HTML + CSS + JavaScript vanilla) que permite ao usuário gerar senhas aleatórias com base em critérios personalizáveis:

- Comprimento (6 a 64 caracteres)
- Inclusão de letras maiúsculas, minúsculas, números e/ou símbolos
- Indicador visual de força baseado em entropia estimada
- Cópia para a área de transferência com feedback

Todo o processamento ocorre **localmente no navegador** — nenhum dado é enviado a servidores externos.

---

## Demonstração

![Captura de tela do Gerador de Senhas](docs/screenshot.png)

> _Substitua pela captura real após executar o projeto._

---

## Tecnologias

| Categoria          | Tecnologia                          |
|--------------------|-------------------------------------|
| Interface          | HTML5, CSS3, JavaScript ES2022 (vanilla) |
| Aleatoriedade      | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (`crypto.getRandomValues`) |
| Testes             | [Jest](https://jestjs.io/) v29      |
| Mock Crypto (tests)| [@peculiar/webcrypto](https://github.com/PeculiarVentures/webcrypto) |
| Fontes             | Google Fonts (Space Mono, Syne)     |
| IA Generativa      | Claude 4.6 Sonnet (geração de código, testes e documentação) |

---

## Pré-requisitos

- **Node.js** ≥ 18 (apenas para rodar os testes)
- Qualquer navegador moderno (Chrome 80+, Firefox 78+, Safari 14+, Edge 80+)

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/gerador-senhas.git
cd gerador-senhas
```

### 2. Instale as dependências de desenvolvimento

```bash
npm install
```

> As dependências são apenas para testes. A aplicação em si não requer nenhuma instalação.

### 3. Execute localmente

**Opção A — Abrir diretamente no navegador:**

```bash
open src/index.html      # macOS
xdg-open src/index.html  # Linux
start src/index.html     # Windows
```

**Opção B — Servidor local com `serve`:**

```bash
npm start
# Acesse: http://localhost:3000
```

---

## Uso

| Controle              | Descrição |
|-----------------------|-----------|
| Slider "Comprimento"  | Define o número de caracteres da senha (6–64) |
| Checkboxes            | Ativa/desativa grupos de caracteres |
| Botão ⚡ GERAR        | Gera uma nova senha com as configurações atuais |
| Botão 📋 (copiar)     | Copia a senha para a área de transferência |
| Botão ✕ LIMPAR        | Limpa o campo e o indicador de força |

### Exemplos de senhas geradas

```
Comprimento: 20, todos os charsets → X#9kLp@2qRw!7mZv$4nT
Comprimento: 12, só números e maiúsculas → F4K9Z1M7Q3T6
Comprimento: 8,  só letras minúsculas → xkmpqrvt
```

---

## Estrutura do Projeto

```
gerador-senhas/
├── src/
│   ├── index.html            # Interface principal (HTML + CSS inline)
│   ├── password-generator.js # Lógica de negócio (puro JS, sem DOM)
│   └── app.js                # Controlador de UI (eventos e DOM)
├── tests/
│   └── password-generator.test.js  # Suíte Jest com 20+ casos de teste
├── docs/
│   └── screenshot.png        # Captura de tela da aplicação
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

**Separação de responsabilidades (SRP):**

- `password-generator.js` — apenas lógica pura (gerar senha, avaliar força, montar charset). Testável sem DOM.
- `app.js` — apenas interação com o DOM. Não contém lógica de negócio.

---

## Testes

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (reexecuta ao salvar)
npm run test:watch
```

A suíte cobre:

- `generatePassword()` — 12 casos (comprimentos, charsets, erros, aleatoriedade)
- `evaluateStrength()` — 6 casos (faixas de força, borda)
- `buildCharset()` — 5 casos (combinações e erro)
- `secureRandom()` — 3 casos (intervalos, erros, distribuição)

---

## Como a IA Acelerou Este Projeto

Este projeto foi desenvolvido com auxílio do **Claude 4.6 Sonnet** (Anthropic) via Claude.ai, seguindo as práticas do ebook *Laboratório Introdutório* (UFG/AKCIT/Embrapii, 2026).

### Ganhos de produtividade

| Tarefa                              | Sem IA (estimativa) | Com IA      | Redução |
|-------------------------------------|---------------------|-------------|---------|
| Boilerplate HTML/CSS                | ~2h                 | ~15min      | ~88%    |
| Lógica de geração + docstrings      | ~1h30               | ~10min      | ~89%    |
| Suíte de testes (20+ casos)         | ~2h                 | ~20min      | ~83%    |
| README profissional                 | ~1h                 | ~10min      | ~83%    |

### Ferramentas utilizadas

- **Claude 4.6 Sonnet** — geração do código principal, docstrings no formato Google, testes unitários com pytest-style e README.
- **Padrão CO-STAR** — todos os prompts seguiram: Contexto (projeto, stack, objetivo da função), Objetivo (tarefa específica), Estilo (PEP 8 / JSDoc, convensões), Resposta (apenas o código ou apenas o bloco solicitado).

### Exemplo de prompt utilizado

```
Contexto: projeto JavaScript vanilla de gerador de senhas.
Objetivo: função `generatePassword(config)` que use Web Crypto API
  (crypto.getRandomValues) para gerar senha sem viés.
  Config: { length, useUpper, useLower, useNumbers, useSymbols }.
Estilo: JSDoc completo, funções auxiliares separadas, ES2022 strict mode.
Resposta: apenas o código da função e seus auxiliares diretos.
```

### Lições aprendidas

1. **Revisão é obrigatória:** a IA gerou lógica correta, mas comentários precisaram de ajuste para refletir o domínio real do projeto.
2. **Testes de distribuição:** o caso de teste de viés estatístico (`secureRandom`) precisou de ajuste no limiar — a IA sugeriu 10%, reduzimos para 5% para evitar falsos positivos.
3. **Prompts incrementais funcionam melhor** do que prompts muito abrangentes: pedimos primeiro a lógica pura, depois os testes, depois a UI.

---

## Limitações e Próximos Passos

### Limitações atuais (v1.0.0)

- Sem persistência: senhas não são salvas entre sessões.
- Sem histórico de senhas geradas.
- Sem suporte a conjuntos de caracteres personalizados.
- Sem testes de UI (apenas testes unitários da lógica de negócio).
- Sem modo offline completo (PWA).

### Próximos passos

- [ ] Adicionar histórico de senhas (localStorage)
- [ ] Permitir exclusão de caracteres ambíguos (`0`, `O`, `l`, `1`)
- [ ] Opção de charset personalizado
- [ ] Testes de UI com Playwright ou Cypress
- [ ] Publicação como GitHub Pages
- [ ] Internacionalização (i18n)
- [ ] Modo PWA (offline-first)

---

## Contribuição

Contribuições são bem-vindas! Siga os passos:

```bash
# 1. Fork e clone
git clone https://github.com/SEU_USUARIO/gerador-senhas.git

# 2. Crie um branch descritivo
git checkout -b feat/historico-senhas

# 3. Faça as alterações e adicione testes

# 4. Commit seguindo Conventional Commits
git commit -m "feat(history): adiciona histórico de senhas geradas"

# 5. Push e abra um Pull Request
git push origin feat/historico-senhas
```

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para detalhes.

---

_Desenvolvido como parte do Laboratório Introdutório — Curso de Especialização em Engenharia de Software com IA Generativa · UFG / AKCIT / Embrapii · 2026_
