import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'prismjs'

import './css/main.css'
import 'prismjs/themes/prism-tomorrow.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
