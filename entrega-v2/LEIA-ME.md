# Entrega v2: testes de validação de produto (StockFlow)

- **Commit testado:** `a0d2ff93b1b0a415d77b472a50cee80880939bad` (branch `testes-validacao-produto`, incorporado ao `main` pelo merge `3053d80`)
  https://github.com/Pansera13/TCC/commit/a0d2ff93b1b0a415d77b472a50cee80880939bad
- **Ficha:** [`Muriel/FICHA_DE_TESTE.md`](Muriel/FICHA_DE_TESTE.md)
- **Relatório do teste de componente:** [`Muriel/issue-componente/RELATORIO_TESTE_COMPONENTE.md`](Muriel/issue-componente/RELATORIO_TESTE_COMPONENTE.md)

## Como executar

As pastas `Muriel` e `TCC-Claude` precisam ficar lado a lado (o pacote já vem assim). Os comandos rodam dentro de `Muriel`:

```bash
cd Muriel
npm ci
npm run test:verbose
npm run lint:modulo
npm run lint:projeto
```

Esperado: 18 de 18 testes passando; `lint:modulo` sem problemas; `lint:projeto` com 17 avisos e 0 erros, nenhum no módulo testado.

## O que mudou em relação à versão anterior

| # | Pedido | O que foi feito |
|---|---|---|
| 1 | Incluir ou publicar o código realmente testado | As duas coisas. O pacote traz `TCC-Claude/frontend`, extraído do commit com `git archive`, e é desse arquivo que os testes importam a função. O mesmo código está publicado no GitHub no commit acima. O hash do arquivo testado é igual no pacote e no commit (`Muriel/evidencias/ambiente.txt`). A pasta `codigo-testado`, que os testes não usavam, foi removida. |
| 2 | Atualizar o commit | Commit novo `a0d2ff9` com `productValidation.js` (função extraída) e `AddProductModal.jsx` usando a função. A ficha, o relatório e o `ambiente.txt` informam esse commit. |
| 3 | Instruções de execução | A ficha agora diz que os comandos rodam em `Muriel` (não no frontend), mostra a estrutura de pastas e usa `npm ci`. |
| 4 | Arquivos referenciados | `evidencias/ambiente.txt` incluído. Todos os caminhos citados na ficha e no relatório foram conferidos contra os arquivos entregues (relatórios de defeitos em `Muriel/evidencias/vitest-defeito-A-nome.txt` e `vitest-defeito-B-limite.txt`; relatório de componente em `Muriel/issue-componente/RELATORIO_TESTE_COMPONENTE.md`). |
| 5 | Limites e precisão da quantidade | Nova seção "Limites da análise" (sem interface, API ou banco). Nova subseção "Precisão da quantidade": a função não arredonda, o campo aceita qualquer número de casas e o banco guarda 4 casas. Por isso foram incluídos `0.0001` e `-0.0001` como vizinhos imediatos do limite, e `0.01` ficou como valor próximo no passo de centésimos. Agora são 18 testes (antes 16). |

Todos os resultados em `Muriel/evidencias/` e `Muriel/issue-componente/resultado-vitest.txt` foram gerados de novo nesta versão.
