interface InputHandlerMethods {
  escape: () => void;
  w: () => void;
  a: () => void;
  s: () => void;
  d: () => void;
  arrowup: () => void;
  arrowdown: () => void;
  enter: () => void;
  [key: string]: () => void;
}

export default function inputHandler(methods: Partial<InputHandlerMethods>, event: React.KeyboardEvent<HTMLDivElement>): void {
  if (methods[event.key.toLowerCase()]) {
    event.preventDefault();
    methods[event.key.toLowerCase()]!();
  }
};