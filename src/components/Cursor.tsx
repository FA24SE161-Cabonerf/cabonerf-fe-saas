import { Cursor } from '@/hooks/useCursorStateSynced';
import { EdgeLabelRenderer, useViewport } from '@xyflow/react';

function Cursors({ cursors }: { cursors: Cursor[] }) {
	const viewport = useViewport();

	return (
		<EdgeLabelRenderer>
			{cursors.map(({ id, color, x, y }) => {
				const translate = `translate(${x}px, ${y}px)`;
				const scale = `scale(${1 / viewport.zoom})`;

				return (
					<svg
						key={id}
						className="cursor"
						stroke="#fff"
						style={{
							transform: translate,
							position: 'absolute',
							zIndex: 50,
							pointerEvents: 'none',
							userSelect: 'none',
							filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5))', // Shadow
						}}
					>
						<g style={{ transform: scale }}>
							<path d={cursorPath} fill={color} fillRule="evenodd" clipRule="evenodd" />
						</g>
					</svg>
				);
			})}
		</EdgeLabelRenderer>
	);
}

const cursorPath = `
  M3.42847 3.52383C5.4919 1.30171 21.0128 6.74513 21 8.73253C20.9855 10.9862 14.9387 11.6795 13.2626 12.1497C12.2548 12.4325 11.9848 12.7223 11.7524 13.7792C10.6999 18.5657 10.1715 20.9464 8.96711 20.9997C7.04737 21.0845 1.41472 5.69242 3.42847 3.52383Z
`;

export default Cursors;
