import { describe, it, expect } from 'vitest';
import { validarProduto } from '../../TCC-Claude/frontend/src/utils/productValidation.js';

// Teste de componente (unidade isolada): validarProduto.
// Técnica: análise de valor-limite sobre a regra "quantidade deve ser maior que zero".
// O limite é 0 (exclusivo): 0 e abaixo rejeitam; acima de 0 aceita.
//
// Precisão usada para escolher os vizinhos do limite:
//   - a função não arredonda (parseFloat + qty <= 0), então não define um passo próprio;
//   - o campo do formulário aceita qualquer quantidade de casas decimais (regex /^\d*\.?\d*$/);
//   - o banco guarda a quantidade com 4 casas decimais (DecimalField max_digits=18, decimal_places=4
//     em backend-django/api/models.py).
// Por isso o passo considerado é 0.0001: 0.0001 é o menor valor positivo que o sistema guarda
// e -0.0001 é o vizinho logo abaixo. 0.01 e -0.01 ficam como valores próximos do limite
// no passo de centésimos (ex.: 0,01 KG).

const base = { nome: 'Arroz Branco 5kg', unidade: 'UN', categoria: '', fornecedor: '', codigo_barras: '' };
const MSG_QTD_INVALIDA = 'Quantidade deve ser um número maior que zero.';

describe('validarProduto: valores-limite da quantidade', () => {
  it.each([
    ['CT-07', '0.0001 (logo acima do limite, na precisão do banco)', '0.0001'],
    ['CT-08', '0.01 (próximo do limite, passo de centésimos)', '0.01'],
    ['CT-09', '1 (valor típico)', '1'],
    ['CT-10', '1000.5 (decimal grande)', '1000.5'],
  ])('%s aceita quantidade %s', (_id, _descricao, quantidade) => {
    expect(validarProduto({ ...base, quantidade })).toEqual({});
  });

  it.each([
    ['CT-11', '0 (no limite)', '0'],
    ['CT-12', '0.0 (zero decimal)', '0.0'],
    ['CT-13', '-0.0001 (logo abaixo do limite, na precisão do banco)', '-0.0001'],
    ['CT-14', '-0.01 (abaixo do limite, passo de centésimos)', '-0.01'],
    ['CT-15', '-1 (negativo)', '-1'],
    ['CT-16', 'abc (não numérico)', 'abc'],
  ])('%s rejeita quantidade %s com mensagem de valor inválido', (_id, _descricao, quantidade) => {
    expect(validarProduto({ ...base, quantidade })).toEqual({ quantidade: MSG_QTD_INVALIDA });
  });

  it('CT-17 trata quantidade só com espaços como campo vazio (obrigatória)', () => {
    expect(validarProduto({ ...base, quantidade: '   ' })).toEqual({ quantidade: 'Quantidade é obrigatória.' });
  });

  it('CT-18 acumula os erros quando vários campos obrigatórios estão inválidos', () => {
    expect(validarProduto({ ...base, nome: '', quantidade: '0', unidade: '' })).toEqual({
      nome: 'Nome é obrigatório.',
      quantidade: MSG_QTD_INVALIDA,
      unidade: 'Unidade é obrigatória.',
    });
  });
});
