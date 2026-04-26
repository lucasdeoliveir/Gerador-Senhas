# 📋 Guia de Commits para o GitHub

Execute os comandos abaixo **na ordem**, após criar seu repositório no GitHub.
Cada bloco representa um commit seguindo Conventional Commits.

---

## 1. Inicializar repositório

```bash
git init
git remote add origin https://github.com/lucasdeoliveir/gerador-senhas.git
git branch -M main
```

---

## 2. Commit 1 — chore: estrutura inicial do projeto

```bash
git add .gitignore package.json LICENSE
git commit -m "chore: estrutura inicial do projeto

Adiciona .gitignore para Node.js/editores, package.json com
scripts de teste (Jest) e licença MIT."
```

---

## 3. Commit 2 — feat(core): implementa lógica de geração de senhas

```bash
git add src/password-generator.js
git commit -m "feat(core): implementa lógica de geração de senhas seguras

Adiciona password-generator.js com:
- generatePassword(): geração via Web Crypto API (sem viés)
- evaluateStrength(): avaliação de força por entropia estimada
- buildCharset(): montagem de charset por configuração
- secureRandom(): inteiro seguro via rejection sampling"
```

---

## 4. Commit 3 — feat(ui): adiciona interface web com tema dark

```bash
git add src/index.html src/app.js
git commit -m "feat(ui): adiciona interface web com tema dark/cyberpunk

Cria index.html com CSS inline (variáveis, grid, animações) e
app.js (controlador de UI separado da lógica de negócio - SRP).
Inclui slider de comprimento, checkboxes, indicador de força
e cópia para área de transferência."
```

---

## 5. Commit 4 — test: adiciona suíte de testes unitários com Jest

```bash
git add tests/
git commit -m "test: adiciona suíte de testes unitários com Jest

20+ casos cobrindo generatePassword, evaluateStrength,
buildCharset e secureRandom. Inclui mock da Web Crypto API
para ambiente Node.js via @peculiar/webcrypto."
```

---

## 6. Commit 5 — docs: adiciona README, CHANGELOG e guia de commits

```bash
git add README.md CHANGELOG.md docs/
git commit -m "docs: adiciona README profissional e CHANGELOG

README inclui: instalação, uso, estrutura do projeto, testes,
seção 'Como a IA Acelerou Este Projeto' e limitações/próximos
passos. CHANGELOG segue Keep a Changelog v1.1.0."
```

---

## 7. Push e Release

```bash
# Push de todos os commits
git push -u origin main

# Criar tag de release v1.0.0
git tag -a v1.0.0 -m "release: versão 1.0.0 — MVP do Gerador de Senhas Seguras

Funcionalidades:
- Geração criptograficamente segura (Web Crypto API)
- 4 conjuntos de caracteres configuráveis
- Indicador de força por entropia
- Interface web dark/cyberpunk
- Suíte de testes unitários (Jest, 20+ casos)"

git push origin v1.0.0
```

> No GitHub, vá em **Releases → Create a release**, selecione a tag `v1.0.0`
> e publique. Isso marca a versão oficial de entrega.

---

## ✅ Checklist de submissão (do ebook)

- [ ] Repositório público no GitHub
- [ ] Histórico com ≥ 5 commits em Conventional Commits
- [ ] README completo (instalação, uso, exemplos, limitações)
- [ ] Arquivo de dependências (`package.json`)
- [ ] Testes automatizados presentes e passando (`npm test`)
- [ ] Sem credenciais/chaves no código ou histórico
- [ ] Branch `main` limpo (sem arquivos temporários)
- [ ] Release/Tag `v1.0.0` criada
- [ ] Licença especificada (`MIT`)
