# Teste de componente: validação de produto

Data da execução: 2026-11-14 (versão 2 do pacote, código do commit `a0d2ff9`)

## Versão do sistema

| Item | Valor |
|---|---|
| Repositório | https://github.com/Pansera13/TCC |
| Commit testado | `a0d2ff93b1b0a415d77b472a50cee80880939bad` (branch `testes-validacao-produto`, incorporado ao `main` pelo merge `3053d80`) |
| Link | https://github.com/Pansera13/TCC/commit/a0d2ff93b1b0a415d77b472a50cee80880939bad |
| Versão do pacote frontend | `0.0.0` |
| Vitest | 5.1.0 |
| Node.js / npm | v24.21.0 / 12.0.2 |
| Sistema operacional | Windows 11 Pro 10.0.26200 (64 bits) |

Detalhes e conferência de hash em [`../evidencias/ambiente.txt`](../evidencias/ambiente.txt).

## Função testada

`validarProduto(form)` em [`../../TCC-Claude/frontend/src/utils/productValidation.js`](../../TCC-Claude/frontend/src/utils/productValidation.js), o mesmo arquivo do commit (hash `c22cacf7d54d3ce75f8262420b83bf3f554bc84f` no pacote e no commit).
Usada por `handleManualSubmit` em `TCC-Claude/frontend/src/components/AddProductModal.jsx` (cadastro manual de produto). Antes era a função interna `validateForm`, presa ao componente React. Foi extraída sem mudar a lógica para poder ser testada isoladamente; a extração e o uso no formulário estão no commit acima.

Retorna um objeto `{ campo: mensagem }`. Objeto vazio (`{}`) significa dados válidos.

| Campo | Obrigatório | Regra | Mensagem de erro |
|---|---|---|---|
| `nome` | sim | não pode ser vazio nem só espaços (`trim`) | `Nome é obrigatório.` |
| `quantidade` | sim | não pode ser vazia; deve ser número maior que zero | `Quantidade é obrigatória.` / `Quantidade deve ser um número maior que zero.` |
| `unidade` | sim | não pode ser vazia | `Unidade é obrigatória.` |
| `categoria`, `fornecedor`, `codigo_barras` | não | sem validação | n/a |

## Configuração

- Ferramenta: Vitest 5.1.0, instalado na pasta `Muriel` com `npm ci` (o `package.json` do frontend não foi alterado), ambiente `node`.
- [`../vitest.config.js`](../vitest.config.js): configuração própria, sem plugins React/Tailwind/SSL e sem DOM, pois a função é JavaScript puro. Procura testes em `testes/**/*.test.js`.
- Scripts no [`../package.json`](../package.json): `"test": "vitest run"` e `"test:verbose": "vitest run --reporter=verbose"`.

## Particionamento de equivalência

| Classe | Entrada | Resultado esperado | Casos de teste |
|---|---|---|---|
| 1. Todos os obrigatórios válidos | `nome`, `quantidade` > 0 e `unidade` preenchidos | aceita: `{}` | CT-01, CT-02 (com e sem campos opcionais) |
| 2. Um obrigatório vazio | um de `nome`, `quantidade`, `unidade` vazio | rejeita: erro só no campo vazio | CT-03 a CT-06 (nome vazio, nome só com espaços, quantidade vazia, unidade vazia) |

Cada teste compara automaticamente o resultado obtido com o esperado usando `expect(...).toEqual(...)`.

Arquivo de teste: [`../testes/validacao-produto.test.js`](../testes/validacao-produto.test.js).

## Como executar

Estrutura: `Muriel` e `TCC-Claude` lado a lado (é como o pacote vem). Os comandos rodam dentro da pasta `Muriel`:

```bash
cd entrega-v2/Muriel
npm ci
npx vitest run testes/validacao-produto.test.js --reporter=verbose
```

## Resultado

Saída completa em [`resultado-vitest.txt`](resultado-vitest.txt).

```
Test Files  1 passed (1)
     Tests  6 passed (6)
```

| ID | Teste | Resultado |
|---|---|---|
| CT-01 | Classe 1: aceita o produto (nenhum erro) | passou |
| CT-02 | Classe 1: aceita o produto sem os campos opcionais | passou |
| CT-03 | Classe 2: rejeita o produto com o campo nome vazio | passou |
| CT-04 | Classe 2: rejeita o produto com o campo nome só com espaços | passou |
| CT-05 | Classe 2: rejeita o produto com o campo quantidade vazio | passou |
| CT-06 | Classe 2: rejeita o produto com o campo unidade vazio | passou |

Verificação de sensibilidade: removendo temporariamente a validação do `nome`, CT-03 e CT-04 falharam (registro em [`../evidencias/vitest-defeito-A-nome.txt`](../evidencias/vitest-defeito-A-nome.txt), que roda os 18 testes do pacote). A função foi restaurada e o hash voltou a ser igual ao do commit.

## Limites

O teste confere só a função isolada. Não renderiza o formulário, não chama a API e não grava no banco. A lista completa está na seção "Limites da análise" da [`../FICHA_DE_TESTE.md`](../FICHA_DE_TESTE.md), junto com a análise de valor-limite (T2) e a análise estática (T3).

## Arquivos

| Arquivo | Papel |
|---|---|
| `Muriel/testes/validacao-produto.test.js` | casos de teste |
| `Muriel/issue-componente/resultado-vitest.txt` | saída desta execução |
| `Muriel/issue-componente/RELATORIO_TESTE_COMPONENTE.md` | este relatório |
| `Muriel/vitest.config.js` | configuração do Vitest |
| `Muriel/package.json`, `Muriel/package-lock.json` | Vitest e scripts |
| `TCC-Claude/frontend/src/utils/productValidation.js` | função testada (commit `a0d2ff9`) |
| `TCC-Claude/frontend/src/components/AddProductModal.jsx` | importa e usa `validarProduto` (commit `a0d2ff9`) |
