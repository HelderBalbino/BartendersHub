import React, { useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

const CloudinaryUploadTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const { uploadImage, handleFileSelect, file, preview, uploading } = useImageUpload({
    onUploadComplete: (result) => {
      setTestResult({ success: true, result });
      setTesting(false);
    },
    onUploadError: (error) => {
      setTestResult({ success: false, error: error.message });
      setTesting(false);
    }
  });

  const createTestImage = () => {
    // Create a small test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1, 1);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'test-image.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };

  const runUploadTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const testFile = await createTestImage();
      handleFileSelect(testFile);
      
      // Wait a moment for the file to be set
      setTimeout(async () => {
        await uploadImage();
      }, 100);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h3>🚀 Cloudinary Upload Test</h3>
      
      <button 
        onClick={runUploadTest}
        disabled={testing || uploading}
        style={{
          padding: '10px 20px',
          backgroundColor: testing || uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing || uploading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {testing || uploading ? 'Testing Upload...' : 'Test Upload to Cloudinary'}
      </button>

      {file && (
        <div>
          <p><strong>Selected File:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
        </div>
      )}

      {preview && (
        <div>
          <p><strong>Preview:</strong></p>
          <img src={preview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}

      {testResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          {testResult.success ? (
            <div>
              <p><strong>✅ Upload Successful!</strong></p>
              <p><strong>URL:</strong> <a href={testResult.result.url} target="_blank" rel="noopener noreferrer">View Image</a></p>
              <p><strong>Public ID:</strong> {testResult.result.publicId}</p>
              <p><strong>Format:</strong> {testResult.result.format}</p>
              <p><strong>Dimensions:</strong> {testResult.result.width}x{testResult.result.height}</p>
            </div>
          ) : (
            <div>
              <p><strong>❌ Upload Failed</strong></p>
              <p><strong>Error:</strong> {testResult.error}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        <p>This test creates a tiny 1x1 pixel image and uploads it to Cloudinary to verify your configuration.</p>
      </div>
    </div>
  );
};

export default CloudinaryUploadTest;
