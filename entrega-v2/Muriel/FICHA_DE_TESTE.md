# Ficha de teste: validação de produto (StockFlow)

| Campo | Preenchimento |
|---|---|
| Responsável | Lucas Pansera |
| Data da execução | 2026-11-14 (versão 2 do pacote) |
| Sistema | StockFlow, frontend React (https://github.com/Pansera13/TCC) |
| Versão do sistema | commit `a0d2ff93b1b0a415d77b472a50cee80880939bad`, branch `testes-validacao-produto` (criado a partir de `main` em `c90f6c0`), incorporado ao `main` pelo merge `3053d80`, pacote frontend `0.0.0`. Link: https://github.com/Pansera13/TCC/commit/a0d2ff93b1b0a415d77b472a50cee80880939bad |
| O que o commit contém | o arquivo novo `frontend/src/utils/productValidation.js` (função `validarProduto`) e o `AddProductModal.jsx` usando essa função no lugar da antiga `validateForm` interna. A lógica não mudou |
| Item testado | `validarProduto(form)` em [`../TCC-Claude/frontend/src/utils/productValidation.js`](../TCC-Claude/frontend/src/utils/productValidation.js). Esse é o arquivo que os testes importam. Ele foi extraído do commit acima com `git archive` e tem o mesmo hash do commit (conferência em [`evidencias/ambiente.txt`](evidencias/ambiente.txt)) |
| Objetivo | Verificar se a validação aceita produtos válidos e rejeita produtos com dados obrigatórios ausentes ou fora da regra |
| Nível | Componente (unidade isolada) |

## Estrutura do pacote

Os testes importam a função real do projeto por caminho relativo (`../../TCC-Claude/frontend/src/utils/productValidation.js`). Por isso as pastas `Muriel` e `TCC-Claude` precisam ficar lado a lado. O pacote já vem nessa estrutura:

```
entrega-v2/
├── LEIA-ME.md
├── Muriel/                        testes, configurações, ficha e evidências
│   ├── FICHA_DE_TESTE.md          esta ficha
│   ├── package.json               scripts e versões fixas (vitest 5.1.0, oxlint 1.83.0)
│   ├── package-lock.json          árvore exata de dependências (usada pelo npm ci)
│   ├── vitest.config.js           configuração do Vitest
│   ├── .oxlintrc.json             configuração do oxlint (cópia da do frontend)
│   ├── testes/
│   │   ├── validacao-produto.test.js          T1: particionamento de equivalência
│   │   └── validacao-produto-limites.test.js  T2: análise de valor-limite
│   ├── evidencias/                saídas desta versão
│   └── issue-componente/          relatório do teste de componente (T1)
└── TCC-Claude/
    └── frontend/                  código do commit a0d2ff9 (sem node_modules)
        └── src/utils/productValidation.js     função testada
```

A pasta `TCC-Claude/frontend` é só o frontend do commit. O backend não vem no pacote porque não participa do teste. Quem preferir pode usar um clone do repositório no lugar dela, com o commit `a0d2ff9` em checkout: basta que a pasta do clone se chame `TCC-Claude` e fique ao lado da `Muriel`. Só o subdiretório `TCC-Claude` do repositório é usado.

## Regras do item testado

| Campo | Obrigatório | Regra | Mensagem |
|---|---|---|---|
| `nome` | sim | não vazio, nem só espaços | `Nome é obrigatório.` |
| `quantidade` | sim | não vazia; número maior que zero | `Quantidade é obrigatória.` / `Quantidade deve ser um número maior que zero.` |
| `unidade` | sim | não vazia | `Unidade é obrigatória.` |
| `categoria`, `fornecedor`, `codigo_barras` | não | sem validação | n/a |

Retorno: `{}` quando válido; `{ campo: mensagem }` quando há erro.

### Precisão da quantidade (base para os valores-limite)

| Onde | O que define | Fonte |
|---|---|---|
| Função `validarProduto` | converte com `parseFloat` e rejeita `qty <= 0`. Não arredonda nem limita casas decimais | `productValidation.js` |
| Campo do formulário | aceita só dígitos e um ponto, com qualquer número de casas decimais (regex `/^\d*\.?\d*$/`) | `AddProductModal.jsx`, linha 559 |
| Banco de dados | guarda a quantidade com 4 casas decimais (`DecimalField(max_digits=18, decimal_places=4)`) | `backend-django/api/models.py`, linha 29, no repositório |

A função sozinha não tem um passo mínimo: qualquer número positivo é aceito. O menor passo que o sistema realmente guarda é o do banco, `0.0001`. Por isso:

- **`0.0001`** (CT-07) é o valor logo acima do limite, e **`-0.0001`** (CT-13) é o valor logo abaixo, na precisão do banco.
- **`0.01`** (CT-08) e **`-0.01`** (CT-14) ficam como valores próximos do limite no passo de centésimos, que é o caso comum em unidades fracionadas (ex.: 0,01 KG). Na versão anterior, `0.01` era chamado de "logo acima do limite" sem essa justificativa. Agora o vizinho imediato é `0.0001` e `0.01` foi mantido como valor próximo.
- Valores com mais de 4 casas (ex.: `0.00001`) passam na validação, mas o banco arredondaria. Esse comportamento envolve o banco e fica fora do escopo (ver "Limites da análise").

A precisão do banco foi tirada do modelo Django do repositório (`managed = False`, que espelha a tabela existente). O banco em execução não foi consultado.

## Técnicas e ferramentas

| # | Técnica / conceito | Tipo | Ferramenta | Arquivo |
|---|---|---|---|---|
| T1 | Particionamento de equivalência | dinâmico automatizado | Vitest 5.1.0 | `testes/validacao-produto.test.js` |
| T2 | Análise de valor-limite (limite: quantidade > 0) | dinâmico automatizado | Vitest 5.1.0 | `testes/validacao-produto-limites.test.js` |
| T3 | Análise estática de código | estático | oxlint 1.83.0 | `.oxlintrc.json` (cópia da configuração do frontend) |

Configurações: `vitest.config.js` (ambiente `node`, procura `testes/**/*.test.js`), `.oxlintrc.json` e `package.json` (scripts e versões fixas das ferramentas). O `package-lock.json` fixa a árvore inteira de dependências.

Teste dinâmico automatizado: o Vitest executa a função real `validarProduto` com dados de entrada e compara o retorno com o esperado por `expect(...).toEqual(...)`, sem intervenção manual. O nome de cada teste começa pelo ID do caso (CT-xx), então a saída do Vitest pode ser ligada direto às tabelas abaixo.

## Casos de teste

Todos os casos usam os campos não citados com valores válidos (`nome: "Arroz Branco 5kg"`, `quantidade: "10"`, `unidade: "UN"`).

### T1: particionamento de equivalência

| ID | Classe | Entrada | Esperado | Obtido | Status |
|---|---|---|---|---|---|
| CT-01 | 1: todos válidos | produto completo | `{}` | `{}` | passou |
| CT-02 | 1: todos válidos | só os 3 obrigatórios, opcionais vazios | `{}` | `{}` | passou |
| CT-03 | 2: obrigatório vazio | `nome: ""` | `{ nome: "Nome é obrigatório." }` | igual | passou |
| CT-04 | 2: obrigatório vazio | `nome: "   "` | `{ nome: "Nome é obrigatório." }` | igual | passou |
| CT-05 | 2: obrigatório vazio | `quantidade: ""` | `{ quantidade: "Quantidade é obrigatória." }` | igual | passou |
| CT-06 | 2: obrigatório vazio | `unidade: ""` | `{ unidade: "Unidade é obrigatória." }` | igual | passou |

### T2: análise de valor-limite (quantidade)

| ID | Valor | Posição | Esperado | Obtido | Status |
|---|---|---|---|---|---|
| CT-07 | `"0.0001"` | logo acima do limite (precisão do banco) | aceita (`{}`) | `{}` | passou |
| CT-08 | `"0.01"` | próximo do limite (centésimos) | aceita (`{}`) | `{}` | passou |
| CT-09 | `"1"` | valor típico | aceita (`{}`) | `{}` | passou |
| CT-10 | `"1000.5"` | decimal grande | aceita (`{}`) | `{}` | passou |
| CT-11 | `"0"` | no limite | rejeita (valor inválido) | `{ quantidade: "Quantidade deve ser um número maior que zero." }` | passou |
| CT-12 | `"0.0"` | zero decimal | rejeita (valor inválido) | igual | passou |
| CT-13 | `"-0.0001"` | logo abaixo do limite (precisão do banco) | rejeita (valor inválido) | igual | passou |
| CT-14 | `"-0.01"` | abaixo do limite (centésimos) | rejeita (valor inválido) | igual | passou |
| CT-15 | `"-1"` | negativo | rejeita (valor inválido) | igual | passou |
| CT-16 | `"abc"` | não numérico | rejeita (valor inválido) | igual | passou |
| CT-17 | `"   "` | só espaços | rejeita (obrigatória) | `{ quantidade: "Quantidade é obrigatória." }` | passou |
| CT-18 | nome `""`, quantidade `"0"`, unidade `""` | vários inválidos | os 3 erros juntos | os 3 erros | passou |

### T3: análise estática

| ID | Escopo | Esperado | Obtido | Status |
|---|---|---|---|---|
| CT-19 | `productValidation.js` e os 2 arquivos de teste (3 arquivos, 104 regras) | 0 problemas | 0 problemas, exit code 0 | passou |
| CT-20 | código-fonte inteiro do frontend (`TCC-Claude/frontend/src`) | sem erros | 0 erros e 17 avisos em 8 arquivos de componentes, páginas, contexto e utilitários (hooks e variáveis não usadas), nenhum em `productValidation.js` nem nos testes; exit code 0 | sem erros; avisos registrados |

## Resultado geral

- Vitest: 2 arquivos, 18 testes, 18 passaram, 0 falharam, exit code 0 (`evidencias/vitest-verbose.txt`, `evidencias/vitest-resultados.json`).
- oxlint: 0 problemas no módulo testado; 17 avisos e 0 erros no frontend inteiro, todos fora do módulo testado.

### Sensibilidade dos testes (defeito injetado)

Para mostrar que os testes detectam defeito, a função do pacote foi alterada temporariamente e restaurada em seguida. Depois da restauração o hash voltou a ser igual ao do commit (`c22cacf7d54d3ce75f8262420b83bf3f554bc84f`).

| Defeito injetado | Resultado | Testes que falharam | Evidência |
|---|---|---|---|
| A: validação do `nome` removida (`if (false) e.nome...`) | 3 falharam, 15 passaram | CT-03, CT-04, CT-18 | `evidencias/vitest-defeito-A-nome.txt` |
| B: limite trocado de `qty <= 0` para `qty < 0` (erro de um) | 3 falharam, 15 passaram | CT-11, CT-12, CT-18 | `evidencias/vitest-defeito-B-limite.txt` |

O defeito B só é pego pela análise de valor-limite (os testes com quantidade `0`), o que justifica a segunda técnica.

## Passos para repetir

Pré-requisitos: Node.js v24.x e npm (a execução registrada usou Node v24.21.0 e npm 12.0.2). Não é preciso instalar as dependências do frontend nem subir backend ou banco.

1. Descompactar o pacote e conferir a estrutura: `Muriel` e `TCC-Claude` lado a lado (ver "Estrutura do pacote"). Todos os comandos abaixo rodam **dentro da pasta `Muriel`**, não dentro do frontend.
   ```bash
   cd entrega-v2/Muriel
   ```
2. Instalar as ferramentas com as versões exatas do `package-lock.json`:
   ```bash
   npm ci
   ```
   O `npm ci` apaga a `node_modules` (se existir) e instala exatamente o que está no lock, sem alterar o `package-lock.json`. Esperado: `found 0 vulnerabilities` (`evidencias/npm-ci.txt`).
3. Executar os testes dinâmicos (T1 e T2):
   ```bash
   npm test
   npm run test:verbose
   ```
   Esperado: `Test Files 2 passed (2)` e `Tests 18 passed (18)`.
   Só o teste de componente da issue (T1): `npx vitest run testes/validacao-produto.test.js --reporter=verbose` (esperado: `Tests 6 passed (6)`).
   Relatório JSON: `npx vitest run --reporter=json --outputFile=evidencias/vitest-resultados.json`.
4. Executar a análise estática (T3):
   ```bash
   npm run lint:modulo
   npm run lint:projeto
   ```
   Esperado: o primeiro sem nenhum aviso e com exit code 0; o segundo com 17 avisos, 0 erros e exit code 0. Os dois scripts sobem uma pasta (`cd ..`) e passam caminhos `Muriel/...` e `TCC-Claude/...`, por isso dependem da estrutura lado a lado.
5. Repetir a verificação de sensibilidade (opcional): em `TCC-Claude/frontend/src/utils/productValidation.js`, trocar `qty <= 0` por `qty < 0`, rodar `npm test` na `Muriel` (esperado: 3 falhas, CT-11, CT-12 e CT-18) e desfazer a alteração.

## Limites da análise

O que estes testes verificam: só o comportamento da função `validarProduto` isolada, chamada direto com objetos JavaScript, no ambiente `node` do Vitest.

O que **não** verificam:

- **Interface (React/navegador):** o formulário `AddProductModal` não é renderizado. Não é testado se a mensagem aparece na tela, se o botão bloqueia o envio nem o filtro do campo quantidade (regex `/^\d*\.?\d*$/`). Esse filtro impede que se digite `-` ou letras, então os valores `-0.0001`, `-0.01`, `-1` e `abc` só chegam à função quando ela é chamada direto, como nos testes. Eles conferem a regra da função, não o que o usuário consegue digitar.
- **Integração com o componente:** a análise estática confere que o arquivo não tem problemas, e o commit mostra o `AddProductModal` importando `validarProduto`, mas nenhum teste executa o `handleManualSubmit`.
- **API (backend Django):** a requisição de cadastro e a validação que o backend faz por conta própria não são exercitadas. O backend pode aceitar ou recusar dados de forma diferente da função do frontend.
- **Banco de dados:** não há gravação. O arredondamento para 4 casas decimais e os limites do `DecimalField(18,4)` não são testados; a precisão foi só usada como referência para escolher os valores-limite.
- **Tipos de entrada:** os testes usam sempre strings, como o formulário envia. Campos `undefined`, `null` ou números não fazem parte dos casos (a função chamaria `.trim()` e lançaria erro, mas o formulário nunca envia esses tipos).
- **Ambiente:** uma execução em Windows 11 com Node v24.21.0. Não foi repetida em outros sistemas ou versões de Node.

## Evidências (pasta `evidencias/`)

Todas geradas nesta versão (2026-11-14, a partir de 20:12), com o código do commit `a0d2ff9`. Cada `.txt` começa com o comando, a pasta e a data/hora e termina com o exit code.

| Arquivo | Conteúdo |
|---|---|
| [`evidencias/npm-ci.txt`](evidencias/npm-ci.txt) | instalação das ferramentas com `npm ci` |
| [`evidencias/vitest-verbose.txt`](evidencias/vitest-verbose.txt) | saída completa dos 18 testes |
| [`evidencias/vitest-resultados.json`](evidencias/vitest-resultados.json) | relatório do Vitest em JSON (18 de 18 passaram) |
| [`evidencias/vitest-defeito-A-nome.txt`](evidencias/vitest-defeito-A-nome.txt) | execução com o defeito A (3 falhas), com o diff aplicado |
| [`evidencias/vitest-defeito-B-limite.txt`](evidencias/vitest-defeito-B-limite.txt) | execução com o defeito B (3 falhas), com o diff aplicado |
| [`evidencias/oxlint-modulo-testado.txt`](evidencias/oxlint-modulo-testado.txt) | análise estática do módulo testado (0 problemas) |
| [`evidencias/oxlint-modulo-testado.json`](evidencias/oxlint-modulo-testado.json) | o mesmo em JSON (0 diagnósticos, 3 arquivos, 104 regras) |
| [`evidencias/oxlint-projeto-inteiro.txt`](evidencias/oxlint-projeto-inteiro.txt) | análise estática do frontend inteiro (17 avisos, 0 erros) |
| [`evidencias/ambiente.txt`](evidencias/ambiente.txt) | commit, conferência de hash pacote x commit, versões, sistema operacional e condições |

O relatório do teste de componente (só T1, 6 testes) está em [`issue-componente/RELATORIO_TESTE_COMPONENTE.md`](issue-componente/RELATORIO_TESTE_COMPONENTE.md), com a saída em [`issue-componente/resultado-vitest.txt`](issue-componente/resultado-vitest.txt).

## Condições da execução

Windows 11 Pro 10.0.26200 (64 bits), Node.js v24.21.0, npm 12.0.2, Vitest 5.1.0, oxlint 1.83.0, Vite 8.3.8 (usado internamente pelo Vitest).
Ambiente do Vitest: `node`, sem navegador/DOM. Sem backend, banco de dados, rede ou variáveis de ambiente. Dados de teste criados nos próprios arquivos de teste.
