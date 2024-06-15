/// <reference types="vitest" />
/// <reference types="vite/client" />

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()] as UserConfig['plugins'],
    test: {
        environment: 'happy-dom',
        setupFiles: ['./test/setup-test-env.ts'],
    },
});
