import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import socket from '@/socket.io';
import { useMutation } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import { useContext } from 'react';
import { toast } from 'sonner';

export default function useDeleteHandle() {
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const { setNodes, setEdges } = useReactFlow<Node<CabonerfNodeData>>();

	// Hàm để đợi socket hoàn thành
	const waitForSocket = (event: string): Promise<string[]> =>
		new Promise((resolve) => {
			socket.once(event, (data) => {
				resolve(data);
			});
		});

	const deleteExchangeMutations = useMutation({
		mutationFn: async (id: string) => {
			// Gửi yêu cầu HTTP để xóa product exchange
			const httpResponse = await ExchangeApis.prototype.deleteProductExchange({ id });
			// Đợi socket event hoàn thành
			const socketResponse = await waitForSocket('gateway:delete-connector-ids');

			// Trả về kết quả tổng hợp
			return { httpResponse, socketResponse };
		},
		onSuccess: async ({ httpResponse, socketResponse }) => {
			const newProductExchanges = httpResponse.data.data;

			setEdges((edges) => edges.filter((edge) => !(socketResponse as string[]).includes(edge.id)));

			// Cập nhật nodes với dữ liệu mới

			setNodes((nodes) => {
				return nodes.map((node) => {
					if (node.id === sheetState.process?.id) {
						const _newProcess = {
							...node,
							data: { ...node.data, exchanges: newProductExchanges },
						};

						sheetDispatch({
							type: SheetBarDispatch.SET_NODE,
							payload: {
								id: _newProcess.id,
								color: _newProcess.data.color,
								description: _newProcess.data.description,
								exchanges: _newProcess.data.exchanges,
								impacts: _newProcess.data.impacts,
								lifeCycleStage: _newProcess.data.lifeCycleStage,
								name: _newProcess.data.name,
								overallProductFlowRequired: _newProcess.data.overallProductFlowRequired,
								projectId: _newProcess.data.projectId,
							},
						});
						return _newProcess;
					}
					return node;
				});
			});
		},
		onError: (error) => {
			toast(error.message);
		},
	});

	return deleteExchangeMutations.mutate;
}
