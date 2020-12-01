import React from 'react';
import './App.css';
import { filledGrid } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';

function App() {
  return (
    <div className="App">
      <TetrisGrid grid={filledGrid} />
    </div>
  );
}

export default App;
