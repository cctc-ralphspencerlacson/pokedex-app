/**
 * Retrieves the abbreviated label corresponding to a given full label.
 *
 * @param {string} label - The full label of a stat (e.g., 'hp', 'attack').
 * @returns {string} The abbreviated label corresponding to the full label.
 */
export function getStatLabel(label) {
    // A mapping of stat labels to their abbreviated forms.
    const tmpltLabel = {
        'hp': 'HP',
        'attack': 'ATK',
        'defense': 'DEF',
        'special-attack': 'SATK',
        'special-defense': 'SDEF',
        'speed': 'SPD'
    };

    return tmpltLabel[label];
}

/**
 * Retrieves the maximum value of a specific stat based on its label.
 *
 * @param {string} stat - The label of the stat for which the maximum value is needed.
 * @returns {number} The maximum value corresponding to the provided stat label.
 */
export function getMaxStat(label) {
    // A mapping of stat labels to their maximum values.
    const tmpltLabel = {
        'hp': 255,
        'attack': 165,
        'defense': 185,
        'special-attack': 170,
        'special-defense': 155,
        'speed': 200
    };

    return tmpltLabel[label];
}