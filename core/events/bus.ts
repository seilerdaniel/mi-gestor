export type Manejador<T> = (evento: T) => void | Promise<void>;

export class BusDeEventos {
  private manejadores = new Map<string, Set<Manejador<unknown>>>();

  suscribir<T>(nombre: string, manejador: Manejador<T>): () => void {
    const conjunto = this.manejadores.get(nombre) ?? new Set<Manejador<unknown>>();
    const envuelto = manejador as Manejador<unknown>;
    conjunto.add(envuelto);
    this.manejadores.set(nombre, conjunto);
    return () => conjunto.delete(envuelto);
  }

  async publicar<T>(nombre: string, evento: T): Promise<void> {
    const conjunto = this.manejadores.get(nombre);
    if (!conjunto) return;
    for (const manejador of conjunto) {
      await manejador(evento);
    }
  }
}

export const bus = new BusDeEventos();
