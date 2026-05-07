import React from 'react';
import ReactDOM from 'react-dom/client';
import '@tmr/ui-tokens/styles.css';
import '@tmr/ui-library/theme.scss';
import '@tmr/ui-library/styles.css';
import '@tmr/map-engine/styles.css';
import './styles.css';
import { App } from './App';
import { enableApiMocks } from './mocks/enableApiMocks';

enableApiMocks().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
