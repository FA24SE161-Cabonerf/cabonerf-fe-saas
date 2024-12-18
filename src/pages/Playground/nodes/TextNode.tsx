import socket from '@/socket.io';
import { Node, NodeProps, NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { GripHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

type CabonerfTextProps = Node<{ id: string; content: string; fontSize: number }, 'text'>;

export default function TextNode({ data, selected }: NodeProps<CabonerfTextProps>) {
	const { setNodes } = useReactFlow();
	const params = useParams<{ pid: string }>();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [content, setContent] = useState('');

	useEffect(() => {
		setContent(data.content);
	}, [data.content]);

	useEffect(() => {
		const textarea = textareaRef.current;

		if (textarea) {
			textarea.style.width = '1px';
			textarea.style.width = `${textarea.scrollWidth}px`;

			textarea.style.height = 'auto'; // Reset height
			const lineCount = content.split('\n').length;
			const lineHeight = data.fontSize + 6; // Giả sử 1 dòng cao 24px
			textarea.style.height = `${lineCount * lineHeight}px`;
		}
	}, [content, data.fontSize]);

	const handleBlur = () => {
		if (content !== data.content) {
			const value: { data: string; content: string; projectId: string } = {
				content: content,
				data: data.id,
				projectId: params.pid as string,
			};
			socket.emit('gateway:cabonerf-text-update', value);

			socket.on('gateway:update-process-color-success', (data: { data: string; content: string; projectId: string }) => {
				setNodes((nodes) => {
					return nodes.map((node) => (node.id === data.data ? { ...node, data: { ...node.data, content } } : node));
				});
			});
		}
		return;
	};

	const handleChangeFontSize = (fontSize: number) => {
		const value: { data: string; fontSize: number; projectId: string } = {
			fontSize: fontSize,
			data: data.id,
			projectId: params.pid as string,
		};
		socket.emit('gateway:cabonerf-text-update-fontsize', value);
	};

	const handleDelete = () => {
		socket.emit('gateway:cabonerf-text-delete', { data: data.id, projectId: params.pid });
	};

	return (
		<div
			onBlur={handleBlur}
			className="drag-handle__label group relative rounded-md border bg-white p-1 shadow-sm transition-all"
			onContextMenu={(e) => e.preventDefault()}
		>
			<NodeToolbar isVisible={selected} className="absolute rounded bg-red-500 p-1 text-white hover:bg-red-600" position={Position.Top}>
				<button onClick={handleDelete} className="flex items-center space-x-1 text-xs font-medium">
					<Trash2 size={12} /> <span className="text-xs">Delete</span>
				</button>
			</NodeToolbar>
			<NodeToolbar isVisible={selected} className="absolute flex rounded bg-white p-1" position={Position.Bottom}>
				<button
					onClick={() => handleChangeFontSize(16)}
					className={clsx(`flex items-center space-x-1 rounded px-1 text-black hover:bg-stone-100`, {
						'font-semibold': data.fontSize === 16,
					})}
				>
					<span className="text-sm">Small</span>
				</button>
				<button
					onClick={() => handleChangeFontSize(22)}
					className={clsx(`flex items-center space-x-1 rounded px-1 text-black hover:bg-stone-100`, {
						'font-semibold': data.fontSize === 22,
					})}
				>
					<span className="text-sm">Medium</span>
				</button>
				<button
					onClick={() => handleChangeFontSize(30)}
					className={clsx(`flex items-center space-x-1 rounded px-1 text-black hover:bg-stone-100`, {
						'font-semibold': data.fontSize === 30,
					})}
				>
					<span className="text-sm">Large</span>
				</button>
			</NodeToolbar>
			<div className="drag-handle__custom opacity-0 transition-all group-hover:opacity-100">
				<GripHorizontal size={20} />
			</div>
			<div className="mt-2">
				<textarea
					ref={textareaRef}
					value={content}
					spellCheck={false}
					className="px-1"
					onChange={(e) => setContent(e.target.value)} // Cập nhật nội dung
					style={{
						resize: 'none', // Không cho phép kéo thủ công
						overflow: 'hidden', // Ẩn thanh cuộn
						whiteSpace: 'pre', // Giữ khoảng trắng và xuống dòng khi có Enter
						fontSize: `${data.fontSize}px`, // Cỡ chữ
						lineHeight: `${data.fontSize + 6}px`, // Chiều cao mỗi dòng
						outline: 'none',
						minWidth: '100px', // Đảm bảo chiều rộng ban đầu
					}}
				/>
			</div>
		</div>
	);
}
