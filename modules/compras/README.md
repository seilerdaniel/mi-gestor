# modules/compras

Wishlist, prioridades P0–P5 y metas de compra.

**Estado:** Fase 1 solo reserva el espacio. La implementación llega en la Fase 3.

Reglas que este módulo deberá respetar:

- `PurchaseItem` (artículo deseado) ≠ `Transaction` (dinero movido).
- `P5` siempre `bloqueado`. Doble barrera: CHECK en DB + servicio + test.
- Una sola meta de compra `activo` por quincena; el resto queda `pendiente` o `bloqueado`.
- Al marcar `comprado`: se crea una `Transaction` de gasto y se debita **Fondo Compras**.
  Esa coordinación la cablea `app/` vía eventos del core, nunca un import directo a Finanzas.

Este módulo no importa `modules/finanzas` ni `core/` fuera de lo permitido por
`.dependency-cruiser.cjs`.
