import { Separator } from '@/components/ui/separator';
import TAB_TITLES from '@/constants/tab.titles';
import ObjectLibrariesHeader from '@/pages/ObjectLibraries/components/ObjectLibrariesHeader';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ObjectLibrariesPage() {
	useEffect(() => {
		document.title = `Object Libraries - ${TAB_TITLES.HOME}`;
	}, []);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col ease-in"
		>
			<ObjectLibrariesHeader />
			<Separator className="shadow-sm" />
		</motion.div>
	);
}
