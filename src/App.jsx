import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CocktailsPage from './pages/CocktailsPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AddCocktailPage from './pages/AddCocktailPage';

// Create a client for React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
		},
	},
});

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<MainLayout />}>
			<Route index element={<HomePage />} />
			<Route path='/cocktails' element={<CocktailsPage />} />
			<Route path='/community' element={<CommunityPage />} />
			<Route path='/about' element={<AboutPage />} />
			<Route path='/login' element={<LoginPage />} />

			{/* Protected Routes */}
			<Route element={<ProtectedRoute />}>
				<Route path='/addCocktail' element={<AddCocktailPage />} />
			</Route>
		</Route>,
	),
);

const App = () => {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<RouterProvider router={router} />
					<Toaster
						position='top-right'
						toastOptions={{
							duration: 4000,
							style: {
								background: '#000',
								color: '#fbbf24',
								border: '1px solid #fbbf24',
							},
						}}
					/>
					{import.meta.env.DEV && <ReactQueryDevtools />}
				</AuthProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
};

export default App;
