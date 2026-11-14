import { describe, it, expect } from 'vitest';
import { validarProduto } from '../../TCC-Claude/frontend/src/utils/productValidation.js';

// Teste de componente (unidade isolada): validarProduto, usada pelo cadastro manual de produto.
// Importa o arquivo real do projeto (commit a0d2ff93b1b0a415d77b472a50cee80880939bad).
// Campos obrigatórios: nome, quantidade (> 0) e unidade.
//
// Particionamento de equivalência:
//   Classe 1 - todos os campos obrigatórios preenchidos e válidos  -> aceita  ({})
//   Classe 2 - um campo obrigatório vazio                          -> rejeita (erro no campo vazio)

const produtoValido = {
  nome: 'Arroz Branco 5kg',
  quantidade: '10',
  unidade: 'UN',
  categoria: 'Grãos',
  fornecedor: 'Fornecedor X',
  codigo_barras: '7891000100103',
};

describe('validarProduto', () => {
  describe('Classe 1: todos os campos obrigatórios válidos', () => {
    it('CT-01 aceita o produto (nenhum erro)', () => {
      expect(validarProduto(produtoValido)).toEqual({});
    });

    it('CT-02 aceita o produto sem os campos opcionais', () => {
      const form = { nome: 'Arroz', quantidade: '1', unidade: 'KG', categoria: '', fornecedor: '', codigo_barras: '' };
      expect(validarProduto(form)).toEqual({});
    });
  });

  describe('Classe 2: um campo obrigatório vazio', () => {
    it.each([
      ['CT-03', 'o campo nome vazio', { nome: '' }, { nome: 'Nome é obrigatório.' }],
      ['CT-04', 'o campo nome só com espaços', { nome: '   ' }, { nome: 'Nome é obrigatório.' }],
      ['CT-05', 'o campo quantidade vazio', { quantidade: '' }, { quantidade: 'Quantidade é obrigatória.' }],
      ['CT-06', 'o campo unidade vazio', { unidade: '' }, { unidade: 'Unidade é obrigatória.' }],
    ])('%s rejeita o produto com %s', (_id, _descricao, alteracao, esperado) => {
      expect(validarProduto({ ...produtoValido, ...alteracao })).toEqual(esperado);
    });
  });
});
