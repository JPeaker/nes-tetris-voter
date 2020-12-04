interface InputHandlerMethods {
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

export default function inputHandler(methods: Partial<InputHandlerMethods>, event: KeyboardEvent): void {
  if (methods[event.code]) {
    event.preventDefault();
    methods[event.code]!();
  }
};