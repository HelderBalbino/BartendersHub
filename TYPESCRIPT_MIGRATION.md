# TypeScript Migration Guide

## Step 1: Install TypeScript dependencies

```bash
npm install -D typescript @types/react @types/react-dom @types/node
```

## Step 2: Create tsconfig.json

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"useDefineForClassFields": true,
		"lib": ["ES2020", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"skipLibCheck": true,
		"moduleResolution": "bundler",
		"allowImportingTsExtensions": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noFallthroughCasesInSwitch": true,
		"baseUrl": ".",
		"paths": {
			"@/*": ["src/*"],
			"@/components/*": ["src/components/*"],
			"@/pages/*": ["src/pages/*"],
			"@/hooks/*": ["src/hooks/*"],
			"@/utils/*": ["src/utils/*"],
			"@/types/*": ["src/types/*"]
		}
	},
	"include": ["src"],
	"references": [{ "path": "./tsconfig.node.json" }]
}
```

## Step 3: Rename files from .jsx to .tsx

-   All component files should be renamed to .tsx
-   Utility files to .ts

## Step 4: Add type definitions

Create src/types/ directory with interface definitions.
