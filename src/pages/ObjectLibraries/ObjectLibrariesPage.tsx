import { Separator } from '@/components/ui/separator';
import ObjectLibrariesHeader from '@/pages/ObjectLibraries/components/ObjectLibrariesHeader';
import { motion } from 'framer-motion';

export default function ObjectLibrariesPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col ease-in"
		>
			<ObjectLibrariesHeader />
			<Separator />
		</motion.div>
	);
}
