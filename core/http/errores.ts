import type { FastifyError, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

export class ErrorHttp extends Error {
  constructor(
    public readonly estado: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorHttp';
  }
}

export function registrarManejadorDeErrores(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, _req, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: 'Datos inválidos', detalles: error.flatten() });
    }

    if (error instanceof ErrorHttp) {
      return reply.status(error.estado).send({ error: error.message });
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ error: error.message });
    }

    app.log.error(error);
    return reply.status(500).send({ error: 'Error interno' });
  });
}
