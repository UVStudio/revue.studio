import React from 'react';
import logo from './assets/logo.svg';
import './App.css';
import { ButtonAppBar } from './components/AppBar';

function App() {
  return (
    <div className="App">
      <ButtonAppBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to Revue.Studio</p>
      </header>
    </div>
  );
}

export default App;
