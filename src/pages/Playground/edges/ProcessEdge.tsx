import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaygroundControlContext } from '@/pages/Playground/contexts/playground-control.context';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import socket from '@/socket.io';
import { formatPercentage } from '@/utils/utils';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, useReactFlow } from '@xyflow/react';
import { Ellipsis } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';

type CustomEdge = Edge<CabonerfEdgeData, 'process'>;

type Gradient = {
	start: string;
	end: string;
	startPercentage: number;
	endPercentage: number;
};

const gradientColors: Gradient[] = [
	{ start: '#000000', end: '#323232', startPercentage: 0, endPercentage: 10 }, // Darker transition for Light Cyan
	{ start: '#CDEDEA', end: '#9FDCC5', startPercentage: 10, endPercentage: 20 }, // Soft Mint Green to Bolder Pastel Green
	{ start: '#A8DEC5', end: '#75C9A9', startPercentage: 20, endPercentage: 30 }, // Pastel Green to Deeper Gentle Teal
	{ start: '#89D4B1', end: '#55B3A1', startPercentage: 30, endPercentage: 40 }, // Gentle Teal to Rich Aqua Blue
	{ start: '#74C3C4', end: '#59A3A7', startPercentage: 40, endPercentage: 50 }, // Light Aqua Blue to Vivid Teal
	{ start: '#FBE6A2', end: '#E8C968', startPercentage: 50, endPercentage: 60 }, // Pastel Yellow to Golden Yellow
	{ start: '#FFD8A8', end: '#FBA276', startPercentage: 60, endPercentage: 70 }, // Peachy Orange to Deeper Coral
	{ start: '#F9B5A8', end: '#EA8270', startPercentage: 70, endPercentage: 80 }, // Coral Pink to Bright Soft Red
	{ start: '#E5959C', end: '#C75A68', startPercentage: 80, endPercentage: 90 }, // Soft Red to Bold Dusty Rose
	{ start: '#B87A86', end: '#8B4A53', startPercentage: 90, endPercentage: 100 }, // Dusty Rose to Deep Charcoal Rose
];

function getGradient(percentage: number): Gradient {
	if (percentage < 0 || percentage > 100) {
		return { start: '#000', end: '#000', startPercentage: 0, endPercentage: 0 };
	}
	return (
		gradientColors.find(
			(gradient) => percentage >= gradient.startPercentage && (percentage < gradient.endPercentage || gradient.endPercentage === 100)
		) || { start: '#000', end: '#000', startPercentage: 0, endPercentage: 0 }
	);
}

function ProcessEdge(data: EdgeProps<CustomEdge>) {
	const {
		playgroundState: { impactCategory },
	} = useContext(PlaygroundContext);

	const {
		playgroundControlState: { selectedTriggerId, edgeContributions, impacts, processes },
	} = useContext(PlaygroundControlContext);

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

	const actualPercentage = useMemo(() => {
		const totalValue = impacts?.find((i) => i.impactCategory.id === impactCategory?.id)?.value;
		const actualNet = edgeContributions.find((e) => e.processId === data.source);
		const process = processes?.find((p) => p.id === actualNet?.processId);
		const impact = process?.impacts?.find((z) => z.impactCategory.id === impactCategory?.id);
		const unitProcess = impact?.unitLevel;

		if (unitProcess && totalValue) {
			return Math.min((unitProcess / totalValue) * 100, 100); // Clamp to 100
		}
		return 0; // Default to 0 if invalid
	}, [data.source, edgeContributions, impactCategory?.id, impacts, processes]);

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
				{selectedTriggerId === '2' ? (
					<>
						<svg style={{ position: 'absolute', width: '0', height: '0' }}>
							<defs>
								<linearGradient id={`edgeGradient-${data.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
									<stop
										offset="0%"
										style={{ stopColor: getGradient(actualPercentage as number)?.start || '#000', stopOpacity: 1 }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: getGradient(actualPercentage as number)?.end || '#000', stopOpacity: 1 }}
									/>
								</linearGradient>
							</defs>
						</svg>

						<BaseEdge
							path={path}
							style={{
								stroke: `url(#edgeGradient-${data.id})`, // Reference unique gradient id
								strokeWidth: (actualPercentage as number) / 1.8 || 1, // Avoid zero width
								strokeOpacity: 1,
							}}
						/>
					</>
				) : (
					<BaseEdge path={path} {...data} />
				)}

				<EdgeLabelRenderer>
					{selectedTriggerId === '2' ? (
						<div
							style={{
								position: 'absolute',
								zIndex: 50,
								transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							}}
							className="rounded-xl bg-white px-2 py-1"
						>
							{formatPercentage(actualPercentage as number)}
						</div>
					) : (
						isOpenMenu && (
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
						)
					)}
				</EdgeLabelRenderer>
			</g>
		</>
	);
}

export default React.memo(ProcessEdge);
