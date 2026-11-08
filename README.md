# Mi Gestor

App personal unificada de Finanzas y Compras. Un login, una base SQLite, dos módulos desacoplados
y un puente explícito entre ellos.

## Requisitos

- Node >= 24
- npm

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completá SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD
npm run db:migrate
npm run db:seed
npm run dev
```

- API: http://localhost:3000
- UI: http://localhost:5173

## Comandos

```bash
npm run check      # typecheck + lint + fronteras + tests
npm run build
npm start
```

Ver `AGENTS.md` para reglas de negocio, fronteras modulares y convenciones.
