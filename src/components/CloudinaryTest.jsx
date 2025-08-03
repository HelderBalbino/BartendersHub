import React, { useEffect, useState } from 'react';

const CloudinaryTest = () => {
	const [testResults, setTestResults] = useState({
		envVars: {},
		urlTest: null,
		apiReachable: null,
	});

	useEffect(() => {
		const runTests = async () => {
			// Test 1: Check environment variables
			const envVars = {
				cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
				uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
			};

			// Test 2: Construct URL
			const uploadUrl = `https://api.cloudinary.com/v1_1/${envVars.cloudName}/image/upload`;

			// Test 3: Test API reachability
			let apiReachable = null;
			try {
				const response = await fetch(uploadUrl, { method: 'GET' });
				apiReachable = {
					status: response.status,
					statusText: response.statusText,
					reachable: response.status === 405, // 405 = Method Not Allowed (expected for GET)
				};
			} catch (error) {
				apiReachable = {
					error: error.message,
					reachable: false,
				};
			}

			setTestResults({
				envVars,
				urlTest: uploadUrl,
				apiReachable,
			});
		};

		runTests();
	}, []);

	return (
		<div
			style={{
				position: 'fixed',
				top: '10px',
				right: '10px',
				background: 'white',
				border: '2px solid #ccc',
				padding: '20px',
				borderRadius: '8px',
				maxWidth: '400px',
				fontSize: '12px',
				zIndex: 9999,
			}}
		>
			<h3>🧪 Cloudinary Configuration Test</h3>

			<div>
				<h4>1. Environment Variables:</h4>
				<p>
					<strong>Cloud Name:</strong>{' '}
					{testResults.envVars.cloudName || '❌ Missing'}
				</p>
				<p>
					<strong>Upload Preset:</strong>{' '}
					{testResults.envVars.uploadPreset || '❌ Missing'}
				</p>
			</div>

			<div>
				<h4>2. Upload URL:</h4>
				<p style={{ wordBreak: 'break-all' }}>{testResults.urlTest}</p>
			</div>

			<div>
				<h4>3. API Reachability:</h4>
				{testResults.apiReachable ? (
					testResults.apiReachable.reachable ? (
						<p style={{ color: 'green' }}>
							✅ Cloudinary API is reachable
						</p>
					) : (
						<p style={{ color: 'red' }}>
							❌ API Error:{' '}
							{testResults.apiReachable.error ||
								`${testResults.apiReachable.status} ${testResults.apiReachable.statusText}`}
						</p>
					)
				) : (
					<p>🔄 Testing...</p>
				)}
			</div>

			<div>
				<h4>4. Overall Status:</h4>
				{testResults.envVars.cloudName &&
				testResults.envVars.uploadPreset &&
				testResults.apiReachable?.reachable ? (
					<p style={{ color: 'green', fontWeight: 'bold' }}>
						✅ Configuration looks good!
					</p>
				) : (
					<p style={{ color: 'orange', fontWeight: 'bold' }}>
						⚠️ Some issues detected
					</p>
				)}
			</div>
		</div>
	);
};

export default CloudinaryTest;
