import { BlockValue, Grid } from 'nes-tetris-representation';
import { createCanvas, loadImage } from 'canvas';

export default async (grid: Grid): Promise<Buffer> => {
  const width = 600;
  const height = 1200;
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
        context.drawImage(toDraw, width * columnIndex / 10, height * (rowIndex - 2) / 20, width / 10, width / 10);
      }
    });
  });
  ['block-1', 'block-2', 'block-3'].forEach(async (filename, index) => {
    const image = await loadImage(`${__dirname}/static/${filename}.png`);
    context.drawImage(image, 0, 0, width / 10, width / 10);
  });

  return canvas.toBuffer('image/png');
};