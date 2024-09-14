import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

export default function AuthenticationFooter() {
	return (
		<div className="w-full">
			<div className="flex h-5 items-center justify-center space-x-4 text-sm">
				<Link className="text-primary-green" to={''}>
					Term of Use
				</Link>
				<Separator orientation="vertical" className="w-[1px]" />
				<Link className="text-primary-green" to={''}>
					Privacy Policy
				</Link>
			</div>
		</div>
	);
}
