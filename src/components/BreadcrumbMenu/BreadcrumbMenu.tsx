import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CaretSortIcon } from '@radix-ui/react-icons';

type tProps = {
	dropDownTrigger: React.ReactNode;
	children: React.ReactNode;
};

export default function BreadcrumbWithMenu({ children, dropDownTrigger }: tProps) {
	return (
		<BreadcrumbItem className="rounded-sm px-1 py-[3px] transition-all duration-200 ease-in-out hover:bg-stone-200">
			<DropdownMenu>
				<DropdownMenuTrigger
					autoFocus={false}
					className="flex items-center gap-1 px-1.5 font-semibold text-black"
				>
					{dropDownTrigger}
					<CaretSortIcon width={18} height={18} className="font-bold text-foreground" />
				</DropdownMenuTrigger>
				<DropdownMenuContent asChild align="start">
					{children}
				</DropdownMenuContent>
			</DropdownMenu>
		</BreadcrumbItem>
	);
}
