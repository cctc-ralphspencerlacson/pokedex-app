// Regex
const romanNumeralRegex = /generation-([ivxlcd]+)/i;

export function removeHyphen(text = 'pokemon') {
  return text.split('-').join(' ');
}

export function capitalize(text = 'pokemon') {
  return text.split(' ').map((word) => word?.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function extractRomanNumerals(string) {
  const match = string.match(romanNumeralRegex);
  const romanNumeral = match ? match[1].toUpperCase() : "";

  return romanNumeral;
}

export function formatRomanNumerals(str) {
  const words = str.split('-');
  return `${words[0]} ${words[1].toUpperCase()}`;
}