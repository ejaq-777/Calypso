export default function Navigation({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
      <h1>Navigation Hub</h1>
      <p>Select a page to visit:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '20px auto' }}>
        <button onClick={() => setCurrentView('App')}>Go to Home / Scan</button>
        <button onClick={() => setCurrentView('warnings')}>Go to Warnings</button>
      </div>
    </div>
  );
}