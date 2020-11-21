import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TetrisGrid, filledGrid } from 'nes-tetris-representation';

function App() {
  return (
    <div className="App">
      <TetrisGrid grid={filledGrid} />
    </div>
  );
}

export default App;
