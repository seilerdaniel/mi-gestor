export async function api<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(`/api${ruta}`, {
    credentials: 'include',
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers ?? {}),
    },
  });

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json().catch(() => ({}))) as { error?: string };
    throw new Error(cuerpo.error ?? `Error ${respuesta.status}`);
  }

  return (await respuesta.json()) as T;
}
