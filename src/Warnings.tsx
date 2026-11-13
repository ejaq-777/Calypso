// src/Warnings.tsx
import { type PageProps } from './types';

export default function Warnings({ setCurrentView, selectedImage }: PageProps) {
  return (
    <div>
      <div style={{ position: 'fixed' }}>
          <img src="./src/assets/calypsoLogo.svg" width="160" height="160" />
          <p>Metadata Privacy</p>
          <p>Manager</p>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '200px', margin: '20px auto'}}>
            <button 
              onClick={() => {
                setCurrentView('navigation'); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              style={{ padding: '8px 16px', cursor: 'pointer', minWidth:'100px' }}
              >
              ← Back to Navigation
            </button>
            <button 
            onClick={() => {
              setCurrentView('App'); 
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            style={{ padding: '8px 16px', minWidth:'100px', cursor: 'pointer' }}
            >
              Go to Home / Scan
            </button>
          </div>
      </div>

      <div style={{ textAlign: 'center', padding: '50px 0 0 200px', color: 'white' }}>
        <h1>Metadata Inspector</h1>
        <p>Detailed analysis for the selected image</p>
      </div>

      {!selectedImage ? (
        <div style={{ marginTop: '40px', color: '#888' }}>
          <p>No image selected for inspection.</p>
          <button 
            onClick={() => setCurrentView('navigation')} 
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Return to Navigation
          </button>
        </div>
      ) : (
        <>
          {/* Warnings */}
          <section style={{ margin: '30px 0 0 200px' }}>
            <h2
              style={{
                borderBottom: `2px solid ${selectedImage.location ? '#ffa94d' : '#51cf66'}`,
                paddingBottom: '8px',
                color: selectedImage.location ? '#ffa94d' : '#51cf66',
              }}
            >
              {selectedImage.location ? '⚠️ Privacy Risk Summary' : '✓ Security Status: Secure'}
            </h2>

            <div
              style={{
                border: `1px solid ${selectedImage.location ? '#ffa94d' : '#51cf66'}`,
                borderRadius: '8px',
                padding: '20px',
                background: selectedImage.location ? '#2d1f13' : '#142918',
                marginTop: '15px',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{selectedImage.originalName}</h3>

              {selectedImage.location && selectedImage.location.latitude ? (
                <p style={{ color: '#ffc078', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  ⚠️ GPS Location Exposed: Latitude {selectedImage.location.latitude}, Longitude {selectedImage.location.longitude}
                </p>
              ) : (
                <p style={{ color: '#51cf66', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  ✓ Secure: No sensitive location metadata detected for this file.
                </p>
              )}

              <small style={{ color: '#aaa' }}>
                Uploaded: {new Date(selectedImage.createdAt).toLocaleString()} | Size: {(selectedImage.fileSize / 1024).toFixed(1)} KB
              </small>
            </div>
          </section>

          {/* Full Metadata */}
          <section style={{ margin: '50px 0 0 200px' }}>
            <h2 style={{ borderBottom: '2px solid #555', paddingBottom: '8px' }}>
              Detailed Metadata List
            </h2>
            <p style={{ color: '#888' }}>All scanned metadata tags in file:</p>

            <div
              style={{
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '20px',
                background: '#1e1e1e',
                marginTop: '15px',
                textAlign: 'left',
              }}
            >
              <h3 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#74c0fc' }}>{selectedImage.originalName}</h3>
              
              {/* Formatted JSON view of extracted EXIF metadata */}
              <div
                style={{
                  background: '#111',
                  padding: '15px',
                  borderRadius: '6px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#adb5bd',
                }}
              >
                <pre style={{ margin: 0 }}>{JSON.stringify(selectedImage.metadata || {}, null, 2)}</pre>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}