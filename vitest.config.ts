import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@/components/asharca': fileURLToPath(new URL('./registry/ui', import.meta.url)) } },
  test: { environment: 'jsdom', setupFiles: ['tests/setup.ts'], include: ['tests/**/*.test.tsx'], restoreMocks: true, clearMocks: true },
});
