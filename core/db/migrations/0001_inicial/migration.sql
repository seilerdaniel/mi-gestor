-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "locale" TEXT NOT NULL DEFAULT 'es-AR',
    "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    "topeOcioCentavos" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Holiday" (
    "fecha" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "padreId" TEXT,
    "externalId" TEXT NOT NULL,
    CONSTRAINT "Category_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "externalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "cuentaId" TEXT,
    "tipo" TEXT NOT NULL,
    "montoCentavos" INTEGER NOT NULL,
    "fecha" TEXT NOT NULL,
    "quincena" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoriaId" TEXT,
    "origenTipo" TEXT,
    "origenId" TEXT,
    "externalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecurringItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "frecuencia" TEXT NOT NULL,
    "montoCentavos" INTEGER,
    "montoTexto" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "diaDePago" INTEGER,
    "desde" TEXT NOT NULL,
    "hasta" TEXT,
    "categoriaId" TEXT,
    "externalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RecurringItem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecurringItem_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "recurring_item_monto_valido" CHECK ("montoCentavos" IS NOT NULL OR "montoTexto" IS 'pendiente')
);

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "acreedor" TEXT NOT NULL,
    "montoCentavos" INTEGER,
    "montoTexto" TEXT,
    "vencimiento" TEXT,
    "periodo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "nota" TEXT,
    "externalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Debt_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "debt_monto_valido" CHECK ("montoCentavos" IS NOT NULL OR "montoTexto" IS 'pendiente')
);

-- CreateTable
CREATE TABLE "SavingsGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "montoObjetivoCentavos" INTEGER,
    "montoObjetivoTexto" TEXT,
    "montoActualCentavos" INTEGER NOT NULL DEFAULT 0,
    "aporteCentavos" INTEGER,
    "frecuenciaAporte" TEXT NOT NULL DEFAULT 'quincenal',
    "padreId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "externalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavingsGoal_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavingsGoal_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "SavingsGoal" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "savings_goal_monto_valido" CHECK ("montoObjetivoCentavos" IS NOT NULL OR "montoObjetivoTexto" IS 'pendiente')
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "prioridad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "precioEstimadoCentavos" INTEGER,
    "precioEstimadoTexto" TEXT,
    "link" TEXT,
    "nota" TEXT,
    "categoriaId" TEXT,
    "linkedGoalId" TEXT,
    "quincena" TEXT,
    "compradoEn" TEXT,
    "externalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseItem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PurchaseItem_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PurchaseItem_linkedGoalId_fkey" FOREIGN KEY ("linkedGoalId") REFERENCES "SavingsGoal" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "purchase_item_monto_valido" CHECK ("precioEstimadoCentavos" IS NOT NULL OR "precioEstimadoTexto" IS 'pendiente'),
    CONSTRAINT "purchase_item_p5_bloqueado" CHECK ("prioridad" <> 'P5' OR "estado" = 'bloqueado'),
    CONSTRAINT "purchase_item_activo_con_quincena" CHECK ("estado" <> 'activo' OR "quincena" IS NOT NULL)
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_usuarioId_idx" ON "Session"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_externalId_key" ON "Holiday"("externalId");

-- CreateIndex
CREATE INDEX "Holiday_anio_idx" ON "Holiday"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "Category_externalId_key" ON "Category"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_padreId_nombre_key" ON "Category"("padreId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Account_externalId_key" ON "Account"("externalId");

-- CreateIndex
CREATE INDEX "Account_usuarioId_idx" ON "Account"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_externalId_key" ON "Transaction"("externalId");

-- CreateIndex
CREATE INDEX "Transaction_usuarioId_fecha_idx" ON "Transaction"("usuarioId", "fecha");

-- CreateIndex
CREATE INDEX "Transaction_usuarioId_quincena_idx" ON "Transaction"("usuarioId", "quincena");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_origenTipo_origenId_key" ON "Transaction"("origenTipo", "origenId");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringItem_externalId_key" ON "RecurringItem"("externalId");

-- CreateIndex
CREATE INDEX "RecurringItem_usuarioId_tipo_idx" ON "RecurringItem"("usuarioId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Debt_externalId_key" ON "Debt"("externalId");

-- CreateIndex
CREATE INDEX "Debt_usuarioId_estado_idx" ON "Debt"("usuarioId", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "Debt_usuarioId_acreedor_periodo_key" ON "Debt"("usuarioId", "acreedor", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "SavingsGoal_externalId_key" ON "SavingsGoal"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingsGoal_usuarioId_nombre_key" ON "SavingsGoal"("usuarioId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseItem_externalId_key" ON "PurchaseItem"("externalId");

-- CreateIndex
CREATE INDEX "PurchaseItem_usuarioId_prioridad_idx" ON "PurchaseItem"("usuarioId", "prioridad");

-- CreateIndex
CREATE INDEX "PurchaseItem_usuarioId_estado_idx" ON "PurchaseItem"("usuarioId", "estado");

-- Regla de negocio: una sola meta de compra activa por quincena.
-- Prisma no soporta índices parciales en PSL, por eso va en SQL crudo.
CREATE UNIQUE INDEX "purchase_item_meta_activa_por_quincena"
    ON "PurchaseItem" ("usuarioId", "quincena")
    WHERE "estado" = 'activo';
