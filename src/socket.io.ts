import config from '@/config';
import io from 'socket.io-client';

const baseUrl = config.GATEWAY_BASE_URL;

const socket = io(baseUrl, {
	autoConnect: false,
});

export default socket;
