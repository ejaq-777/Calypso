import { useState, type DragEvent } from 'react';
import dropFileSvg from './assets/dropFile.svg'

function isJpeg(file: File) {
  return file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
}

async function uploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData, // Multer handles multipart form boundaries automatically
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${response.status}`);
  }
}

export default function DropZone({onUploadSuccess}: {onUploadSuccess?: () => void}) {
  const [status, setStatus] = useState<string>('');
  const [failures, setFailures] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (uploading) return;

    const dropped = Array.from(e.dataTransfer.files ?? []);
    if (dropped.length === 0) return;

    const files = dropped.filter(isJpeg);
    const skipped = dropped.length - files.length;
    setFailures([]);

    if (files.length === 0) {
      setStatus('No JPEG files found in drop.');
      return;
    }

    setUploading(true);
    let done = 0;
    let succeeded = 0;
    const failed: string[] = [];
    const total = files.length;

    // Upload files one at a time, waiting for each to finish before starting the next
    for (const file of files) {

      if (file.size === 0) {
        setStatus('Error: The selected JPEG file is empty.');
        return;
      }

      setStatus(`Processing ${file.name} (${done + 1} of ${total})...`);
      try {
        await uploadFile(file);
        succeeded++;
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        failed.push(`${file.name}: ${err instanceof Error ? err.message : 'Network or server error'}`);
      }
      done++;
    }

    const parts = [`Uploaded ${succeeded} of ${total} file${total === 1 ? '' : 's'}.`];
    if (skipped > 0) parts.push(`Skipped ${skipped} non-JPEG file${skipped === 1 ? '' : 's'}.`);
    setStatus(parts.join(' '));
    setFailures(failed);
    setUploading(false);

    if (succeeded > 0 && onUploadSuccess) {
      onUploadSuccess();
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
        cursor: uploading ? 'progress' : 'pointer',
        marginTop: '20px',
      }}
    >
      <div className="hero">
          <img src={dropFileSvg} className="base" width="400" height="300"  alt="" />
          {/* <img src={reactLogo} className="framework" alt="React logo" /> */}
          {/* <img src={viteLogo} className="vite" alt="Vite logo" /> */}
      </div>
      <p>Drop one or more jpegs here to extract image data</p>
      <p style={{ fontWeight: 'bold', color: '#007bff' }}>{status}</p>
      {failures.length > 0 && (
        <ul style={{ color: '#c0392b', textAlign: 'left', display: 'inline-block' }}>
          {failures.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}
    </div>
  );
}
