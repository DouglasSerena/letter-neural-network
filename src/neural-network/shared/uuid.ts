import isBrowser from "./is-browser";

const crypto = isBrowser() ? window.crypto : require("crypto");

export default function uuid() {
    return crypto.randomUUID();
}
