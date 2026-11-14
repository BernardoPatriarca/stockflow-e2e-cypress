import { defineConfig } from 'vitest/config'

// Configuração própria dos testes: a função testada é JavaScript puro,
// então não precisa dos plugins React/Tailwind/SSL do Vite nem de DOM.
// Os testes importam a função real do projeto, que está na pasta vizinha
// ../TCC-Claude/frontend/src/utils/productValidation.js (mesmo conteúdo do commit a0d2ff9).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['testes/**/*.test.js'],
  },
})
