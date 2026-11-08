import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('fronteras modulares', () => {
  it('dependency-cruiser no reporta violaciones', () => {
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';

    try {
      execSync('npx depcruise core modules app ui --config .dependency-cruiser.cjs', {
        cwd: process.cwd(),
        stdio: 'pipe',
        shell,
      });
      expect(true).toBe(true);
    } catch (error) {
      const salida = (error as { stdout?: Buffer }).stdout?.toString() ?? '';
      throw new Error(`Fronteras violadas:\n${salida}`, { cause: error });
    }
  });
});
