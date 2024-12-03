import io from 'socket.io-client';

const baseUrl = import.meta.env.VITE_GATEWAY_DEV_URL;

const socket = io(baseUrl, {
	autoConnect: false,
});

export default socket;
