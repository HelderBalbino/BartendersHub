import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CocktailsPage from './pages/CocktailsPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AddCocktailPage from './pages/AddCocktailPage';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<MainLayout />}>
			<Route index element={<HomePage />} />
			<Route path='/cocktails' element={<CocktailsPage />} />
			<Route path='/addCocktail' element={<AddCocktailPage />} />
			<Route path='/community' element={<CommunityPage />} />
			<Route path='/about' element={<AboutPage />} />
			<Route path='/login' element={<LoginPage />} />
		</Route>,
	),
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
