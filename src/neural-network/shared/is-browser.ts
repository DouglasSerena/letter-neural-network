export default function isBrowser() {
    return globalThis.window !== undefined;
}
