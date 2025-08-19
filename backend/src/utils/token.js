import crypto from 'crypto';

export const generateRawToken = (bytes = 32) =>
	crypto.randomBytes(bytes).toString('hex');

export const hashToken = (token) =>
	crypto.createHash('sha256').update(token).digest('hex');

export const createExpiringTokenPair = (ttlMs = 60 * 60 * 1000) => {
	const raw = generateRawToken();
	const hashed = hashToken(raw);
	const expire = Date.now() + ttlMs;
	return { raw, hashed, expire };
};

export default {
	generateRawToken,
	hashToken,
	createExpiringTokenPair,
};
