export const escapeBacktickString = (str: string) =>
  str.replace(/`|\\|\${/g, "\\$&");

export const printBacktickString = (str: string) =>
  "`" + escapeBacktickString(str) + "`";

export const normalizeNewlines = (string: string) =>
  string.replace(/\r\n|\r/g, "\n");
