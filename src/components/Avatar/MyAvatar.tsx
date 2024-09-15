import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

type tProps = {
	className?: string;
	fallBackContent: string;
	urlAvatar: string;
};

export default function MyAvatar({ fallBackContent, urlAvatar, className = 'h-6 w-6' }: tProps) {
	return (
		<Avatar className={className}>
			<AvatarImage src={urlAvatar} alt="@shadcn" />
			<AvatarFallback>{fallBackContent}</AvatarFallback>
		</Avatar>
	);
}
