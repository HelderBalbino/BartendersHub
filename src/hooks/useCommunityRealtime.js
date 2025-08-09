import { useEffect, useState, useCallback } from 'react';
import useWebSocket from './useWebSocket';

const useCommunityRealtime = (initialMembers = []) => {
	const [members, setMembers] = useState(initialMembers);
	const [recentJoins, setRecentJoins] = useState([]);

	// Get API base URL for WebSocket connection
	const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
	const wsUrl = apiUrl.replace('/api', '').replace('http', 'ws');

	const { isConnected, joinRoom, leaveRoom, on, off } = useWebSocket(wsUrl);

	// Handle new member joining
	const handleNewMember = useCallback((event) => {
		console.log('🎉 New member joined:', event.data);

		const newMember = event.data;

		// Add to members list
		setMembers((prev) => [newMember, ...prev]);

		// Add to recent joins (show notification)
		setRecentJoins((prev) => {
			const updated = [newMember, ...prev];
			// Keep only last 5 recent joins
			return updated.slice(0, 5);
		});

		// Auto-remove from recent joins after 10 seconds
		setTimeout(() => {
			setRecentJoins((prev) => prev.filter((m) => m.id !== newMember.id));
		}, 10000);
	}, []);

	// Handle member updates (when they add cocktails, get verified, etc.)
	const handleMemberUpdate = useCallback((event) => {
		console.log('📊 Member updated:', event);

		const { userId, data } = event;

		setMembers((prev) =>
			prev.map((member) =>
				member.id === userId ? { ...member, ...data } : member,
			),
		);
	}, []);

	// Subscribe to community events
	useEffect(() => {
		if (isConnected) {
			// Join community room for real-time updates
			joinRoom('community');

			// Subscribe to events
			on('new-member', handleNewMember);
			on('member-update', handleMemberUpdate);

			return () => {
				// Cleanup: unsubscribe and leave room
				off('new-member', handleNewMember);
				off('member-update', handleMemberUpdate);
				leaveRoom('community');
			};
		}
	}, [
		isConnected,
		joinRoom,
		leaveRoom,
		on,
		off,
		handleNewMember,
		handleMemberUpdate,
	]);

	// Update members when initial data changes
	useEffect(() => {
		setMembers(initialMembers);
	}, [initialMembers]);

	// Clear a specific recent join notification
	const clearRecentJoin = useCallback((memberId) => {
		setRecentJoins((prev) => prev.filter((m) => m.id !== memberId));
	}, []);

	// Clear all recent join notifications
	const clearAllRecentJoins = useCallback(() => {
		setRecentJoins([]);
	}, []);

	return {
		members,
		recentJoins,
		isConnected,
		clearRecentJoin,
		clearAllRecentJoins,
	};
};

export default useCommunityRealtime;
