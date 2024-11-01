import io from 'socket.io-client';

const socket = io('http://localhost:4002', {
	autoConnect: false,
});

export default socket;
