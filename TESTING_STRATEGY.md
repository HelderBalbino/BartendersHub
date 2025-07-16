# 🧪 Comprehensive Testing Strategy

## Current Testing Status: ⚠️ Minimal (1 test file)

### Priority 1: Frontend Testing Infrastructure

#### Install Testing Dependencies

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react-hooks
```

#### Update package.json Scripts

```json
{
	"scripts": {
		"test": "vitest",
		"test:ui": "vitest --ui",
		"test:coverage": "vitest run --coverage",
		"test:watch": "vitest --watch"
	}
}
```

### Component Testing Examples

#### 1. Test API Service

Create `src/services/__tests__/api.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiService from '../api';

// Mock fetch
global.fetch = vi.fn();

describe('ApiService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	describe('login', () => {
		it('should login successfully with valid credentials', async () => {
			const mockResponse = {
				success: true,
				token: 'mock-token',
				user: { id: '1', name: 'Test User' },
			};

			(fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const result = await apiService.login({
				email: 'test@example.com',
				password: 'password123',
			});

			expect(result).toEqual(mockResponse);
			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining('/auth/login'),
				expect.objectContaining({
					method: 'POST',
				}),
			);
		});

		it('should throw error on failed login', async () => {
			(fetch as any).mockResolvedValueOnce({
				ok: false,
				json: async () => ({ message: 'Invalid credentials' }),
			});

			await expect(
				apiService.login({
					email: 'test@example.com',
					password: 'wrong',
				}),
			).rejects.toThrow('Invalid credentials');
		});
	});
});
```

#### 2. Test React Hooks

Create `src/hooks/__tests__/useCocktails.test.ts`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useCocktails } from '../useCocktails';
import apiService from '../../services/api';

// Mock API service
vi.mock('../../services/api');

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

describe('useCocktails', () => {
	it('should fetch cocktails successfully', async () => {
		const mockCocktails = [
			{ id: '1', name: 'Mojito', difficulty: 'beginner' },
			{ id: '2', name: 'Manhattan', difficulty: 'intermediate' },
		];

		vi.mocked(apiService.getCocktails).mockResolvedValue({
			success: true,
			data: mockCocktails,
		});

		const { result } = renderHook(() => useCocktails(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual({
			success: true,
			data: mockCocktails,
		});
	});
});
```

#### 3. Test React Components

Create `src/components/__tests__/CocktailCard.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CocktailCard from '../CocktailCard';

const mockCocktail = {
	id: '1',
	name: 'Mojito',
	description: 'A refreshing Cuban cocktail',
	difficulty: 'beginner' as const,
	prepTime: 5,
	image: 'https://example.com/mojito.jpg',
	author: {
		id: '1',
		name: 'John Doe',
		username: 'johndoe',
	},
	likes: 42,
	isLiked: false,
};

describe('CocktailCard', () => {
	it('renders cocktail information correctly', () => {
		render(<CocktailCard cocktail={mockCocktail} />);

		expect(screen.getByText('Mojito')).toBeInTheDocument();
		expect(
			screen.getByText('A refreshing Cuban cocktail'),
		).toBeInTheDocument();
		expect(screen.getByText('beginner')).toBeInTheDocument();
		expect(screen.getByText('5 min')).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	it('calls onLike when like button is clicked', () => {
		const onLike = vi.fn();
		render(<CocktailCard cocktail={mockCocktail} onLike={onLike} />);

		const likeButton = screen.getByRole('button', { name: /like/i });
		fireEvent.click(likeButton);

		expect(onLike).toHaveBeenCalledWith(mockCocktail.id);
	});
});
```

### Backend Testing Expansion

#### 1. Comprehensive Controller Tests

Update `backend/tests/controllers/cocktailController.test.js`:

