import { eDispatchType } from '@/@types/dispatch.type';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import clsx from 'clsx';
import { Check, GitCompare, X } from 'lucide-react';
import { useContext } from 'react';

export default function FloatingControl() {
	const { app, dispatch } = useContext(AppContext);

	const length = app.selectCheckbox.length;

	return (
		<div
			className={clsx(`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300`, {
				'translate-y-14 opacity-0': length === 0,
				'translate-y-0 opacity-100': length > 0,
			})}
		>
			<div className="flex w-[550px] rounded-[14px] border px-3 py-1.5 text-xs shadow-md">
				<div className="flex w-1/2 items-center">
					<Check className="mr-3 rounded-md border bg-black p-1" stroke="white" size={26} />
					<span className="font-medium">
						{length} {length > 1 ? 'Projects' : 'Project'} selected
					</span>
				</div>
				<div className="flex w-1/2 items-center justify-end space-x-5">
					<div className="flex items-center">
						<button className="flex items-center space-x-1 rounded-sm px-3 py-2 hover:bg-gray-100">
							<GitCompare size={17} color="#15803d" />
							<span className="font-medium text-green-700">Compare</span>
						</button>
						<Separator orientation="vertical" className="mx-2 h-5" />
						<button className="rounded-sm px-3 py-2 hover:bg-gray-100">Delete</button>
					</div>
					<button className="rounded-sm p-1 hover:bg-gray-100" onClick={() => dispatch({ type: eDispatchType.CLOSE_CHECKBOX })}>
						<X size={17} strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</div>
	);
}
