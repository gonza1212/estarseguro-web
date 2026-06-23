// Declaracion del modulo 'alpinejs' (archivo script, sin exports).
// Alpine no expone tipos oficiales; este shim es suficiente para el uso que
// hace este proyecto (factory data + window.Alpine).

declare module 'alpinejs' {
  interface AlpineComponent {
    init?: () => void;
  }

  type DataFactory = () => AlpineComponent & Record<string, unknown>;

  const Alpine: {
    data(name: string, factory: DataFactory): void;
    start(): void;
    destroy(): void;
  };

  export default Alpine;
}
