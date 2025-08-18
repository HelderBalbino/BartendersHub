// Lean runtime bootstrap only. All middleware/routes live in app.js
import process from 'process';
import connectDB from './config/database.js';
import app from './app.js';

const PORT = process.env.PORT || 5001;
const isTest = process.env.NODE_ENV === 'test';
let server = null;

async function startServer() {
	try {
		await connectDB();
		server = app.listen(PORT, '0.0.0.0', () => {
			const isProduction = process.env.NODE_ENV === 'production';
			const baseUrl = isProduction
				? 'https://bartendershub.onrender.com'
				: `http://localhost:${PORT}`;
			console.log(
				`\n🥃 BartendersHub API Server\n🚀 Port ${PORT}\n🌍 Env: ${process.env.NODE_ENV}\n🔗 Health: ${baseUrl}/api/health\n`,
			);
			// Lazy import websocket service to keep initial load fast
			import('./services/websocketService.js').then(({ default: ws }) =>
				ws.initialize(server),
			);
		});
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

if (!isTest) startServer();

process.on('unhandledRejection', (err) => {
	console.error('Unhandled Promise Rejection:', err);
	if (server) server.close(() => process.exit(1));
	else process.exit(1);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});

export { app, server };
export default app;
