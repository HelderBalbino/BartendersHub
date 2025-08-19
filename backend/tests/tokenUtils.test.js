import {
	generateRawToken,
	hashToken,
	createExpiringTokenPair,
} from '../src/utils/token.js';

describe('Token utilities', () => {
	test('generateRawToken length & uniqueness', () => {
		const t1 = generateRawToken();
		const t2 = generateRawToken();
		expect(t1).toHaveLength(64); // 32 bytes hex
		expect(t1).not.toBe(t2);
	});
	test('hashToken deterministic', () => {
		const raw = 'abc123';
		expect(hashToken(raw)).toBe(hashToken(raw));
	});
	test('createExpiringTokenPair returns valid structure', () => {
		const { raw, hashed, expire } = createExpiringTokenPair(5000);
		expect(raw).toBeTruthy();
		expect(hashed).toBe(hashToken(raw));
		expect(expire).toBeGreaterThan(Date.now());
	});
});
