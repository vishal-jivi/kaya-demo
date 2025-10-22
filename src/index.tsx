import React from 'react';
import ReactDOM from 'react-dom/client';
import { RootRoute } from './Presentation/routes';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RootRoute />
    </React.StrictMode>,
  );
}
