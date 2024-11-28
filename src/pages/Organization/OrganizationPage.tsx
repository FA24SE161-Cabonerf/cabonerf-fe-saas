import { Separator } from '@/components/ui/separator';
import OrganizationHeader from '@/pages/Organization/components/OrganizationHeader';
import { motion } from 'framer-motion';

export default function OrganizationPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col ease-in"
		>
			<OrganizationHeader />
			<Separator />
		</motion.div>
	);
}
