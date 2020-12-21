import _ from 'lodash';
import { Possibility } from "./CommonModels";
import { Orientation, Piece, PieceList } from 'nes-tetris-representation';

interface DetailMap {
  [Piece.I]: Orientation[];
  [Piece.J]: Orientation[];
  [Piece.L]: Orientation[];
  [Piece.T]: Orientation[];
  [Piece.O]: Orientation[];
  [Piece.S]: Orientation[];
  [Piece.Z]: Orientation[];
}

const flatIn: DetailMap = {
  [Piece.I]: [Orientation.Up, Orientation.Down],
  [Piece.J]: [Orientation.Up],
  [Piece.L]: [Orientation.Up],
  [Piece.T]: [Orientation.Up],
  [Piece.O]: [],
  [Piece.S]: [Orientation.Down, Orientation.Up],
  [Piece.Z]: [Orientation.Down, Orientation.Up],
};

const uprightIn: DetailMap = {
  [Piece.I]: [Orientation.Left, Orientation.Right],
  [Piece.J]: [Orientation.Left],
  [Piece.L]: [Orientation.Right],
  [Piece.T]: [],
  [Piece.O]: [],
  [Piece.S]: [Orientation.Left, Orientation.Right],
  [Piece.Z]: [Orientation.Left, Orientation.Right],
};

const spawnPositionIn: DetailMap = {
  [Piece.I]: [],
  [Piece.J]: [Orientation.Down],
  [Piece.L]: [Orientation.Down],
  [Piece.T]: [Orientation.Down],
  [Piece.O]: [],
  [Piece.S]: [],
  [Piece.Z]: [],
};

const pointingRight: DetailMap = {
  [Piece.I]: [],
  [Piece.J]: [],
  [Piece.L]: [],
  [Piece.T]: [Orientation.Right],
  [Piece.O]: [],
  [Piece.S]: [],
  [Piece.Z]: [],
};

const pointingLeft: DetailMap = {
  [Piece.I]: [],
  [Piece.J]: [],
  [Piece.L]: [],
  [Piece.T]: [Orientation.Left],
  [Piece.O]: [],
  [Piece.S]: [],
  [Piece.Z]: [],
};

const upsideDownIn: DetailMap = {
  [Piece.I]: [],
  [Piece.J]: [Orientation.Right],
  [Piece.L]: [Orientation.Left],
  [Piece.T]: [Orientation.Up],
  [Piece.O]: [],
  [Piece.S]: [],
  [Piece.Z]: [],
};

const maps: { map: DetailMap, detail: string}[] = [
  { map: flatIn, detail: 'flat' },
  { map: uprightIn, detail: 'upright' },
  { map: pointingLeft, detail: 'pointing left' },
  { map: pointingRight, detail: 'pointing right' },
  { map: spawnPositionIn, detail: 'spawn position' },
  { map: upsideDownIn, detail: 'upside down' },
];

const describer = (possibility: Possibility): string => {
  const columns = _.uniq(possibility.blocks.map(block => block.column + 1)).sort((c1, c2) => c1 - c2).join(',');

  const appropriateMap = maps.find(({ map }) => map[possibility.type].includes(possibility.orientation));
  const detail = appropriateMap ? appropriateMap.detail : 'in';

  return `${PieceList.find(({ value }) => value === possibility.type)!.label} ${detail} in ${columns}`;
};

export default describer;