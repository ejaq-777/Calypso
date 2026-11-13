import calypsoLogo from './assets/calypsoLogo.svg'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import DropZone from './DropZone'
import { type PageProps } from './types';

function App({ setCurrentView, warningsOnly, setWarningsOnly }: PageProps) {

  return (
    <>
      <section id="topleft">
        <img src={calypsoLogo} className="base" width="160" height="160"/>
        <p>Metadata Privacy</p>
        <p>Manager</p>
      </section>
      <section id="center">
        <DropZone />
        <div>
          <h1>Drop a .JPEG file</h1>
          <p>
            then click "View recent images" for observable metadata
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => {
            setCurrentView('navigation'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          View Recent Images
        </button>
        <fieldset className="options">
          <legend>Options</legend>
          <label>
            <input type="checkbox" 
              name="option1" 
              checked={warningsOnly}
              onChange={(e) => setWarningsOnly(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Display warnings only
          </label>
        </fieldset>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Resources</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                React
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>See the repository</h2>
          <p>View the GitHub repo:</p>
          <ul>
            <li>
              <a href="https://github.com/ejaq-777/Calypso" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            {/* <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li> */}
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
