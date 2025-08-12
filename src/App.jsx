import { Suspense, lazy, useMemo } from 'react';
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
import LoadingSpinner from './components/LoadingSpinner';
import config from './config/environment.js';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CocktailsPage = lazy(() => import('./pages/CocktailsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AddCocktailPage = lazy(() => import('./pages/AddCocktailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Enhanced loading component
const PageLoader = () => (
	<div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
		<LoadingSpinner />
	</div>
);

const App = () => {
	// Memoize query client to prevent recreation on re-renders
	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 2,
						staleTime: 5 * 60 * 1000, // 5 minutes
						gcTime: 10 * 60 * 1000, // 10 minutes
						refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
						refetchOnReconnect: true,
					},
					mutations: {
						retry: 1,
					},
				},
			}),
		[],
	);

	// Memoize router to prevent recreation
	const router = useMemo(
		() =>
			createBrowserRouter(
				createRoutesFromElements(
					<Route path='/' element={<MainLayout />}>
						<Route
							index
							element={
								<Suspense fallback={<PageLoader />}>
									<HomePage />
								</Suspense>
							}
						/>
						<Route
							path='/cocktails'
							element={
								<Suspense fallback={<PageLoader />}>
									<CocktailsPage />
								</Suspense>
							}
						/>
						<Route
							path='/about'
							element={
								<Suspense fallback={<PageLoader />}>
									<AboutPage />
								</Suspense>
							}
						/>
						<Route
							path='/login'
							element={
								<Suspense fallback={<PageLoader />}>
									<LoginPage />
								</Suspense>
							}
						/>

						{/* Protected Routes */}
						<Route element={<ProtectedRoute />}>
							<Route
								path='/community'
								element={
									<Suspense fallback={<PageLoader />}>
										<CommunityPage />
									</Suspense>
								}
							/>
							<Route
								path='/addCocktail'
								element={
									<Suspense fallback={<PageLoader />}>
										<AddCocktailPage />
									</Suspense>
								}
							/>
							<Route
								path='/profile'
								element={
									<Suspense fallback={<PageLoader />}>
										<ProfilePage />
									</Suspense>
								}
							/>
							<Route
								path='/profile/:userId'
								element={
									<Suspense fallback={<PageLoader />}>
										<ProfilePage />
									</Suspense>
								}
							/>
						</Route>
					</Route>,
				),
			),
		[],
	);

	// Memoize toast configuration
	const toasterConfig = useMemo(
		() => ({
			position: 'top-right',
			toastOptions: {
				duration: 4000,
				style: {
					background: '#000',
					color: '#fbbf24',
					border: '1px solid #fbbf24',
					borderRadius: '0',
				},
				success: {
					iconTheme: {
						primary: '#fbbf24',
						secondary: '#000',
					},
				},
				error: {
					iconTheme: {
						primary: '#ef4444',
						secondary: '#000',
					},
				},
			},
		}),
		[],
	);

	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<RouterProvider router={router} />
					<Toaster {...toasterConfig} />
					{/* Only show React Query DevTools in development */}
					{config.features.enableDevtools && (
						<ReactQueryDevtools initialIsOpen={false} />
					)}
				</AuthProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
};

export default App;
