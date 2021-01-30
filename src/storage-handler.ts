import { StringLiteralType } from 'typescript';
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

interface SeedData {
  created: string[];
  voted: string[];
}

export default class LocalStorageHandler implements IStorageHandler {
  static key = 'TETRIS-VOTING';

  private getValue(): LocalStorageValue {
    const seedData = (window as unknown as { seedData: SeedData }).seedData;
    if (!seedData.created) {
      seedData.created = [];
    }
    if (!seedData.voted) {
      seedData.voted = [];
    }
    console.log(111, seedData);
    const item = localStorage.getItem(LocalStorageHandler.key);
    const parsedItem: LocalStorageValue = item ? JSON.parse(item) : { created: [], votes: {} };
    const returnVal = {
      created: Array.from(new Set(seedData.created.concat(parsedItem.created))),
      votes: parsedItem.votes,
    };

    seedData.voted.forEach(voted => {
      returnVal.votes[voted] = '1';
    })
    console.log(returnVal);
    return returnVal;
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