import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { RootRoute } from "./Presentation/routes";
import { FirebaseProvider, ThemeProvider } from "./Application/contexts";


const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <FirebaseProvider>
          <RootRoute />
        </FirebaseProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
