import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const ydoc = new Y.Doc();

const baseURL = import.meta.env.VITE_GATEWAY_DEV_URL;

const provider = new SocketIOProvider(baseURL, 'm2y22', ydoc, {});

provider.on('status', ({ status }: { status: string }) => {
	console.log(status); // Logs "connected" or "disconnected"
});

export default ydoc;
