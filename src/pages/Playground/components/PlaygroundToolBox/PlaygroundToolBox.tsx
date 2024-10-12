import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export default function PlaygroundToolBox() {
	const toolboxRef = useRef<HTMLDivElement>(null);
	const [isOpenToolBox, setIsOpenToolbox] = useState<boolean>(false);

	const toggleToolbox = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		setIsOpenToolbox((prevState) => !prevState);
	};

	useEffect(() => {
		const handleCloseToolbox = (event: MouseEvent) => {
			if (toolboxRef.current && !toolboxRef.current.contains(event.target as Node)) {
				setIsOpenToolbox(false);
			}
		};

		if (isOpenToolBox) {
			document.addEventListener('click', handleCloseToolbox);
		}

		return () => {
			document.removeEventListener('click', handleCloseToolbox);
		};
	}, [isOpenToolBox]);

	return (
		<div className="relative m-2">
			<div
				ref={toolboxRef}
				className={clsx('absolute z-40 h-auto transform border transition duration-300', {
					'-translate-x-[calc(100%+8px)]': isOpenToolBox !== true,
				})}
			>
				{/* Tool Box herer */}
				<div className="h-full w-full bg-white">123</div>
			</div>
			<button className="absolute left-0 top-0 z-10" onClick={toggleToolbox}>
				Open
			</button>
		</div>
	);
}
