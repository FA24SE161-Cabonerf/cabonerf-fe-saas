import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

type tProps = {
	children: React.ReactNode;
	tooltipContent: string;
	className?: string;
	delayDuration?: number;
};

export default function TooltipWrapper({ children, tooltipContent, className, delayDuration = 700 }: tProps) {
	return (
		<TooltipProvider delayDuration={delayDuration}>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent className={className}>
					<p>{tooltipContent}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
