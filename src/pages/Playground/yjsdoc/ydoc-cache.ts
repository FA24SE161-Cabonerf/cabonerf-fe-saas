import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import config from '@/config';

const baseURL = config.GATEWAY_BASE_URL as string;

const ydocsCache: Map<string, Y.Doc> = new Map();

export function getOrCreateYDoc(projectID: string): Y.Doc {
	if (ydocsCache.has(projectID)) {
		return ydocsCache.get(projectID)!;
	}

	const ydoc = new Y.Doc();

	const roomName = `room-${projectID}`;

	const provider = new SocketIOProvider(baseURL, roomName, ydoc, {});

	provider.on('status', ({ status }: { status: string }) => {
		console.log(`[${roomName}] Status:`, status);
	});

	ydocsCache.set(projectID, ydoc);

	return ydoc;
}
