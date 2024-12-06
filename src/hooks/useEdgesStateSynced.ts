import { useCallback, useEffect, useState } from 'react';
import { type Edge, type OnEdgesChange, applyEdgeChanges } from '@xyflow/react';
import ydoc from '@/yjsdoc/ydoc';

// We are using edgesMap as the one source of truth for the edges.
// This means that we are doing all changes to the edges in the map object.
// Whenever the map changes, we update the edges state.
export const edgesMap = ydoc.getMap<Edge>('edges');

function useEdgesStateSynced(): [Edge[], React.Dispatch<React.SetStateAction<Edge[]>>, OnEdgesChange] {
	const [edges, setEdges] = useState<Edge[]>([]);

	const setEdgesSynced = useCallback((edgesOrUpdater: React.SetStateAction<Edge[]>) => {
		const next = typeof edgesOrUpdater === 'function' ? edgesOrUpdater([...edgesMap.values()]) : edgesOrUpdater;

		const seen = new Set<string>();

		for (const edge of next) {
			seen.add(edge.id);
			edgesMap.set(edge.id, edge);
		}

		for (const edge of edgesMap.values()) {
			if (!seen.has(edge.id)) {
				edgesMap.delete(edge.id);
			}
		}
	}, []);

	const onEdgesChange: OnEdgesChange = useCallback((changes) => {
		const edges = Array.from(edgesMap.values());
		const nextEdges = applyEdgeChanges(changes, edges);

		for (const change of changes) {
			if (change.type === 'add' || change.type === 'replace') {
				if (change.item) {
					edgesMap.set(change.item.id, change.item);
				} else {
					console.warn(`Add/Replace operation with undefined item:`, change);
				}
			} else if (change.type === 'remove' && edgesMap.has(change.id)) {
				edgesMap.delete(change.id);
				console.log(`Edge with id ${change.id} was removed successfully.`);
			} else if (change.type !== 'remove') {
				const edgeToSet = nextEdges.find((n) => n.id === change.id);
				if (edgeToSet) {
					edgesMap.set(change.id, edgeToSet);
				} else {
					console.warn(`Edge with id ${change.id} not found in nextEdges`);
				}
			}
		}
	}, []);

	// here we are observing the edgesMap and updating the edges state whenever the map changes.
	useEffect(() => {
		const observer = () => {
			setEdges(Array.from(edgesMap.values()));
		};

		setEdges(Array.from(edgesMap.values()));
		edgesMap.observe(observer);

		return () => edgesMap.unobserve(observer);
	}, [setEdges]);

	return [edges, setEdgesSynced, onEdgesChange];
}

export default useEdgesStateSynced;
