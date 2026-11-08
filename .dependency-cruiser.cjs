/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-no-importa-modules',
      severity: 'error',
      comment: 'core/ no puede depender de modules/.',
      from: { path: '^core/' },
      to: { path: '^modules/' },
    },
    {
      name: 'core-no-importa-ui',
      severity: 'error',
      comment: 'core/ no puede depender de ui/.',
      from: { path: '^core/' },
      to: { path: '^ui/' },
    },
    {
      name: 'finanzas-no-importa-compras',
      severity: 'error',
      comment: 'Los módulos se comunican por eventos del core, no por imports directos.',
      from: { path: '^modules/finanzas/' },
      to: { path: '^modules/compras/' },
    },
    {
      name: 'compras-no-importa-finanzas',
      severity: 'error',
      comment: 'Los módulos se comunican por eventos del core, no por imports directos.',
      from: { path: '^modules/compras/' },
      to: { path: '^modules/finanzas/' },
    },
    {
      name: 'ui-no-importa-servidor',
      severity: 'error',
      comment: 'ui/ solo consume la API HTTP.',
      from: { path: '^ui/' },
      to: { path: '^(core|app|scripts)/' },
    },
    {
      name: 'ui-solo-contratos-de-modulos',
      severity: 'error',
      comment: 'ui/ solo puede importar contracts/ de cada módulo.',
      from: { path: '^ui/' },
      to: { path: '^modules/(finanzas|compras)/(domain|services|repositories|routes)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: 'node_modules|dist|coverage|\\.tmp|core/db/generated' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
