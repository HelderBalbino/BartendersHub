module.exports = {
	testEnvironment: 'node',
	transform: {},
	globalSetup: './tests/setup/globalSetup.js',
	globalTeardown: './tests/setup/globalTeardown.js',
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov'],
	coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
	coverageThreshold: {
		global: {
			branches: 35,
			functions: 45,
			lines: 45,
			statements: 45,
		},
	},
};
