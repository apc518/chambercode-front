import dotenv from 'dotenv';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './App';
import './index.css';

try{
    const dotenvResult = dotenv.config();
    if(dotenvResult.error){
        console.log(dotenvResult.error)
    }
}
catch(e){
    if(process.env.NODE_ENV !== "production") {
        console.error(e);
    }
}

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);