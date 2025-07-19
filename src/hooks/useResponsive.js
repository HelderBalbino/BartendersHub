import { useState, useEffect, useCallback } from 'react';

export const useResponsive = (breakpoints = {}) => {
	const defaultBreakpoints = {
		mobile: 768,
		tablet: 1024,
		desktop: 1280,
		...breakpoints,
	};

	const [screenSize, setScreenSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});

	const updateScreenSize = useCallback(() => {
		setScreenSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
		};
	}, [updateScreenSize]);

	const isMobile = screenSize.width < defaultBreakpoints.mobile;
	const isTablet =
		screenSize.width >= defaultBreakpoints.mobile &&
		screenSize.width < defaultBreakpoints.tablet;
	const isDesktop =
		screenSize.width >= defaultBreakpoints.tablet &&
		screenSize.width < defaultBreakpoints.desktop;
	const isLargeDesktop = screenSize.width >= defaultBreakpoints.desktop;

	const isSmallScreen = isMobile;
	const isMediumScreen = isTablet;
	const isLargeScreen = isDesktop || isLargeDesktop;

	return {
		screenSize,
		isMobile,
		isTablet,
		isDesktop,
		isLargeDesktop,
		isSmallScreen,
		isMediumScreen,
		isLargeScreen,
		breakpoints: defaultBreakpoints,
	};
};

export default useResponsive;
