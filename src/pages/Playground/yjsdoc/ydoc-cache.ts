import config from '@/config';
import { SocketIOProvider } from 'y-socket.io';
import * as Y from 'yjs';

const baseURL = config.GATEWAY_BASE_URL as string;

// Cache for Y.Doc instances keyed by project ID
const ydocsCache: Map<string, Y.Doc> = new Map();

// API key for Liveblocks

export function getOrCreateYDoc(projectID: string): Y.Doc {
	if (ydocsCache.has(projectID)) {
		return ydocsCache.get(projectID)!;
	}

	const ydoc = new Y.Doc();

	const roomName = `room-${projectID}`;

	const provider = new SocketIOProvider(baseURL, roomName, ydoc, {});

	provider.on('status', () => {});

	ydocsCache.set(projectID, ydoc);

	return ydoc;
}
