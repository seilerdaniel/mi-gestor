import { z } from 'zod';

const esquema = z.object({
  DATABASE_URL: z.string().min(1).default('file:./mi-gestor.db'),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Entorno = z.infer<typeof esquema>;

export function cargarEntorno(): Entorno {
  const resultado = esquema.safeParse(process.env);
  if (!resultado.success) {
    console.error('Variables de entorno inválidas:', resultado.error.flatten().fieldErrors);
    throw new Error('Configuración de entorno inválida');
  }
  return resultado.data;
}

export const entorno = cargarEntorno();
