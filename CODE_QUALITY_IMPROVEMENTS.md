# 🎯 Code Quality & TypeScript Migration Guide

## 1. TypeScript Migration Priority

### Immediate Benefits:
- ✅ **Type Safety**: Catch errors at compile time
- ✅ **Better IDE Support**: Enhanced autocomplete and refactoring
- ✅ **Documentation**: Self-documenting code with types
- ✅ **Refactoring Safety**: Confident code changes

### Phase 1: Setup TypeScript Infrastructure

```bash
# Install TypeScript dependencies
npm install -D typescript @types/react @types/react-dom @types/node
npm install -D @vitejs/plugin-react-swc # Faster compilation
```

### Phase 2: Create Type Definitions

Create `src/types/api.ts`:

```typescript
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  speciality?: string;
  location?: string;
  isVerified: boolean;
  badges: string[];
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

// Cocktail types
export interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prepTime: number;
  servings: number;
  glassType: string;
  garnish?: string;
  image?: string;
  tags: string[];
  author: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  optional?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CocktailForm {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  difficulty: Cocktail['difficulty'];
  prepTime: number;
  servings: number;
  glassType: string;
  garnish?: string;
  tags: string[];
  image?: File;
}
```

### Phase 3: Update Vite Configuration

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow external connections
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

## 2. Enhanced Development Tools

### ESLint Configuration Update

Update `eslint.config.js`:

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      
      // React specific rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "jsxSingleQuote": true,
  "quoteProps": "as-needed"
}
```

## 3. Testing Infrastructure

### Jest Configuration

Create `jest.config.js`:

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Test Setup

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

## 4. Performance Monitoring

### Bundle Analysis

Add to `package.json` scripts:

```json
{
  "scripts": {
    "analyze": "npm run build && npx vite-bundle-analyzer dist",
    "type-check": "tsc --noEmit",
    "lint:fix": "eslint . --fix",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Webpack Bundle Analyzer

```bash
npm install -D vite-bundle-analyzer
```
