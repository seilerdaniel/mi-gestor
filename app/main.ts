import { entorno } from '../core/config/env.js';
import { construirServidor } from '../core/http/servidor.js';
import { cablearModulos } from './wiring.js';

const app = await construirServidor();
await cablearModulos(app);

await app.listen({ port: entorno.PORT, host: '0.0.0.0' });
