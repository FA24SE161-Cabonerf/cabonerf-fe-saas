import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import socket from '@/socket.io';
import { useMutation } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useDeleteHandle() {
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const { setNodes, deleteElements } = useReactFlow<Node<CabonerfNodeData>>();

	const [isHttpDone, setIsHttpDone] = useState<boolean>(false);
	const [buffer, setBuffer] = useState<string[]>([]);

	useEffect(() => {
		const deleteEdges = (ids: string[]) => {
			const idsDelete = ids.map((item) => ({ id: item }));
			deleteElements({
				edges: idsDelete,
			});
		};

		const handleSocketEvent = (data: string[]) => {
			if (isHttpDone) {
				deleteEdges(data);
			} else {
				setBuffer((prevBuffer) => [...prevBuffer, ...data]);
			}
		};

		socket.on('abc', handleSocketEvent);

		return () => {
			socket.off('abc', handleSocketEvent);
		};
	}, [deleteElements, isHttpDone]);

	const deleteExchangeMutations = useMutation({
		mutationFn: (id: string) => ExchangeApis.prototype.deleteProductExchange({ id }),
		onSuccess: (data) => {
			const newProductExchanges = data.data.data;

			setIsHttpDone(true);

			setNodes((nodes) => {
				return nodes.map((node) => {
					if (node.id === sheetState.process?.id) {
						const _newProcess = {
							...node,
							data: { ...node.data, exchanges: newProductExchanges },
						};

						sheetDispatch({
							type: SheetBarDispatch.SET_NODE,
							payload: { ..._newProcess.data },
						});
						return _newProcess;
					}
					return node;
				});
			});

			if (buffer.length > 0) {
				const idsDelete = buffer.map((item) => ({ id: item }));
				deleteElements({
					edges: idsDelete,
				});
				setBuffer([]);
			}
		},
		onError: (error) => {
			toast(error.message);
		},
	});

	return deleteExchangeMutations.mutate;
}
