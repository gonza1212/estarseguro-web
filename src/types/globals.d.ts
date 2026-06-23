// Augmentacion global: expone window.Alpine con el tipo declarado en
// alpinejs.d.ts. Este archivo SI es un modulo (tiene export {}), lo que es
// necesario para que declare global funcione.

declare global {
  interface Window {
    Alpine: typeof import('alpinejs').default;
  }
}

export {};
