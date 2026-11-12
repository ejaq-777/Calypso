import { useState, type DragEvent } from 'react';

export default function DropZone() {
  const [status, setStatus] = useState<string>('');

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

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
      }}
    >
      <p>Drop jpeg here to extract image data</p>
      <p style={{ fontWeight: 'bold', color: '#007bff' }}>{status}</p>
    </div>
  );
}