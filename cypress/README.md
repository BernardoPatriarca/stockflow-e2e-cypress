# StockFlow — Testes E2E (Cypress)

Testes end-to-end do **StockFlow** (`TCC Claude`). Ficam na raiz do repositório, com o próprio
`package.json`, e não alteram as dependências do frontend nem do backend.

## Pré-requisitos

- Node.js 20+ e npm
- Frontend do Estoque rodando em `https://localhost:5173`

## Instalação

```bash
npm install   # na raiz do repositório
```

## Subindo o app a ser testado

Em outro terminal:

```bash
cd "TCC Claude/frontend" && VITE_RECAPTCHA_SITE_KEY= npm run dev     # https://localhost:5173
# opcional (só para os testes de backend real):
cd "TCC Claude/backend" && npm run dev                                # http://localhost:3001
```

> **reCAPTCHA:** o Cypress não resolve CAPTCHA. Com `VITE_RECAPTCHA_SITE_KEY` preenchida no `.env`
> do frontend, o botão de cadastro/recuperação fica bloqueado e os testes que enviam esses
> formulários aparecem como *pending*. Por isso o comando acima sobe o frontend com a chave vazia
> (no PowerShell: `$env:VITE_RECAPTCHA_SITE_KEY=""; npm run dev`). O `.env` não é alterado.

## Executando

```bash
npm run cy:open   # interface interativa
npm run cy:run    # headless (CI)
```

Um spec só: `npx cypress run --spec cypress/e2e/auth/login.cy.js`.
Uma área inteira: `npx cypress run --spec "cypress/e2e/estoque/**"`.

## Configuração

Em `cypress.config.js` (no Cypress 16 o `Cypress.env()` foi removido):

| Onde | Chave | Padrão | Uso |
|---|---|---|---|
| `e2e.baseUrl` | — | `https://localhost:5173` | Frontend (mude com `--config baseUrl=...`) |
| `e2e.expose` | `apiUrl` | `http://localhost:3001` | Backend, lido com `Cypress.expose('apiUrl')` |
| `e2e.env` | `userIdentifier`, `userPassword` | vazio | Usuário **de teste**, lido com `cy.env([...])` |

As credenciais ficam em `cypress.env.json` (ignorado pelo git). Copie o modelo:

```bash
cp cypress.env.example.json cypress.env.json
```

Sem credenciais, os testes "Login (backend real)" aparecem como *pending*; o restante roda com
o backend **simulado** (`cy.intercept`) e nunca toca o banco. Use sempre um usuário de teste.

## Estrutura

```
cypress/
  README.md
  e2e/
    auth/          login e navegação / rotas protegidas
    dashboard/     abertura do dashboard, sair da conta, sessão expirada
    conta/         cadastro, recuperação de senha (3 etapas), perfil
    estoque/       listagem/busca/ordenação, adicionar produto (manual, EAN, NF-e),
                   retirada, editar e remover (com permissão por cargo)
    gestao/        equipe e hierarquia de cargos, movimentações, relatórios e CSV
  fixtures/        respostas falsas da API (usuário, produtos, usuários, movimentações, relatório)
  support/
    commands.js    comandos customizados
    e2e.js         setup global
    captcha.js     ignora testes quando o reCAPTCHA está ativo
    estoque.js     API de produtos simulada, com estado em memória
    equipe.js      API de usuários simulada, com estado em memória
    consultas.js   movimentações simuladas e helpers das abas de consulta
cypress.config.js   (na raiz do repositório)
```

Todos os testes usam o backend **simulado** (`cy.intercept`): nada é gravado no banco. As APIs
simuladas mantêm estado, então criar, editar, remover ou retirar atualiza a lista como o backend faria.

### Comandos customizados

- `cy.login(identifier, senha)` — login pela UI
- `cy.loginViaApi()` — login via API real com `cy.session` (usa as credenciais de `cy.env`)
- `cy.stubApiPadrao()` — intercepta `/api/profile` e `/api/products`
- `cy.visitAutenticado(caminho, overrides, { stubs })` — abre uma página já logada com sessão falsa

## Dica

Se o screenshot de falha travar em ambiente sem display, rode com
`CYPRESS_screenshotOnRunFailure=false npx cypress run`.
