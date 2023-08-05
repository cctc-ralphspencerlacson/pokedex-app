export function getStatLabel(label) {

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

export function getMaxStat(stat) {
    const tmpltLabel = {
        'hp': 255,
        'attack': 165,
        'defense': 185,
        'special-attack': 170,
        'special-defense': 155,
        'speed': 200
    };

    return tmpltLabel[stat];
}