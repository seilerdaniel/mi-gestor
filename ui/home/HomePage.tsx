import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

type Health = { ok: boolean; servicio: string; version: string };

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => api<Health>('/health'),
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Panel unificado</h1>
        <p className="mt-1 text-sm text-slate-500">
          Finanzas y Compras en un solo lugar. El puente entre módulos se cablea en la Fase 4.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-medium">Finanzas</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresos, gastos, deudas, suscripciones y ahorros. Fase 2.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-medium">Compras</h2>
          <p className="mt-2 text-sm text-slate-500">
            Wishlist P0–P5, una meta activa por quincena. Fase 3.
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-medium">Estado de la API</h2>
        {isLoading && <p className="mt-2 text-slate-500">Consultando…</p>}
        {error && <p className="mt-2 text-red-600">{error.message}</p>}
        {data && (
          <p className="mt-2 text-emerald-600 dark:text-emerald-400">
            {data.servicio} v{data.version}: OK
          </p>
        )}
      </div>
    </section>
  );
}
