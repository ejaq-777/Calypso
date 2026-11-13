// src/Warnings.tsx
import { type PageProps } from './types';

// Metadata fields that may expose sensitive information
const SENSITIVE_METADATA_FIELDS = {
  timestamp: [
    'DateTime',
    'DateTimeOriginal',
    'DateTimeDigitized',
    'CreateDate',
    'ModifyDate',
    'DateTimeCreated',
  ],
  device: [
    'Make',
    'Model',
    'Software',
    'LensModel',
    'BodySerialNumber',
    'SerialNumber',
  ],
  identity: [
    'Artist',
    'Copyright',
    'OwnerName',
    'CameraOwnerName',
    'UserComment',
  ],
};

export default function Warnings({ setCurrentView, selectedImage }: PageProps) {
  // Extract metadata from the selected image
  const metadata = selectedImage?.metadata || {};

  // Detect sensitive metadata fields
  const detectSensitiveFields = (fields: string[]) => {
    return fields.filter((field) => {
      const value = metadata[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const timestampWarnings = detectSensitiveFields(
    SENSITIVE_METADATA_FIELDS.timestamp
  );

  const deviceWarnings = detectSensitiveFields(
    SENSITIVE_METADATA_FIELDS.device
  );

  const identityWarnings = detectSensitiveFields(
    SENSITIVE_METADATA_FIELDS.identity
  );

  const hasSensitiveMetadata =
    timestampWarnings.length > 0 ||
    deviceWarnings.length > 0 ||
    identityWarnings.length > 0;
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
                borderBottom: `2px solid ${(selectedImage.location || hasSensitiveMetadata) ? '#ffa94d' : '#51cf66'}`,
                paddingBottom: '8px',
                color: (selectedImage.location || hasSensitiveMetadata) ? '#ffa94d' : '#51cf66',
              }}
            >
              {(selectedImage.location || hasSensitiveMetadata)
                ? '⚠️ Privacy Risk Summary'
                : '✓ No Sensitive Metadata Detected'}
            </h2>

            <div
              style={{
                border: `1px solid ${(selectedImage.location || hasSensitiveMetadata) ? '#ffa94d' : '#51cf66'}`,
                borderRadius: '8px',
                padding: '20px',
                background: (selectedImage.location || hasSensitiveMetadata) ? '#2d1f13' : '#142918',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{selectedImage.originalName}</h3>

              {selectedImage.location && selectedImage.location.latitude ? (
                <p style={{ color: '#ffc078', margin: '0 0 10px 0' }}>
                  GPS Location: Latitude {selectedImage.location.latitude}, Longitude {selectedImage.location.longitude}
                  {/* TODO: openstreetmap API to display location?
                  it may be a bad idea to give out location data
                  along with an IP address... */}
                </p>
              ) : (
                <p style={{ color: '#51cf66', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  ✓ No sensitive location metadata detected for this file.
                </p>
              )}
              {selectedImage.metadata && (selectedImage.metadata.make || selectedImage.metadata.model) ? (
                <p style={{ color: '#ffc078', margin: '0 0 10px 0' }}>
                  Camera Make: {selectedImage.metadata.make || 'Unknown Make'}
                  <br />
                  Camera Model: {selectedImage.metadata.model || 'Unknown Model'}
                </p>
              ) : null}

              {/* FIXME: needs formatting.
               {selectedImage.metadata && (selectedImage.metadata.dateTimeOriginal || selectedImage.metadata.fileCreateDate) ? (
                <p style={{ color: '#ffc078', margin: '0 0 10px 0' }}>
                  Original Date/Time: {selectedImage.metadata.dateTimeOriginal || selectedImage.metadata.fileCreateDate}
                </p>
              ) : null} */}

{timestampWarnings.length > 0 && (
  <div style={{ marginTop: '15px', color: '#ffc078' }}>
    <strong>⚠️ Timestamp Metadata Detected</strong>
    <p>
      This image contains date or time information that
      could reveal when the photo was taken or modified.
    </p>
    <ul>
      {timestampWarnings.map((field) => (
        <li key={field}>
          {field}: {String(metadata[field])}
        </li>
      ))}
    </ul>
  </div>
)}

{deviceWarnings.length > 0 && (
  <div style={{ marginTop: '15px', color: '#ffc078' }}>
    <strong>⚠️ Device Information Detected</strong>
    <p>
      This image contains device information that
      could reveal the camera or software used.
    </p>
    <ul>
      {deviceWarnings.map((field) => (
        <li key={field}>
          {field}: {String(metadata[field])}
        </li>
      ))}
    </ul>
  </div>
)}

{identityWarnings.length > 0 && (
  <div style={{ marginTop: '15px', color: '#ffc078' }}>
    <strong>⚠️ Personal Identity Metadata Detected</strong>
    <p>
      This image contains information that may reveal
      the photographer's identity or ownership details.
    </p>
    <ul>
      {identityWarnings.map((field) => (
        <li key={field}>
          {field}: {String(metadata[field])}
        </li>
      ))}
    </ul>
  </div>
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