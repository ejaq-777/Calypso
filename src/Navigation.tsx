export default function Navigation({ setCurrentView }: { setCurrentView: (view: string) => void }) {
    return (
        <div>
            <div style={{ position: 'absolute' }}>
                <img src="./src/assets/calypsoLogo.svg" width="160" height="160" />
            </div>

            <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>

                <h1>Navigation</h1>
                <p>Select a page to visit:</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '20px auto' }}>
                    <button onClick={() => setCurrentView('App')}>Go to Home / Scan</button>
                    <button onClick={() => setCurrentView('warnings')}>Go to Warnings</button>
                </div>
                <section style={{
                    maxWidth: '650px',
                    margin: '40px auto',
                    textAlign: 'left'
                }}>
                    <h2>JPEG Scan Results</h2>
                    <p>Sample results for demonstration purposes.</p>

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
                    </div>
                </section>
            </div>
        </div>
    );
}