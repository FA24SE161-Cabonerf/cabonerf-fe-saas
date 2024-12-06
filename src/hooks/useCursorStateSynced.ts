import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { stringToColor } from '@/utils/utils';
import { getOrCreateYDoc } from '@/pages/Playground/yjsdoc/ydoc-cache';
import { useParams } from 'react-router-dom';

const MAX_IDLE_TIME = 2000;

export type Cursor = {
	id: string;
	color: string;
	x: number;
	y: number;
	timestamp: number;
};

export function useCursorStateSynced() {
	const params = useParams<{ pid: string }>();

	const ydoc = getOrCreateYDoc(params.pid ?? 'default');
	const cursorsMap = ydoc.getMap<Cursor>('cursors');

	const cursorId = ydoc.clientID.toString();
	const cursorColor = stringToColor(cursorId);

	const [cursors, setCursors] = useState<Cursor[]>([]);
	const { screenToFlowPosition } = useReactFlow();

	// Flush any cursors that have gone stale.
	const flush = useCallback(() => {
		const now = Date.now();

		for (const [id, cursor] of cursorsMap) {
			if (now - cursor.timestamp > MAX_IDLE_TIME) {
				cursorsMap.delete(id);
			}
		}
	}, [cursorsMap]);

	const onMouseMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			cursorsMap.set(cursorId, {
				id: cursorId,
				color: cursorColor,
				x: position.x,
				y: position.y,
				timestamp: Date.now(),
			});
		},
		[cursorColor, cursorId, cursorsMap, screenToFlowPosition]
	);

	useEffect(() => {
		const timer = window.setInterval(flush, MAX_IDLE_TIME);
		const observer = () => {
			setCursors([...cursorsMap.values()]);
		};

		flush();
		setCursors([...cursorsMap.values()]);
		cursorsMap.observe(observer);

		return () => {
			cursorsMap.unobserve(observer);
			window.clearInterval(timer);
		};
	}, [cursorsMap, flush]);

	const cursorsWithoutSelf = useMemo(() => cursors.filter(({ id }) => id !== cursorId), [cursorId, cursors]);

	return [cursorsWithoutSelf, onMouseMove] as const;
}

export default useCursorStateSynced;
