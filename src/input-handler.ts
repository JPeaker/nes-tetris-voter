interface InputHandlerMethods {
  [key: string]: () => void;
}

export default function inputHandler(methods: Partial<InputHandlerMethods>, event: React.KeyboardEvent<HTMLDivElement>): void {
  const method = methods[event.key.toLowerCase()];
  if (method) {
    event.preventDefault();
    method();
  }
};