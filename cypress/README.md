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
cd "TCC Claude/frontend" && npm run dev       # https://localhost:5173
# opcional (só para os testes de backend real):
cd "TCC Claude/backend" && npm run dev        # http://localhost:3001
```

## Executando

```bash
npm run cy:open   # interface interativa
npm run cy:run    # headless (CI)
```

Um spec só: `npx cypress run --spec cypress/e2e/auth/login.cy.js`.

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
  e2e/auth/        login e navegação/rotas protegidas
  e2e/dashboard/   área autenticada (backend simulado)
  fixtures/        respostas falsas da API
  support/         comandos customizados (commands.js) e setup (e2e.js)
cypress.config.js   (na raiz do repositório)
```

### Comandos customizados

- `cy.login(identifier, senha)` — login pela UI
- `cy.loginViaApi()` — login via API real com `cy.session` (usa as credenciais de `cy.env`)
- `cy.stubApiPadrao()` — intercepta `/api/profile` e `/api/products`
- `cy.visitAutenticado(caminho, overrides, { stubs })` — abre uma página já logada com sessão falsa

## Dica

Se o screenshot de falha travar em ambiente sem display, rode com
`CYPRESS_screenshotOnRunFailure=false npx cypress run`.
