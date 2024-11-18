import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import socket from '@/socket.io';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, useReactFlow } from '@xyflow/react';
import { Ellipsis } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type CustomEdge = Edge<CabonerfEdgeData, 'process'>;

function ProcessEdge(data: EdgeProps<CustomEdge>) {
	const { deleteElements } = useReactFlow();
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

	const [path, labelX, labelY] = getSimpleBezierPath({
		sourceX: data.sourceX,
		sourceY: data.sourceY,
		sourcePosition: data.sourcePosition,
		targetX: data.targetX,
		targetY: data.targetY,
		targetPosition: data.targetPosition,
	});

	const handleMouseEnter = () => setIsOpenMenu(true);
	const handleMouseLeave = () => setIsOpenMenu(false);

	useEffect(() => {
		socket.on('gateway:connector-deleted', (data) => {
			deleteElements({
				edges: [{ id: data }],
			});
		});
	}, [deleteElements]);

	const handleDeleteEdge = (id: string) => {
		socket.emit('gateway:connector-delete', id);
	};

	return (
		<>
			<g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<BaseEdge path={path} {...data} style={data.style} />
				<EdgeLabelRenderer>
					{isOpenMenu && (
						<DropdownMenu>
							<DropdownMenuTrigger
								style={{
									position: 'absolute',
									zIndex: 50,
									transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
									pointerEvents: 'auto',
									backgroundColor: '#fff',
									color: '#000',
								}}
								className={`rounded-full p-1`}
							>
								<Ellipsis size={20} />
							</DropdownMenuTrigger>

							<DropdownMenuContent className="absolute -left-2 -top-2">
								<DropdownMenuLabel>Edit edge</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<button onClick={() => handleDeleteEdge(data.id)}>Delete</button>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</EdgeLabelRenderer>
			</g>
		</>
	);
}

export default React.memo(ProcessEdge);
