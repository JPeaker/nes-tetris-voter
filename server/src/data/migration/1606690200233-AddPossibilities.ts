import { ActivePiece, ColumnIndex, getPiece, Orientation, PieceList, RowIndex } from "nes-tetris-representation";
import { MigrationInterface, QueryRunner } from "typeorm";
import { Possibility } from '../entity/Possibility';

const getHash = (piece: ActivePiece) => piece.blocks.map(block => `${block.column}${block.row}`).join('');

const existing: { [key: string]: boolean } = {};

const possibilities: Possibility[] = [];
for (let column = 0; column < 10; column++) {
  for (let row = 0; row < 22; row++) {
    PieceList.forEach(piece => {
      for (let orientation = 0; orientation < 4; orientation++) {
        try {
          const calculatedPiece = getPiece({ type: piece.value, row: row as RowIndex, column: column as ColumnIndex, orientation });
          if (existing[getHash(calculatedPiece)]) {
            continue;
          }

          const possibility = new Possibility();
          possibility.type = piece.value;
          possibility.column = column as ColumnIndex;
          possibility.row = row as RowIndex;
          possibility.orientation = orientation as Orientation;
          possibility.block1X = calculatedPiece.blocks[0].column;
          possibility.block1Y = calculatedPiece.blocks[0].row;
          possibility.block2X = calculatedPiece.blocks[1].column;
          possibility.block2Y = calculatedPiece.blocks[1].row;
          possibility.block3X = calculatedPiece.blocks[2].column;
          possibility.block3Y = calculatedPiece.blocks[2].row;
          possibility.block4X = calculatedPiece.blocks[3].column;
          possibility.block4Y = calculatedPiece.blocks[3].row;

          possibilities.push(possibility);

          existing[getHash(calculatedPiece)] = true;
        }
        catch {}
      }
    });
  }
}

export class AddPossibilities1606690200233 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const repo = queryRunner.connection.getRepository(Possibility);
    repo.save(possibilities.map(possibility => Possibility.create(possibility)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE possibilities');
  }

}
