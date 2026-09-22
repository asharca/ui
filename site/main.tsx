import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';
import { PreferencesProvider } from './preferences';
import './styles.css';
import './documentation.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}><PreferencesProvider><App /></PreferencesProvider></BrowserRouter></StrictMode>,
);
