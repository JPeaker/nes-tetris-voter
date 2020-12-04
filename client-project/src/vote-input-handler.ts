interface VoteInputHandlerMethods {
  Escape: () => void;
  KeyW: () => void;
  KeyA: () => void;
  KeyS: () => void;
  KeyD: () => void;
  ArrowUp: () => void;
  ArrowDown: () => void;
  Enter: () => void;
  [key: string]: () => void;
}

export default function voteInputHandler(methods: VoteInputHandlerMethods, event: KeyboardEvent): void {
  if (methods[event.code]) {
    event.preventDefault();
    methods[event.code]();
  }
};