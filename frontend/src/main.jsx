import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios';
import { SnackbarProvider } from 'notistack';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "./context/userContext";


createRoot(document.getElementById('root')).render(
  <SnackbarProvider>
    <BrowserRouter>
    <UserProvider>
      <App />
      </UserProvider>
    </BrowserRouter>

  </SnackbarProvider>
)
