import { BlockValue, getPieceGrid, Grid, Piece } from 'nes-tetris-representation';
import { createCanvas, loadImage } from 'canvas';

export default async (grid: Grid, currentPiece: Piece, nextPiece: Piece): Promise<Buffer> => {
  const width = 640;
  const height = 640;
  const blockSize = height / 20;
  const canvas = createCanvas(width, height);;
  const context = canvas.getContext('2d');

  context.fillStyle = '#000';
  context.fillRect(0, 0, width, height);

  const block1 = await loadImage(`${__dirname}/static/block-1.png`);
  const block2 = await loadImage(`${__dirname}/static/block-2.png`);
  const block3 = await loadImage(`${__dirname}/static/block-3.png`);
  const blockValueMap = {
    [BlockValue.ACTIVE_1]: block1,
    [BlockValue.ACTIVE_2]: block2,
    [BlockValue.ACTIVE_3]: block3,
  } as { [block: number]: any };

  grid.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      if (rowIndex < 2) {
        return;
      }
      const toDraw = blockValueMap[block];
      if (toDraw) {
        context.drawImage(toDraw, blockSize * columnIndex, blockSize * (rowIndex - 2), blockSize, blockSize);
      }
    });
  });

  context.lineWidth = 4;
  context.strokeStyle = '#ddd';
  context.strokeRect(0, 0, blockSize * 10 + context.lineWidth, blockSize * 20 + context.lineWidth);

  const currentPieceGrid = getPieceGrid(currentPiece);
  const nextPieceGrid = getPieceGrid(nextPiece);

  currentPieceGrid.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      const toDraw = blockValueMap[block];
      if (toDraw) {
        context.drawImage(toDraw, (width * 2 / 3) + blockSize * columnIndex, (height * 2 / 5) + blockSize * (rowIndex - 2), blockSize, blockSize);
      }
    });
  });

  nextPieceGrid.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      const toDraw = blockValueMap[block];
      if (toDraw) {
        context.drawImage(toDraw, (width * 2 / 3) + blockSize * columnIndex, (height * 4 / 5) + blockSize * (rowIndex - 2), blockSize, blockSize);
      }
    });
  });

  return canvas.toBuffer('image/png');
};