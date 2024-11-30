import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

type tProps = {
	className?: string;
	fallBackContent: string;
	urlAvatar: string;
};

export default function MyAvatar({ fallBackContent, urlAvatar, className = 'h-7 w-7' }: tProps) {
	return (
		<Avatar className={className}>
			<AvatarImage className="object-cover" src={urlAvatar} alt="@shadcn" />
			<AvatarFallback>{fallBackContent}</AvatarFallback>
		</Avatar>
	);
}
