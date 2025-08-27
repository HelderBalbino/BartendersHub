import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Lightweight SEO meta manager (React 19 compatible)
const SeoMeta = ({ title, description, image, url }) => {
	const metaTitle = title ? `${title} | BartendersHub` : 'BartendersHub';
	const metaDesc =
		description ||
		'Discover and share premium cocktail recipes on BartendersHub.';
	const metaImage =
		image || 'https://bartendershub.onrender.com/og-default.jpg';
	const metaUrl =
		url || (typeof window !== 'undefined' ? window.location.href : '');

	useEffect(() => {
		if (typeof document === 'undefined') return;
		// Title
		if (document.title !== metaTitle) document.title = metaTitle;

		const setTag = (selector, createTag) => {
			let el = document.head.querySelector(selector);
			if (!el) {
				el = createTag();
				document.head.appendChild(el);
			}
			return el;
		};

		const updateMeta = (attrName, attrValue, content) => {
			if (!content) return;
			const selector = `meta[${attrName}='${attrValue}']`;
			const meta = setTag(selector, () => {
				const m = document.createElement('meta');
				m.setAttribute(attrName, attrValue);
				return m;
			});
			meta.setAttribute('content', content);
		};

		updateMeta('name', 'description', metaDesc);
		updateMeta('property', 'og:title', metaTitle);
		updateMeta('property', 'og:description', metaDesc);
		updateMeta('property', 'og:image', metaImage);
		updateMeta('property', 'og:url', metaUrl);
		updateMeta('property', 'og:type', 'article');
		updateMeta('name', 'twitter:card', 'summary_large_image');
		updateMeta('name', 'twitter:title', metaTitle);
		updateMeta('name', 'twitter:description', metaDesc);
		updateMeta('name', 'twitter:image', metaImage);
	}, [metaTitle, metaDesc, metaImage, metaUrl]);

	return null; // No visible UI
};

SeoMeta.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.string,
	url: PropTypes.string,
};

export default SeoMeta;
