/**
 * Escapes regex special characters in user-supplied search input before it
 * is used inside a MongoDB $regex filter. Without this, a search string
 * like "(a+)+$" is passed straight to the regex engine, which is both a
 * ReDoS risk and lets the caller build arbitrary regex behavior instead of
 * a plain substring match.
 */
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default escapeRegex;
