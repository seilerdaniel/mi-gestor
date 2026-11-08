# AGENTS.md — Mi Gestor

App personal unificada de **Finanzas** y **Compras**. Un solo login, una sola base de datos,
módulos desacoplados y un puente explícito entre ellos.

## Stack (bloqueado)

- TypeScript ESM estricto, Node >= 24
- Fastify + Zod
- SQLite + Prisma 7 (`prisma-client` + `@prisma/adapter-better-sqlite3`)
- React + Vite + TanStack Query + Tailwind
- Vitest + dependency-cruiser + date-fns-tz

No cambiar de stack sin pedido explícito.

## Layout

- `app/`: composition root. Único lugar que importa ambos módulos y los cablea.
- `core/`: auth, config, db, eventos, http, settings, notificaciones.
- `modules/finanzas`: ingresos, gastos, deudas, suscripciones, ahorros.
- `modules/compras`: wishlist, prioridades P0–P5, metas.
- `modules/comunes`: dinero, fechas, quincena, formato, categorías.
- `ui/`: home, finanzas, compras.
- `imports/`: fuentes de datos crudas por módulo.
- `scripts/`: seeds idempotentes.

## Fronteras (el build falla si se violan)

- `core/` NO importa `modules/` ni `ui/`.
- `modules/finanzas` y `modules/compras` NO se importan entre sí.
- Ambos pueden importar `core/` y `modules/comunes/`.
- `app/` importa todo y cablea eventos. Es el único composition root.
- `ui/` solo importa `modules/*/contracts` y sus propios archivos.
  Nunca `core/`, `modules/*/services`, `modules/*/domain` ni Prisma.

## Reglas de negocio (no negociables)

1. `Transaction` (dinero movido) ≠ `PurchaseItem` (artículo deseado). Tablas separadas, sin excepciones.
2. `Transaction.tipo`: `ingreso | gasto | transferencia | ajuste`. La deuda contraída vive solo en `Debt`;
   al pagarla se genera una `Transaction` de gasto. `ajuste` cubre condonaciones y correcciones.
3. Al marcar un `PurchaseItem` como `comprado`: se crea una `Transaction` de gasto y se debita el
   `SavingsGoal` canónico **Fondo Compras**. Operación atómica e idempotente por `(origenTipo, origenId)`.
4. Una sola meta de compra `activo` por quincena. El resto queda `pendiente` o `bloqueado`.
5. `P5` siempre `bloqueado`. No se activa nunca. Doble barrera: CHECK en DB + servicio + test.
6. Steam, suscripciones, ocio y mascotas viven solo en Finanzas. En Compras, como referencia P5 bloqueada.
7. Psicóloga: fuente de verdad `RecurringItem`.
   - `RecurringItem.externalId = 'psicologa'`.
   - Cuando un mes queda impago: `Debt.externalId = 'psicologa-YYYY-MM'`, `Debt.periodo = 'YYYY-MM'`.
   - `@@unique([usuarioId, acreedor, periodo])` impide dos deudas del mismo acreedor y mes.
   - Nunca `RecurringItem` y `Debt` activos en el mismo período.
8. Montos desconocidos: `montoTexto = "pendiente"` y estado `pendiente`. Nunca inventar cifras.
9. Todo seed/import usa `externalId` estable + `upsert`. Reimportar no duplica.
10. "Fondo Compras" y "Fondo compras Depa" son el mismo sobre. Nombre canónico: **Fondo Compras**.

## Convenciones

- Modelos y tablas en inglés (contrato aprobado). Campos, funciones de dominio, comentarios y UI en español.
- Montos: enteros en centavos. Prohibido `float`/`number` decimal para dinero.
- Fechas de calendario: string `YYYY-MM-DD` en hora argentina. Instantes: `DateTime` UTC.
- `quincena`: `YYYY-Q1` / `YYYY-Q2`, calculada solo por `modules/comunes/quincena.ts`.
  Nunca se acepta desde el cliente.
- Zona horaria de cálculo: `America/Argentina/Buenos_Aires`.
- Tests obligatorios para cada regla de negocio.
- Sin commits ni push sin pedido explícito.

## Gotcha ESM + Prisma 7

Prisma 7 es ESM puro. Todo import relativo del servidor lleva extensión `.js`, incluido el cliente
generado (`from './generated/client.js'`; verificá el entry real en `core/db/generated/` antes de
importar). `tsconfig.json` usa `module: NodeNext` y `moduleResolution: NodeNext`.
Verificar con `npm run dev:api` antes de dar por cerrada cualquier fase.

## Gotcha de seed: la contraseña del admin no rota

`User` no tiene columna `externalId`, así que el seed lo upsertea por `email` con `update: {}`:

```ts
await prisma.user.upsert({ where: { email }, update: {}, create: { email, passwordHash, nombre } });
```

Consecuencia: **si el usuario ya existe, `SEED_ADMIN_PASSWORD` se ignora**. Cambiar la clave en
`.env` y volver a correr `npm run db:seed` NO actualiza el `passwordHash`. El seed es idempotente
justamente por eso, pero para rotar la clave hoy hay que borrar el usuario o hacer un update
explícito. No hay flag para forzar la rotación: no lo agregues sin pedirlo.

Las entidades de negocio (`Category`, `Holiday`, etc.) sí usan `externalId` estable + `upsert`,
que es la regla 9. `User` es la excepción porque es el admin del sistema, no un dato importado.

## Comandos

| Comando              | Qué hace                                 |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | API + Vite en paralelo                   |
| `npm run dev:api`    | Fastify con recarga                      |
| `npm run dev:ui`     | Vite                                     |
| `npm run build`      | `tsc` + `vite build`                     |
| `npm start`          | servidor sobre `dist/`                   |
| `npm run typecheck`  | `tsc --noEmit` (servidor + UI)           |
| `npm run lint`       | ESLint                                   |
| `npm run format`     | Prettier                                 |
| `npm run boundaries` | dependency-cruiser                       |
| `npm test`           | Vitest                                   |
| `npm run db:migrate` | `prisma migrate dev` + `prisma generate` |
| `npm run db:seed`    | seed idempotente                         |
| `npm run check`      | typecheck + lint + boundaries + tests    |

## Definición de terminado

`npm run check` en verde y la regla de negocio cubierta por un test.
