import { Server } from 'socket.io';
import process from 'process';

class WebSocketService {
	constructor() {
		this.io = null;
		this.connectedClients = new Set();
	}

	initialize(server) {
		this.io = new Server(server, {
			cors: {
				origin: process.env.FRONTEND_URL || 'http://localhost:3000',
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});

		this.io.on('connection', (socket) => {
			console.log(`🔌 Client connected: ${socket.id}`);
			this.connectedClients.add(socket.id);

			// Handle client joining community room
			socket.on('join-community', () => {
				socket.join('community');
				console.log(`👥 Client ${socket.id} joined community room`);
			});

			// Handle client leaving community room
			socket.on('leave-community', () => {
				socket.leave('community');
				console.log(`👋 Client ${socket.id} left community room`);
			});

			// Handle disconnection
			socket.on('disconnect', () => {
				console.log(`🔌 Client disconnected: ${socket.id}`);
				this.connectedClients.delete(socket.id);
			});
		});

		console.log('✅ WebSocket service initialized');
	}

	// Broadcast new member registration to community
	broadcastNewMember(newUser) {
		if (!this.io) {
			console.warn('⚠️ WebSocket not initialized, cannot broadcast');
			return;
		}

		const memberData = {
			id: newUser._id,
			name: newUser.name,
			username: newUser.username,
			avatar: newUser.avatar || null,
			joinDate: newUser.createdAt,
			isVerified: newUser.isVerified || false,
			cocktailsAdded: 0, // New user starts with 0 cocktails
		};

		// Broadcast to all clients in the community room
		this.io.to('community').emit('new-member', {
			type: 'NEW_MEMBER',
			data: memberData,
			timestamp: new Date().toISOString(),
		});

		console.log(`📢 Broadcasted new member: ${newUser.name} to ${this.connectedClients.size} clients`);
	}

	// Broadcast member stats update (when they add cocktails)
	broadcastMemberUpdate(userId, updateData) {
		if (!this.io) return;

		this.io.to('community').emit('member-update', {
			type: 'MEMBER_UPDATE',
			userId,
			data: updateData,
			timestamp: new Date().toISOString(),
		});
	}

	// Get connection stats
	getStats() {
		return {
			connectedClients: this.connectedClients.size,
			isInitialized: !!this.io,
		};
	}
}

// Export singleton instance
export default new WebSocketService();
