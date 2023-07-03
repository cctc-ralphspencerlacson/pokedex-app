// Regex
const romanNumeralRegex = /(i{1,3}|i[vx]|v|i{0,3}x|xl|x{1,3}|x[lc]|l|x{0,3}c|cd|c{1,3}|c[dm]|d|c{0,3}m)/i;


export function removeHyphen(text = 'pokemon') {
  return text.split('-').join(' ');
}

export function capitalize(text = 'pokemon') {
  return text.split(' ').map((word) => word?.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function extractRomanNumerals(string) {
  const matches = string.match(romanNumeralRegex);
  return matches ? matches[0] : null;
};