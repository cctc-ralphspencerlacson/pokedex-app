/**
 * Regular expression pattern to match Roman numeral generation labels.
 * @type {RegExp}
 */
const romanNumeralRegex = /generation-([ivxlcd]+)/i;

/**
 * Removes hyphens from a given text and replaces them with spaces.
 *
 * @param {string} text - The input text containing hyphens.
 * @returns {string} The input text with hyphens replaced by spaces.
 */
export function removeHyphen(text = 'pokemon') {
  return text.split('-').join(' ');
}

/**
 * Capitalizes the first letter of each word in a given text.
 *
 * @param {string} word - The word to capitalize.
 * @returns {string} The word with the first letter capitalized.
 */
export function capitalize(text = 'pokemon') {
  return text.split(' ').map((word) => word?.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Extracts the Roman numeral portion from a given string.
 *
 * @param {string} string - The input string that contain a Roman numeral.
 * @returns {string} The extracted Roman numeral in uppercase form, or an empty string if not found.
 */
export function extractRomanNumerals(str) {
  const match = str.match(romanNumeralRegex);
  const romanNumeral = match ? match[1].toUpperCase() : "";

  return romanNumeral;
}

/**
 * Formats a hyphen-separated string into a more readable format with capitalized Roman numerals.
 *
 * @param {string} str - The input string containing hyphen-separated words.
 * @returns {string} The formatted string with the first word as is and the second word in uppercase.
 */
export function formatRomanNumerals(str) {
  const words = str.split('-');
  return `${words[0]} ${words[1].toUpperCase()}`;
}