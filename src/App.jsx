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

const App = () => {
	return (
		<>
			<Navbar />
			<Hero />
			<Content />
			<Footer />
		</>
	);
};

export default App;
