export default function Warnings({ setCurrentView }: { setCurrentView: (view: string) => void }) {
return (

<div>
  <button 
    style={{width:'100px', height:'30px'}}
    type="button"
    onClick={() => setCurrentView('navigation')}
  >&larr; Back</button>
<div style={{ textAlign: 'left', padding: '50px', color: 'white' }}>

  <div style={{ textAlign: 'center'}}>
    <img src="./src/assets/warning.svg" alt="Warning icon"/>
    <h1>Warnings</h1>
  </div>
  
  <ul>
    <li>Metadata exposes location
      <ul>
        <li>GPS coordinates can reveal where the file was created</li>
        <li>This may include your home or workplace</li>
      </ul>
    </li>
    <li>Metadata exposes time
      <ul>
        <li>The exact date and time the file was created is recorded</li>
      </ul>
    </li>
    <li>Metadata exposes device serial number
      <ul>
        <li>The serial number can link multiple files to the same device</li>
        <li>It may be used to identify the owner of the device</li>
      </ul>
    </li>
  </ul>
</div>
</div>
)
}