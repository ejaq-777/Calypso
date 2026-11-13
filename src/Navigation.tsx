import { useEffect, useState } from 'react';
import { type PageProps, type ImageRecord } from './types';
import { useImageCount } from './useImageCount';

export default function Navigation({ setCurrentView, warningsOnly, setWarningsOnly, setSelectedImage }: PageProps) {
    const [images, setImages] = useState<ImageRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Total images in MongoDB
    const { count, loading: countLoading } = useImageCount(warningsOnly);

    // MongoDB 10 images list
    const [skip, setSkip] = useState<number>(0);
    const limit = 10;

    // Fetch images whenever 'warningsOnly' or 'skip' changes
    useEffect(() => {
    setLoading(true);
    fetch(`/api/images?warningsOnly=${warningsOnly}&limit=${limit}&skip=${skip}`)
        .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch image records.');
            return res.json();
        })
        .then((data) => {
            setImages(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setError('Could not load image metadata.');
            setLoading(false);
        });
    }, [warningsOnly, skip]);

    return (
        <div>
            <div style={{ position: 'fixed' }}>
                <img src="./src/assets/calypsoLogo.svg" width="160" height="160" />
                <p>Metadata Privacy</p>
                <p>Manager</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '200px', margin: '20px auto' }}>
                    <button onClick={() => {
                        setCurrentView('App'); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Go to Home / Scan
                    </button>
                </div>

                {/* 10 items per page */}
                    <div style={{ display: 'flex', flexDirection:'column', gap: '15px', marginTop: '80px', alignItems: 'center' }}>
                        <button
                        onClick={() => setSkip((prev) => Math.max(prev - limit, 0))}
                        disabled={skip === 0 || loading}
                        style={{
                            padding: '8px 16px',
                            cursor: skip === 0 ? 'not-allowed' : 'pointer',
                            background: skip === 0 ? '#222' : '#333',
                            color: skip === 0 ? '#666' : '#fff',
                            border: '1px solid #555',
                            borderRadius: '4px',
                        }}
                        >
                        ← Previous 10
                        </button>

                        <span style={{ color: '#aaa' }}>
                        Files {skip + 1} - {skip + images.length} / {countLoading ? '...' : count}
                        </span>

                        <button
                        onClick={() => setSkip((prev) => prev + limit)}
                        disabled={images.length < limit || loading}
                        style={{
                            padding: '8px 26px',
                            cursor: images.length < limit ? 'not-allowed' : 'pointer',
                            background: images.length < limit ? '#222' : '#333',
                            color: images.length < limit ? '#666' : '#fff',
                            border: '1px solid #555',
                            borderRadius: '4px',
                        }}
                        >
                        Next 10 →
                        </button>
                    </div>
            </div>

            <div style={{ textAlign: 'center', padding: '50px 0 0 200px', color: 'white' }}>

                <h1>Navigation</h1>
                <p>Select a file to inspect:</p>

                <section style={{
                    marginRight: '200px',
                    marginTop: '40px',
                    textAlign: 'center'
                }}>
                    <h2>JPEG Scan Results</h2>
                    <div style={{ textAlign: 'left', margin: '5px 0', border: '1px solid #555', padding: '5px' }}>
                        <fieldset style={{ border: 'none' }}>
                        <legend style={{ color: '#ccc'}}>Filter Options</legend>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                            type="checkbox"
                            checked={warningsOnly}
                            onChange={(e) => {
                                setWarningsOnly(e.target.checked);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ marginRight: '8px' }}
                            />
                            Display warnings only
                        </label>
                        </fieldset>
                    </div>
                </section>
                
                <section style={{
                    marginRight: '200px',
                    marginTop: '20px',
                    textAlign: 'left'
                }}>
                    
                    <p>Showing recent files stored in MongoDB:</p>

                    {loading && <p>Loading scan results...</p>}
                    {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

                    {!loading && !error && images.length === 0 && (
                        <p>No images found in database. Try dropping an image on the upload page first or removing filters!</p>
                    )}

                    <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                        {images.map((img) => {
                        const hasLocation = img.location; //&& img.location.latitude && img.location.longitude;
                         const hasCameraInfo = img.metadata && (img.metadata.make || img.metadata.model);
                        // hasWarnings check expands as we get through more metadata fields
                        const hasWarnings = hasLocation || hasCameraInfo;
                        const hasSecondaryWarnings = img.metadata && (img.metadata.dateTimeOriginal || img.metadata.fileCreateDate);
                        return (
                            <div
                                key={img._id}
                                style={{
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    background: '#2d2d2d',
                                }}
                                >

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: '0 0 10px 0' }}>{img.originalName}</h3>

                                    <button
                                        onClick={() => {
                                            setSelectedImage(img);
                                            setCurrentView('warnings');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        style={{ padding: '8px 16px', cursor: 'pointer', background: '#5e5e5e', color: '#fff', border: 'none', borderRadius: '4px' }}
                                        >
                                        Inspect Image
                                    </button>
                                </div>
                                
                                {hasWarnings ? (
                                    <p style={{ color: '#f36565', margin: '0 0 10px 0' }}>
                                    Warning: Potential sensitive metadata detected
                                    </p>
                                ) : null}

                                {hasSecondaryWarnings ? (
                                    <p style={{ color: '#fffc4d', margin: '0 0 10px 0' }}>
                                    Secondary metadata detected
                                    </p>
                                ) : null}

                                {!hasWarnings && !hasSecondaryWarnings ? (
                                    <p style={{ color: '#51cf66', margin: '0 0 10px 0' }}>
                                    ✓ No sensitive metadata detected
                                    </p>
                                ) : null}

                                <small style={{ color: '#888' }}>
                                    Uploaded: {new Date(img.createdAt).toLocaleString()} | Size: {(img.fileSize / 1024).toFixed(1)} KB
                                </small>
                            </div>
                        );
                        })}
                    </div>

                    {/* <p>Sample results for demonstration purposes.</p>

                    <div style={{
                        border: '1px solid #555',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '15px'
                    }}>
                        <h3>beach_photo.jpg</h3>
                        <p style={{ color: '#ff9800' }}>
                            Warning: Potential location metadata detected
                        </p>
                        <button
                            type="button"
                            onClick={() => setCurrentView('warnings')}
                            style={{ marginTop: '12px' }}
                        >
                            View Sample Warnings
                        </button>
                    </div>

                    <div style={{
                        border: '1px solid #555',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '15px'
                    }}>
                        <h3>family_portrait.jpg</h3>
                        <p style={{ color: '#4caf50' }}>
                            No sensitive metadata detected (sample)
                        </p>
                    </div>

                    <div style={{
                        border: '1px solid #555',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '15px'
                    }}>
                        <h3>camera_test.jpg</h3>
                        <p style={{ color: '#ff9800' }}>
                            Warning: Device information may be exposed
                        </p>
                        <button
                            type="button"
                            onClick={() => setCurrentView('warnings')}
                            style={{ marginTop: '12px' }}
                        >
                            View Sample Warnings
                        </button>
                    </div> */}
                </section>
            </div>
        </div>
    );
}