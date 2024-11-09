import { useEffect, useState } from 'react';

type Props<T> = {
	currentValue: T;
	delayTime: number;
};

export const useDebounce = <T>({ currentValue, delayTime }: Props<T>) => {
	const [valueDebounced, setValueDebounced] = useState<T>(currentValue);

	useEffect(() => {
		const actionDebounce = setTimeout(() => {
			setValueDebounced(currentValue);
		}, delayTime);

		return () => {
			clearTimeout(actionDebounce);
		};
	}, [currentValue, delayTime]);

	return valueDebounced;
};
