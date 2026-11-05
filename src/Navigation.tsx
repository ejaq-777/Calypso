export default function Navigation({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div>
        <div style={{ position: 'absolute'}}>
            <img src="./src/assets/calypsoLogo.svg" width="160" height="160"/>
        </div>

        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>

        <h1>Navigation</h1>
        <p>Select a page to visit:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '20px auto' }}>
            <button onClick={() => setCurrentView('App')}>Go to Home / Scan</button>
            <button onClick={() => setCurrentView('warnings')}>Go to Warnings</button>
        </div>
        </div>
    </div>
  );
}