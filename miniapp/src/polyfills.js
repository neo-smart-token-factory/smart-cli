import { Buffer } from 'buffer';

// Polyfill Buffer
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.global = window;
}

globalThis.Buffer = Buffer;
console.log('NΞØ Polyfills initialized');
