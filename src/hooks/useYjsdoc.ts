import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

let ydocSingleton: Y.Doc | null = null; // Singleton instance

const useYjsDoc = () => {
	const { projectId } = useParams<{ projectId: string }>(); // Lấy projectId từ URL params
	const baseURL = import.meta.env.VITE_GATEWAY_DEV_URL;

	const ydoc = useMemo(() => {
		if (!ydocSingleton) {
			ydocSingleton = new Y.Doc(); // Chỉ khởi tạo một lần duy nhất
			const provider = new SocketIOProvider(baseURL, projectId || 'default-room', ydocSingleton, {});

			provider.on('status', ({ status }: { status: string }) => {
				console.log(status); // Logs "connected" or "disconnected"
			});
		}
		return ydocSingleton;
	}, [projectId, baseURL]); // Theo dõi thay đổi của projectId

	return ydoc;
};

export default useYjsDoc;
