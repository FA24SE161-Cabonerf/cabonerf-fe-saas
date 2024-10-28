import { useEffect, useState } from 'react';

type Props = {
	url: string;
	color?: string;
};

// Create a cache to store SVG content by URL
const svgCache = new Map<string, string>();

export const SVGIcon = ({ url, color = 'currentColor' }: Props) => {
	const [svgContent, setSvgContent] = useState('');

	useEffect(() => {
		const fetchSVG = async () => {
			// Check if the SVG content is already cached
			if (svgCache.has(url)) {
				const cachedSVG = svgCache.get(url)!;
				const coloredSVG = cachedSVG.replace(/currentColor/g, color);
				setSvgContent(coloredSVG);
				return;
			}

			// Fetch the SVG if it's not cached
			try {
				const response = await fetch(url);
				const text = await response.text();
				svgCache.set(url, text); // Cache the SVG content
				const coloredSVG = text.replace(/currentColor/g, color);
				setSvgContent(coloredSVG);
			} catch (error) {
				console.error('Error fetching SVG:', error);
			}
		};
		fetchSVG();
	}, [url, color]);

	return <div style={{ color }} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
