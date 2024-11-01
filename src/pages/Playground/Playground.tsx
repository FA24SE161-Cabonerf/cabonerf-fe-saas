import { ContextDispatch } from '@/@types/dispatch.type';
import { LifeCycleStages } from '@/@types/lifeCycleStages.type';
import { AppContext } from '@/contexts/app.context';
import BackButton from '@/pages/Playground/components/BackButton';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import ProcessNode from '@/pages/Playground/customs/ProcessNode';
import socket from '@/socket.io';
import { updateSVGAttributes } from '@/utils/utils';
import { applyNodeChanges, Background, BackgroundVariant, MiniMap, Node, NodeChange, NodeTypes, Panel, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DOMPurify from 'dompurify';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const customNode: NodeTypes = {
	process: ProcessNode,
};

const nds: Node[] = [];

const debouncedLog = debounce((id: string, x, y) => {
	console.log(`id:${id}, x: ${x}, y: ${y}`);
}, 200);

export default function Playground() {
	const { dispatch } = useContext(contextMenu);
	const { app } = useContext(AppContext);
	const [nodes, setNodes] = useState<Node[]>(nds);

	useEffect(() => {
		socket.auth = {
			user_id: app.userProfile?.id,
		};

		socket.connect();

		socket.on('node:created', (data: LifeCycleStages) => {
			toast(
				<div className="flex items-center space-x-3">
					{/* Icon */}
					<div className="h-fit w-fit rounded bg-[#16a34a] p-1">
						<div
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(
									updateSVGAttributes({
										svgString: data.iconUrl,
										properties: { color: 'white', fill: 'white', height: 15, width: 15 },
									})
								),
							}}
						/>
					</div>
					{/* Description */}
					<div>
						<div className="">
							<b>{data.name}</b> create successfull
						</div>
						<div className="text-xs text-gray-600">{new Date().toDateString()}</div>
					</div>
				</div>,

				{
					action: {
						label: 'Undo',
						onClick: () => console.log('123'),
					},
					className: 'border-[0.5px] rounded-2xl',
				}
			);
		});

		socket.on('node:deleted', (data) => {
			alert(data);
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id]);

	const onNodeChange = useCallback(
		(changes: NodeChange<Node>[]) => {
			setNodes((nds) => applyNodeChanges(changes, nds));

			// Close context menu
			dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });

			changes.forEach((change) => {
				if (change.type === 'position') {
					debouncedLog(change.id, change.position?.x, change.position?.y);
				}
			});
		},
		[dispatch]
	);

	return (
		<React.Fragment>
			<div className="h-[100vh]">
				<ReactFlow nodeTypes={customNode} nodes={nodes} onNodesChange={onNodeChange}>
					<Background variant={BackgroundVariant.Dots} size={1.5} color="#dedede" />
					<MiniMap className="" offsetScale={2} pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />

					<Panel position="top-left">
						<BackButton />
					</Panel>
					<PlaygroundToolBoxV2 />

					<Panel position="bottom-center">
						<PlaygroundControls />
					</Panel>
					<Panel position="top-right">
						<PlaygroundActionToolbar />
					</Panel>
				</ReactFlow>
			</div>
		</React.Fragment>
	);
}