```javascript
import request from 'supertest';
import app from '../../src/server.js';
import User from '../../src/models/User.js';
import Cocktail from '../../src/models/Cocktail.js';
import { connectDB, closeDB, clearDB } from '../helpers/database.js';
import { generateToken } from '../../src/utils/auth.js';

describe('Cocktail Controller', () => {
	let authToken;
	let userId;

	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await clearDB();

		// Create test user
		const user = await User.create({
			name: 'Test User',
			email: 'test@example.com',
			username: 'testuser',
			password: 'hashedpassword123',
		});

		userId = user._id;
		authToken = generateToken(userId);
	});

	afterAll(async () => {
		await closeDB();
	});

	describe('GET /api/cocktails', () => {
		it('should return paginated cocktails', async () => {
			// Create test cocktails
			await Cocktail.create([
				{
					name: 'Mojito',
					description: 'Cuban cocktail',
					difficulty: 'beginner',
					prepTime: 5,
					servings: 1,
					glassType: 'highball',
					author: userId,
					ingredients: [{ name: 'Rum', amount: '2', unit: 'oz' }],
					instructions: ['Mix ingredients'],
				},
				{
					name: 'Manhattan',
					description: 'Classic cocktail',
					difficulty: 'intermediate',
					prepTime: 3,
					servings: 1,
					glassType: 'coupe',
					author: userId,
					ingredients: [{ name: 'Whiskey', amount: '2', unit: 'oz' }],
					instructions: ['Stir ingredients'],
				},
			]);

			const response = await request(app)
				.get('/api/cocktails')
				.query({ page: 1, limit: 10 });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveLength(2);
			expect(response.body.pagination).toBeDefined();
		});

		it('should filter cocktails by difficulty', async () => {
			await Cocktail.create([
				{
					name: 'Easy Drink',
					difficulty: 'beginner',
					author: userId,
					// ... other required fields
				},
				{
					name: 'Hard Drink',
					difficulty: 'expert',
					author: userId,
					// ... other required fields
				},
			]);

			const response = await request(app)
				.get('/api/cocktails')
				.query({ difficulty: 'beginner' });

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveLength(1);
			expect(response.body.data[0].name).toBe('Easy Drink');
		});
	});

	describe('POST /api/cocktails', () => {
		it('should create cocktail with valid data', async () => {
			const cocktailData = {
				name: 'Test Cocktail',
				description: 'A test cocktail',
				difficulty: 'beginner',
				prepTime: 5,
				servings: 1,
				glassType: 'rocks',
				ingredients: [{ name: 'Vodka', amount: '2', unit: 'oz' }],
				instructions: ['Pour vodka'],
			};

			const response = await request(app)
				.post('/api/cocktails')
				.set('Authorization', `Bearer ${authToken}`)
				.send(cocktailData);

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data.name).toBe('Test Cocktail');
		});

		it('should reject cocktail without authentication', async () => {
			const response = await request(app)
				.post('/api/cocktails')
				.send({ name: 'Test' });

			expect(response.status).toBe(401);
		});
	});
});
```

### Integration Testing

#### 1. End-to-End API Flow Tests

Create `backend/tests/integration/userFlow.test.js`:

```javascript
import request from 'supertest';
import app from '../../src/server.js';
import { connectDB, closeDB, clearDB } from '../helpers/database.js';

describe('User Registration to Cocktail Creation Flow', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await clearDB();
	});

	afterAll(async () => {
		await closeDB();
	});

	it('should complete full user journey', async () => {
		// 1. Register user
		const registerResponse = await request(app)
			.post('/api/auth/register')
			.send({
				name: 'John Doe',
				email: 'john@example.com',
				username: 'johndoe',
				password: 'password123',
			});

		expect(registerResponse.status).toBe(201);
		const { token } = registerResponse.body;

		// 2. Login user
		const loginResponse = await request(app).post('/api/auth/login').send({
			email: 'john@example.com',
			password: 'password123',
		});

		expect(loginResponse.status).toBe(200);

		// 3. Create cocktail
		const cocktailResponse = await request(app)
			.post('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'My Special Drink',
				description: 'A unique creation',
				difficulty: 'intermediate',
				prepTime: 10,
				servings: 1,
				glassType: 'martini',
				ingredients: [{ name: 'Gin', amount: '2', unit: 'oz' }],
				instructions: ['Shake with ice'],
			});

		expect(cocktailResponse.status).toBe(201);

		// 4. Verify cocktail appears in user's cocktails
		const userCocktailsResponse = await request(app)
			.get('/api/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.query({ author: 'me' });

		expect(userCocktailsResponse.status).toBe(200);
		expect(userCocktailsResponse.body.data).toHaveLength(1);
	});
});
```

### Performance Testing

#### 1. Load Testing Setup

Create `backend/tests/performance/loadTest.js`:

```javascript
import autocannon from 'autocannon';

const loadTest = async () => {
	const result = await autocannon({
		url: 'http://localhost:5001',
		connections: 10,
		pipelining: 1,
		duration: 10,
		requests: [
			{
				method: 'GET',
				path: '/api/health',
			},
			{
				method: 'GET',
				path: '/api/cocktails?page=1&limit=10',
			},
		],
	});

	console.log('Load test results:', result);
};

export default loadTest;
```

### Test Coverage Goals

#### Minimum Coverage Targets:

-   **Components**: 80%
-   **Hooks**: 85%
-   **Services**: 90%
-   **Controllers**: 85%
-   **Models**: 75%

#### Key Testing Metrics:

1. **Unit Tests**: 80+ tests
2. **Integration Tests**: 20+ tests
3. **E2E Tests**: 10+ critical user flows
4. **Performance Tests**: API response times < 200ms
