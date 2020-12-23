import { BlockValue, Grid, filledGrid } from 'nes-tetris-representation';

export default function getBoardStateFromImage(imgString: string, callback: (grid: Grid) => void): void {
  const board: BlockValue[][] = [];

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d")!;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const cropOffset = -0.3;
    const SQ = (img.height / 20 + img.width / 10) / 2 + cropOffset;
    const rgbEmptyThreshold = 60; // If all three channels are <60/255, then the cell is "empty"

    // Iterate over the image and read the square colors into the board
    for (let c = 0; c < 10; c++) {
      for (let r = 0; r < 20; r++) {
        // First two invisible rows should be empty
        if (!board[r]) {
          board.push([]);
        }

        const x = Math.round((c + 0.5) * SQ);
        const y = Math.round((r + 0.5) * SQ);
        const pixelData = context.getImageData(x, y, 1, 1).data;

        if (Math.max(pixelData[0], pixelData[1], pixelData[2]) > rgbEmptyThreshold) {
          board[r][c] = filledGrid[r][c];
        } else {
          board[r][c] = BlockValue.EMPTY;
        }
      }
    }

    clearFloatingPiece(board as Grid);

    const extraRowOne = [];
    for (let c = 0; c < 10; c++) {
      extraRowOne.push(0);
    }

    const extraRowTwo = [];
    for (let c = 0; c < 10; c++) {
      extraRowTwo.push(0);
    }

    board.unshift(extraRowOne);
    board.unshift(extraRowTwo);

    callback(board as Grid);
  }
  img.src = imgString;
}

function clearFloatingPiece(board: Grid) {
  // Start from the bottom, look for an empty row, and then clear all rows above that
  let startedClearing = false;
  for (let r = 19; r >= 0; r--) {
    if (startedClearing) {
      for (let c = 0; c < 10; c++) {
        board[r][c] = 0;
      }
    } else {
      let rowEmpty = true;
      for (let c = 0; c < 10; c++) {
        if (board[r][c] !== 0) {
          rowEmpty = false;
          break;
        }
      }
      if (rowEmpty) {
        startedClearing = true;
      }
    }
  }
}