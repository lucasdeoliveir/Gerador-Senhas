# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.0] — 2026-04-26

### Adicionado

- Interface web com tema dark/cyberpunk e indicador de força de senha
- Geração criptograficamente segura via `crypto.getRandomValues` (Web Crypto API)
- Suporte a 4 conjuntos de caracteres: maiúsculas, minúsculas, números e símbolos
- Slider de comprimento (6–64 caracteres)
- Avaliação de força baseada em entropia estimada (bits) com 5 faixas: FRACA → MUITO FORTE
- Cópia para área de transferência via Clipboard API com fallback `execCommand`
- Suíte de testes unitários com Jest (20+ casos) cobrindo toda a lógica de negócio
- Separação clara entre lógica de negócio (`password-generator.js`) e controlador de UI (`app.js`)
- README profissional com seção "Como a IA Acelerou Este Projeto"
- `.gitignore` para Node.js e editores comuns
- Licença MIT

---

## [Não lançado]

### Planejado

- Histórico de senhas geradas (localStorage)
- Exclusão de caracteres ambíguos (0, O, l, 1)
- Publicação como GitHub Pages
- Testes de UI com Playwright
- Modo PWA (offline-first)
