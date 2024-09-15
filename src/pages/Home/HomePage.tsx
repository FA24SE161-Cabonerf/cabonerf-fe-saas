import TAB_TITLES from '@/constants/tab.titles';
import { useEffect } from 'react';

export default function HomePage() {
	useEffect(() => {
		document.title = TAB_TITLES.HOME;
	}, []);
	return (
		<div>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo eos ullam, debitis pariatur quis possimus. Est
			esse nihil rerum eum! Accusamus, aliquid vitae? Itaque, odio impedit nisi earum nihil fugit.
		</div>
	);
}
