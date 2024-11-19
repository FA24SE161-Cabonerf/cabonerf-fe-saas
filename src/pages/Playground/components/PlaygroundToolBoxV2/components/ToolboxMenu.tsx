import { ToolboxDispatchType } from '@/@types/dispatch.type';
import { ToolboxContext } from '@/pages/Playground/components/PlaygroundToolBoxV2/context/toolbox.context';
import clsx from 'clsx';
import { useContext, useEffect, useRef } from 'react';

type Props = {
	id: string;
	children: React.ReactNode;
};

export default function ToolboxMenu({ id, children }: Props) {
	const { app, dispatch } = useContext(ToolboxContext);
	const toolboxRef = useRef<HTMLDivElement>(null);

	const isVisible = app.selectedTriggerId === id;

	useEffect(() => {
		dispatch({
			type: ToolboxDispatchType.ADD_MENU_ID,
			payload: {
				id,
				current: toolboxRef.current as HTMLDivElement,
			},
		});

		return () => {
			dispatch({ type: ToolboxDispatchType.CLEAR_TRIGGER_IDS });
		};
	}, [dispatch, id]);

	return (
		<div
			ref={toolboxRef}
			className={clsx('absolute top-1/2 ml-14 -translate-y-1/2 duration-300', {
				'pointer-events-none opacity-0': !isVisible,
				'opacity-100': isVisible,
			})}
		>
			<div className="rounded-2xl border bg-white p-6 shadow-md">{children}</div>
		</div>
	);
}
