import { spawn } from 'node:child_process';

const esWindows = process.platform === 'win32';
const npx = esWindows ? 'npx.cmd' : 'npx';

const procesos = [
  spawn(npx, ['tsx', 'watch', 'app/main.ts'], { stdio: 'inherit', shell: esWindows }),
  spawn(npx, ['vite'], { stdio: 'inherit', shell: esWindows }),
];

let cerrando = false;

function cerrar(codigo = 0) {
  if (cerrando) return;
  cerrando = true;
  for (const proceso of procesos) {
    if (!proceso.killed) proceso.kill();
  }
  process.exit(codigo);
}

for (const proceso of procesos) {
  proceso.on('exit', (codigo) => {
    if (!cerrando && codigo !== 0) cerrar(codigo ?? 1);
  });
}

process.on('SIGINT', () => cerrar(0));
process.on('SIGTERM', () => cerrar(0));
