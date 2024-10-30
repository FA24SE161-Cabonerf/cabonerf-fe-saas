import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

type tProps = {
	className?: string;
	isPending: boolean;
	title: string;
	pendingTitle: string;
};

export default function ButtonSubmitForm({ isPending, className = 'mt-3', title, pendingTitle }: tProps) {
	return (
		<div>
			<Button disabled={isPending} className={className} type="submit">
				{isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
				{isPending ? pendingTitle : title}
			</Button>
		</div>
	);
}
