export function coerceArray<T>(value: T | Iterable<T>): T[] {
    return Array.isArray(value) ? Array.from(value) : [value];
}
