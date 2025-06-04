import logo from '../assets/images/logo.png';

const Navbar = () => {
	return (
		<nav className='bg-black border border-gold'>
			<img className='h-28 w-auto' src={logo} alt='' />
		</nav>
	);
};

export default Navbar;
