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
import AboutPage from './components/AboutContent';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<MainLayout />}>
			<Route index element={<HomePage />} />
			<Route path='/cocktails' element={<CocktailsPage />} />
			<Route path='/community' element={<CommunityPage />} />
			<Route path='/about' element={<AboutPage />} />
		</Route>,
	),
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
