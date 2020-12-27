import { Board, Possibility } from './CommonModels';

export interface IStorageHandler {
  vote: (board: Board, possibility: Possibility) => void;
  getVote: (id: string) => string | null;
  getVoted: () => string[];
  create: (id: string) => void;
  getCreated: () => string[];
}

type BoardId = string;
type PossibilityId = string;
interface LocalStorageValue {
  created: BoardId[];
  votes: {
    [key: string]: PossibilityId;
  }
}

export default class LocalStorageHandler implements IStorageHandler {
  static key = 'TETRIS-VOTING';

  private getValue(): LocalStorageValue {
    const item = localStorage.getItem(LocalStorageHandler.key);

    if (!item) {
      return {
        created: [],
        votes: {},
      };
    }

    return JSON.parse(item) as LocalStorageValue;
  }

  private setValue(value: LocalStorageValue) {
    localStorage.setItem(LocalStorageHandler.key, JSON.stringify(value));
  }

  vote(board: Board, possibility: Possibility) {
    const value = this.getValue();
    value.votes[board.id] = possibility.id;
    this.setValue(value);
  }

  getVote(id: BoardId): string | null {
    const value = this.getValue();
    return value.votes[id] || null;
  }

  create(id: BoardId) {
    const value = this.getValue();
    const filtered = value.created.filter(c => c !== id);
    filtered.push(id)
    this.setValue({...value, created: filtered });
  }

  getVoted(): string[] {
    const value = this.getValue();
    return Object.keys(value.votes);
  }

  getCreated(): string[] {
    const value = this.getValue();
    return value.created;
  }
}