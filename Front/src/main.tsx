import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import keycloak from './keycloak'

const root = createRoot(document.getElementById('root')!)

keycloak.init({ 
  onLoad: 'check-sso',
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
}).then(() => {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
}).catch((error) => {
  console.error("Keycloak initialization failed", error);
});
