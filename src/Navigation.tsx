import { useEffect, useState } from 'react';
import { type PageProps, type ImageRecord } from './types';

export default function Navigation({ setCurrentView, warningsOnly, setWarningsOnly, setSelectedImage }: PageProps) {
    const [images, setImages] = useState<ImageRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch images from MongoDB whenever the `warningsOnly` filter changes
    useEffect(() => {
        setLoading(true);
        const endpoint = warningsOnly ? '/api/images?warningsOnly=true' : '/api/images';

        fetch(endpoint)
        .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch images from server.');
            return res.json();
        })
        .then((data) => {
            setImages(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setError('Could not load scan results from database.');
            setLoading(false);
        });
    }, [warningsOnly]);

    return (
        <div>
            <div style={{ position: 'absolute' }}>
                <img src="./src/assets/calypsoLogo.svg" width="160" height="160" />
                <p>Metadata Privacy</p>
                <p>Manager</p>
            </div>

            <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>

                <h1>Navigation</h1>
                <p>Select a page to visit:</p>

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
                <section style={{
                    maxWidth: '650px',
                    margin: '40px auto',
                    textAlign: 'left'
                }}>
                    <h2>JPEG Scan Results</h2>
                    <div style={{ maxWidth: '400px', margin: '5px 0', border: '1px solid #555', padding: '5px' }}>
                        <fieldset style={{ border: 'none' }}>
                        <legend style={{ color: '#ccc'}}>Options</legend>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                            type="checkbox"
                            checked={warningsOnly}
                            onChange={(e) => setWarningsOnly(e.target.checked)}
                            style={{ marginRight: '8px' }}
                            />
                            Display warnings only
                        </label>
                        </fieldset>
                    </div>
                    <p>Showing recent files stored in MongoDB:</p>

                    {loading && <p>Loading scan results...</p>}
                    {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

                    {!loading && !error && images.length === 0 && (
                        <p>No images found in database. Try dropping an image on the upload page first or removing filters!</p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        {images.map((img) => {
                        const hasLocation = img.location; //&& img.location.latitude && img.location.longitude;

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
                                <h3 style={{ margin: '0 0 10px 0' }}>{img.originalName}</h3>
                                
                                {hasLocation ? (
                                    <p style={{ color: '#ffa94d', margin: '0 0 10px 0' }}>
                                    ⚠️ Warning: Potential location metadata detected
                                    </p>
                                ) : (
                                    <p style={{ color: '#51cf66', margin: '0 0 10px 0' }}>
                                    ✓ No sensitive location metadata detected
                                    </p>
                                )}

                                <small style={{ color: '#888' }}>
                                    Uploaded: {new Date(img.createdAt).toLocaleString()} | Size: {(img.fileSize / 1024).toFixed(1)} KB
                                </small>

                                <div style={{ marginTop: '12px' }}>
                                    <button
                                        onClick={() => {
                                            setSelectedImage(img);
                                            setCurrentView('warnings');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        style={{ padding: '6px 14px', cursor: 'pointer', background: '#5e5e5e', color: '#fff', border: 'none', borderRadius: '4px' }}
                                        >
                                        Inspect Image
                                    </button>
                                </div>
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