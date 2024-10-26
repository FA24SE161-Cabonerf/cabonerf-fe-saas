import { useEffect, useState } from 'react';

type Props = {
	url: string;
	color?: string;
};

export const SVGIcon = ({ url, color = 'currentColor' }: Props) => {
	const [svgContent, setSvgContent] = useState('');

	useEffect(() => {
		const fetchSVG = async () => {
			try {
				const response = await fetch(url);
				const text = await response.text();
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
