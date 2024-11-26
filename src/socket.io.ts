import io from 'socket.io-client';

const baseUrl = import.meta.env.VITE_GATEWAY_URL;

const socket = io(baseUrl, {
	autoConnect: true,
});

export default socket;
