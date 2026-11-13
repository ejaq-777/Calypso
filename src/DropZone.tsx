import { useState, type DragEvent } from 'react';
import dropFileSvg from './assets/dropFile.svg'

export default function DropZone({onUploadSuccess}: {onUploadSuccess?: () => void}) {
  const [status, setStatus] = useState<string>('');

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' || !/\.jpe?g$/i.test(file.name)) {
  setStatus('Error: Please upload a JPEG (.jpg or .jpeg) file.');
  return;
}

if (file.size === 0) {
  setStatus('Error: The selected JPEG file is empty.');
  return;
}

    setStatus(`Processing ${file.name}...`);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData, // Multer handles multipart form boundaries automatically
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Success! Saved ID: ${data.id}`);

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('Network or server error during upload.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: '2px dashed #666',
        padding: '40px',
        textAlign: 'center',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px',
      }}
    >
      <div className="hero">
          <img src={dropFileSvg} className="base" width="400" height="300"  alt="" />
          {/* <img src={reactLogo} className="framework" alt="React logo" /> */}
          {/* <img src={viteLogo} className="vite" alt="Vite logo" /> */}
      </div>
      <p>Drop jpeg here to extract image data</p>
      <p style={{ fontWeight: 'bold', color: '#007bff' }}>{status}</p>
    </div>
  );
}
