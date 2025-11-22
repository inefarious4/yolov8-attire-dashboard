import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
 
 const win: any = window;
 if (typeof win.process === 'undefined') {
     win.process = { env: {} };
 }
 
 ReactDOM.render(
   <React.StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </React.StrictMode>,
   document.getElementById('root')
 );