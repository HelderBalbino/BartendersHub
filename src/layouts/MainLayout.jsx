import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = () => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};
export default MainLayout;
