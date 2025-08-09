import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (url) => {
	const socketRef = useRef(null);
	const [isConnected, setIsConnected] = useState(false);
	const [connectionError, setConnectionError] = useState(null);

	useEffect(() => {
		// Initialize socket connection
		socketRef.current = io(url, {
			transports: ['websocket', 'polling'],
			timeout: 20000,
		});

		const socket = socketRef.current;

		// Connection event handlers
		socket.on('connect', () => {
			console.log('🔌 Connected to WebSocket server');
			setIsConnected(true);
			setConnectionError(null);
		});

		socket.on('disconnect', (reason) => {
			console.log('🔌 Disconnected from WebSocket server:', reason);
			setIsConnected(false);
		});

		socket.on('connect_error', (error) => {
			console.warn('🔌 WebSocket connection error:', error);
			setConnectionError(error.message);
			setIsConnected(false);
		});

		// Cleanup on unmount
		return () => {
			socket.disconnect();
		};
	}, [url]);

	// Join a specific room
	const joinRoom = (room) => {
		if (socketRef.current && isConnected) {
			socketRef.current.emit(`join-${room}`);
			console.log(`👥 Joined ${room} room`);
		}
	};

	// Leave a specific room
	const leaveRoom = (room) => {
		if (socketRef.current && isConnected) {
			socketRef.current.emit(`leave-${room}`);
			console.log(`👋 Left ${room} room`);
		}
	};

	// Subscribe to events
	const on = (event, callback) => {
		if (socketRef.current) {
			socketRef.current.on(event, callback);
		}
	};

	// Unsubscribe from events
	const off = (event, callback) => {
		if (socketRef.current) {
			socketRef.current.off(event, callback);
		}
	};

	// Emit events
	const emit = (event, data) => {
		if (socketRef.current && isConnected) {
			socketRef.current.emit(event, data);
		}
	};

	return {
		socket: socketRef.current,
		isConnected,
		connectionError,
		joinRoom,
		leaveRoom,
		on,
		off,
		emit,
	};
};

export default useWebSocket;
