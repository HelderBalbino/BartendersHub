import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Content from './components/Content';
import { HiH1 } from 'react-icons/hi2';

const router = createBrowserRouter(
	createRoutesFromElements(<Route index element={<h1>My App</h1>} />),
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
