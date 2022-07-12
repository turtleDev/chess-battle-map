export function isBlack(p) {
    return p === p.toLowerCase();
}

export function isWhite(p) {
    return !isBlack(p)
}
