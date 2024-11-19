import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ControlItem from '@/pages/Playground/components/ControlItem';
import socket from '@/socket.io';
import { useReactFlow } from '@xyflow/react';
import { Play } from 'lucide-react';
import React from 'react';

const FIT_VIEW = 1000;
const ZOOM = 150;

function PlaygroundControls() {
	const reactflow = useReactFlow();

	return (
		<div className="relative w-auto transform rounded-[15px] border-[0.5px] border-gray-50 bg-white shadow-xl duration-300">
			<div className="flex items-center space-x-2 p-1.5">
				<ControlItem duration={ZOOM} onAction={reactflow.zoomIn}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
						<path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						<path
							d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinejoin="round"
						/>
						<path
							d="M7.5 11L14.5 11M11 7.5V14.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</ControlItem>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomOut}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
						<path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						<path
							d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinejoin="round"
						/>
						<path d="M7.5 11H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</ControlItem>
				<ControlItem duration={FIT_VIEW} onAction={reactflow.fitView}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
						<path
							d="M19.4 19.4L22 22M20.7 14.85C20.7 11.6191 18.0809 9 14.85 9C11.6191 9 9 11.6191 9 14.85C9 18.0809 11.6191 20.7 14.85 20.7C18.0809 20.7 20.7 18.0809 20.7 14.85Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M19.075 19.075L22 22M12.9 14.85H14.85M14.85 14.85H16.8M14.85 14.85V12.9M14.85 14.85V16.8M20.7 14.85C20.7 11.6191 18.0809 9 14.85 9C11.6191 9 9 11.6191 9 14.85C9 18.0809 11.6191 20.7 14.85 20.7C18.0809 20.7 20.7 18.0809 20.7 14.85Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M2 6C2.1305 4.6645 2.4262 3.7663 3.09625 3.09625C3.7663 2.4262 4.6645 2.1305 6 2M6 22C4.6645 21.8695 3.7663 21.5738 3.09625 20.9037C2.4262 20.2337 2.1305 19.3355 2 18M22 6C21.8695 4.6645 21.5738 3.7663 20.9037 3.09625C20.2337 2.4262 19.3355 2.1305 18 2M2 10L2 14M14 2L10 2"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</ControlItem>
				<Separator orientation="vertical" className="h-6" color="black" />
				<ControlItem>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width={20}
						height={20}
						color={'currentColor'}
						fill={'currentColor'}
					>
						<path
							d="M3.5 12.5V19.5C3.5 19.9659 3.5 20.1989 3.57612 20.3827C3.67761 20.6277 3.87229 20.8224 4.11732 20.9239C4.30109 21 4.53406 21 5 21C5.46594 21 5.69891 21 5.88268 20.9239C6.12771 20.8224 6.32239 20.6277 6.42388 20.3827C6.5 20.1989 6.5 19.9659 6.5 19.5V12.5C6.5 12.0341 6.5 11.8011 6.42388 11.6173C6.32239 11.3723 6.12771 11.1776 5.88268 11.0761C5.69891 11 5.46594 11 5 11C4.53406 11 4.30109 11 4.11732 11.0761C3.87229 11.1776 3.67761 11.3723 3.57612 11.6173C3.5 11.8011 3.5 12.0341 3.5 12.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="square"
							strokeLinejoin="round"
						/>
						<path
							d="M10.5 14.5V19.4995C10.5 19.9654 10.5 20.1984 10.5761 20.3822C10.6776 20.6272 10.8723 20.8219 11.1173 20.9234C11.3011 20.9995 11.5341 20.9995 12 20.9995C12.4659 20.9995 12.6989 20.9995 12.8827 20.9234C13.1277 20.8219 13.3224 20.6272 13.4239 20.3822C13.5 20.1984 13.5 19.9654 13.5 19.4995V14.5C13.5 14.0341 13.5 13.8011 13.4239 13.6173C13.3224 13.3723 13.1277 13.1776 12.8827 13.0761C12.6989 13 12.4659 13 12 13C11.5341 13 11.3011 13 11.1173 13.0761C10.8723 13.1776 10.6776 13.3723 10.5761 13.6173C10.5 13.8011 10.5 14.0341 10.5 14.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="square"
							strokeLinejoin="round"
						/>
						<path
							d="M17.5 10.5V19.5C17.5 19.9659 17.5 20.1989 17.5761 20.3827C17.6776 20.6277 17.8723 20.8224 18.1173 20.9239C18.3011 21 18.5341 21 19 21C19.4659 21 19.6989 21 19.8827 20.9239C20.1277 20.8224 20.3224 20.6277 20.4239 20.3827C20.5 20.1989 20.5 19.9659 20.5 19.5V10.5C20.5 10.0341 20.5 9.80109 20.4239 9.61732C20.3224 9.37229 20.1277 9.17761 19.8827 9.07612C19.6989 9 19.4659 9 19 9C18.5341 9 18.3011 9 18.1173 9.07612C17.8723 9.17761 17.6776 9.37229 17.5761 9.61732C17.5 9.80109 17.5 10.0341 17.5 10.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="square"
							strokeLinejoin="round"
						/>
						<path
							d="M6.5 6.5C6.5 7.32843 5.82843 8 5 8C4.17157 8 3.5 7.32843 3.5 6.5C3.5 5.67157 4.17157 5 5 5C5.82843 5 6.5 5.67157 6.5 6.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M20.5 4.5C20.5 5.32843 19.8284 6 19 6C18.1716 6 17.5 5.32843 17.5 4.5C17.5 3.67157 18.1716 3 19 3C19.8284 3 20.5 3.67157 20.5 4.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M13.5 8.5C13.5 9.32843 12.8284 10 12 10C11.1716 10 10.5 9.32843 10.5 8.5C10.5 7.67157 11.1716 7 12 7C12.8284 7 13.5 7.67157 13.5 8.5Z"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path d="M6.44336 6.91199L10.558 8.08762M13.3033 7.75547L17.6981 5.24414" stroke="currentColor" strokeWidth="1.5" />
					</svg>
				</ControlItem>
				<ControlItem>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width={20}
						height={20}
						color={'currentColor'}
						fill={'currentColor'}
					>
						<path
							d="M11.024 22C15.3242 22 18.9218 18.9922 19.8279 14.9657C20.0135 14.141 20.1063 13.7286 19.8052 13.3523C19.5042 12.976 19.017 12.976 18.0427 12.976H11.024M11.024 22C6.04018 22 2 17.9598 2 12.976C2 8.67584 5.00779 5.07818 9.03431 4.17208C9.85901 3.9865 10.2714 3.89371 10.6477 4.19475C11.024 4.4958 11.024 4.98298 11.024 5.95734V12.976M11.024 22V12.976"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
						/>
						<path
							d="M21.5541 7.02647C20.7305 4.93588 19.0641 3.26953 16.9735 2.44595C15.8783 2.01448 15.3307 1.79874 14.6653 2.25173C14 2.70472 14 3.44563 14 4.92747V6.95648C14 8.39121 14 9.10857 14.4457 9.55429C14.8914 10 15.6088 10 17.0435 10H19.0725C20.5544 10 21.2953 10 21.7483 9.33467C22.2013 8.66935 21.9855 8.12172 21.5541 7.02647Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinejoin="round"
						/>
					</svg>
				</ControlItem>
				<ControlItem>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color="currentColor" fill="none">
						<path
							d="M21 21H10C6.70017 21 5.05025 21 4.02513 19.9749C3 18.9497 3 17.2998 3 14V3"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<circle cx={8} cy={8} r={2} stroke="currentColor" fill="currentColor" strokeWidth="1.5" />
						<circle cx="11.5" cy="15.5" r="2.5" stroke="currentColor" fill="currentColor" strokeWidth="1.5" />
						<circle cx="17.5" cy="7.5" r="3.5" stroke="currentColor" fill="currentColor" strokeWidth="1.5" />
					</svg>
				</ControlItem>
				<Separator orientation="vertical" className="h-6" color="black" />

				<Button
					className="space-x-3 rounded-[9px] text-[13px] font-normal shadow-md shadow-green-300"
					onClick={() => socket.emit('gateway:process-create', 'asd')}
				>
					<Play size={16} fill="white" color="white" /> <span>Calculate LCA</span>
				</Button>
			</div>
		</div>
	);
}

export default React.memo(PlaygroundControls);
