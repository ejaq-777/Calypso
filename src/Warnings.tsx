export default function Warnings({ setCurrentView }: { setCurrentView: (view: string) => void }) {
return (
<section>

  <button 
    type="button"
    onClick={() => setCurrentView('navigation')}
    >&larr; Back</button>

  <img src="./src/assets/warningIcon.jpg" alt="Warning icon"/>
  <h1>Warnings</h1>

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

</section>
)
}