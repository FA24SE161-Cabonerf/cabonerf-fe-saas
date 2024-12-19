import { useCallback, useEffect, useState } from 'react';
import { Edge, type Node, type OnNodesChange, applyNodeChanges, getConnectedEdges } from '@xyflow/react';

import { getOrCreateYDoc } from '@/pages/Playground/yjsdoc/ydoc-cache';
import { useParams } from 'react-router-dom';

// We are using nodesMap as the one source of truth for the nodes.
// This means that we are doing all changes to the nodes in the map object.
// Whenever the map changes, we update the nodes state.

function useNodesStateSynced(): [Node[], React.Dispatch<React.SetStateAction<Node[]>>, OnNodesChange] {
	const params = useParams<{ pid: string }>();
	const ydoc = getOrCreateYDoc(params.pid ?? 'default');

	const edgesMap = ydoc.getMap<Edge>('edges');
	const nodesMap = ydoc.getMap<Node>('nodes');

	const [nodes, setNodes] = useState<Node[]>([]);

	const setNodesSynced = useCallback(
		(nodesOrUpdater: React.SetStateAction<Node[]>) => {
			const seen = new Set<string>();
			const next = typeof nodesOrUpdater === 'function' ? nodesOrUpdater([...nodesMap.values()]) : nodesOrUpdater;

			for (const node of next) {
				seen.add(node.id);
				nodesMap.set(node.id, node);
			}

			for (const node of nodesMap.values()) {
				if (!seen.has(node.id)) {
					nodesMap.delete(node.id);
				}
			}
		},
		[nodesMap]
	);

	// The onNodesChange callback updates nodesMap.
	// When the changes are applied to the map, the observer will be triggered and updates the nodes state.
	const onNodesChanges: OnNodesChange = useCallback(
		(changes) => {
			const nodes = Array.from(nodesMap.values());
			const nextNodes = applyNodeChanges(changes, nodes);

			for (const change of changes) {
				if (change.type === 'add' || change.type === 'replace') {
					if (change.item) {
						nodesMap.set(change.item.id, change.item);
					} else {
						console.warn(`Add/Replace operation with undefined item:`, change);
					}
				} else if (change.type === 'remove' && nodesMap.has(change.id)) {
					const deletedNode = nodesMap.get(change.id);
					if (deletedNode) {
						const connectedEdges = getConnectedEdges([deletedNode], [...edgesMap.values()]);
						nodesMap.delete(change.id);
						for (const edge of connectedEdges) {
							edgesMap.delete(edge.id);
						}
					}
				} else if (change.type !== 'remove') {
					const nodeToSet = nextNodes.find((n) => n.id === change.id);
					if (nodeToSet) {
						nodesMap.set(change.id, nodeToSet);
					} else {
						console.warn(`Node with id ${change.id} not found in nextNodes`);
					}
				}
			}
		},
		[edgesMap, nodesMap]
	);

	// here we are observing the nodesMap and updating the nodes state whenever the map changes.
	useEffect(() => {
		const observer = () => {
			setNodes(Array.from(nodesMap.values()));
		};

		setNodes(Array.from(nodesMap.values()));
		nodesMap.observe(observer);

		return () => nodesMap.unobserve(observer);
	}, [nodesMap, setNodes]);

	return [nodes, setNodesSynced, onNodesChanges];
}

export default useNodesStateSynced;
