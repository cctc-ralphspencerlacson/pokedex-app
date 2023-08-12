/**
 * Converts a Roman numeral to an integer.
 *
 * @param {string} romanNumeral - The Roman numeral to be converted.
 * @returns {number} The equivalent integer value.
 */
export function romanToInteger(romanNumeral) {
  // Mapping of Roman numerals to their integer values
  const romanToIntMap = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };
  
  // Initialize the result and previous value
  let result = 0;
  let prevValue = 0;

  // Iterate through the Roman numeral characters in reverse order
  for (let i = romanNumeral.length - 1; i >= 0; i--) {
    const currentChar = romanNumeral[i];
    const currentValue = romanToIntMap[currentChar];

    if (currentValue >= prevValue) {
      // Add the current value to the result
      result += currentValue;
    } else {
      // Subtract the current value from the result (e.g., IV, IX)
      result -= currentValue;
    }
    // Update the previous value for the next iteration
    prevValue = currentValue;
  }

  return result;
}

// Caclculate the percentage of a value from the total
export function calculatePercentage(value, total) {
  return Math.round((value / total) * 100);
};