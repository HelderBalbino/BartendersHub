import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Memoized layout to prevent unnecessary re-renders
const MainLayout = memo(() => {
	return (
		<>
			<Navbar />
			<main className='min-h-screen'>
				<Outlet />
			</main>
			<Footer />
		</>
	);
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
