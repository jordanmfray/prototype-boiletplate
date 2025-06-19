import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// Import Radix UI themes
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

console.log('main.tsx loaded');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Theme
        appearance="light" // or "dark"
        accentColor="red" // primary color: blue, green, red, etc.
        grayColor="slate" // neutral color: slate, mauve, olive, etc.
        radius="large" // border radius: none, small, medium, large, full
        scaling="100%" // size scaling
      >
        <App />
      </Theme>
    </BrowserRouter>
  </React.StrictMode>
) 