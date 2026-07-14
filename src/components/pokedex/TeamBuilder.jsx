import { useEffect, useMemo, useState } from 'react';
import './TeamBuilder.css';

const formatName = (name = '') => name
  .replace('special-attack', 'sp.-attack')
  .replace('special-defense', 'sp.-defence')
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const TYPE_CHART = {
  normal: { strong: [], weak: ['rock', 'steel'], immune: ['ghost'] },
  fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['fire', 'water', 'rock', 'dragon'], immune: [] },
  water: { strong: ['fire', 'ground', 'rock'], weak: ['water', 'grass', 'dragon'], immune: [] },
  electric: { strong: ['water', 'flying'], weak: ['electric', 'grass', 'dragon'], immune: ['ground'] },
  grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], immune: [] },
  ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'water', 'ice', 'steel'], immune: [] },
  fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['poison', 'flying', 'psychic', 'bug', 'fairy'], immune: ['ghost'] },
  poison: { strong: ['grass', 'fairy'], weak: ['poison', 'ground', 'rock', 'ghost'], immune: ['steel'] },
  ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['grass', 'bug'], immune: ['flying'] },
  flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'rock', 'steel'], immune: [] },
  psychic: { strong: ['fighting', 'poison'], weak: ['psychic', 'steel'], immune: ['dark'] },
  bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], immune: [] },
  rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['fighting', 'ground', 'steel'], immune: [] },
  ghost: { strong: ['psychic', 'ghost'], weak: ['dark'], immune: ['normal'] },
  dragon: { strong: ['dragon'], weak: ['steel'], immune: ['fairy'] },
  dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'dark', 'fairy'], immune: [] },
  steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'water', 'electric', 'steel'], immune: [] },
  fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['fire', 'poison', 'steel'], immune: [] },
};

const ALL_TYPES = Object.keys(TYPE_CHART);

const getAttackMultiplier = (attackType, defenderTypes = []) => defenderTypes.reduce((multiplier, defenderType) => {
  const matchup = TYPE_CHART[attackType];
  if (!matchup) return multiplier;
  if (matchup.immune.includes(defenderType)) return 0;
  if (matchup.strong.includes(defenderType)) return multiplier * 2;
  if (matchup.weak.includes(defenderType)) return multiplier * 0.5;
  return multiplier;
}, 1);

const getStatValue = (member, statName) => member.stats?.find((stat) => stat.name === statName)?.value || 0;

const getTeamAnalysis = (members) => {
  const typeCounts = members.reduce((counts, member) => {
    member.types?.forEach((type) => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, {});

  const uniqueTypes = Object.keys(typeCounts);
  const overlaps = Object.entries(typeCounts).filter(([, count]) => count > 1);
  const totalStats = members.reduce((total, member) => (
    total + (member.stats || []).reduce((sum, stat) => sum + stat.value, 0)
  ), 0);
  const averagePower = members.length ? Math.round(totalStats / members.length) : 0;
  const teamAttackTypes = uniqueTypes;
  const offensiveCoverage = ALL_TYPES.filter((defenderType) => (
    teamAttackTypes.some((attackType) => getAttackMultiplier(attackType, [defenderType]) > 1)
  ));
  const uncoveredTypes = ALL_TYPES.filter((type) => !offensiveCoverage.includes(type));
  const defensiveProfile = ALL_TYPES.map((attackType) => {
    const matchups = members.map((member) => getAttackMultiplier(attackType, member.types));

    return {
      type: attackType,
      weak: matchups.filter((multiplier) => multiplier > 1).length,
      resist: matchups.filter((multiplier) => multiplier > 0 && multiplier < 1).length,
      immune: matchups.filter((multiplier) => multiplier === 0).length,
    };
  });
  const defensiveHoles = defensiveProfile
    .filter(({ weak, resist, immune }) => weak > 0 && resist + immune === 0)
    .sort((first, second) => second.weak - first.weak)
    .slice(0, 5);
  const pressureTypes = defensiveProfile
    .filter(({ weak }) => weak > 1)
    .sort((first, second) => second.weak - first.weak)
    .slice(0, 5);
  const resistCoverage = defensiveProfile
    .filter(({ resist, immune }) => resist + immune > 0)
    .sort((first, second) => (second.resist + second.immune) - (first.resist + first.immune))
    .slice(0, 5);
  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statAverages = statNames.map((statName) => ({
    name: statName,
    value: members.length ? Math.round(members.reduce((sum, member) => sum + getStatValue(member, statName), 0) / members.length) : 0,
  }));
  const sortedAverages = [...statAverages].sort((first, second) => second.value - first.value);
  const statLeaders = statNames
    .map((statName) => {
      const leader = members.reduce((best, member) => (
        getStatValue(member, statName) > getStatValue(best || {}, statName) ? member : best
      ), null);

      return leader ? { name: statName, member: leader.displayName, value: getStatValue(leader, statName) } : null;
    })
    .filter(Boolean);
  const fastestMember = statLeaders.find((leader) => leader.name === 'speed');
  const physicalBias = statAverages.find((stat) => stat.name === 'attack')?.value || 0;
  const specialBias = statAverages.find((stat) => stat.name === 'special-attack')?.value || 0;
  const defenseAverage = statAverages.find((stat) => stat.name === 'defense')?.value || 0;
  const specialDefenseAverage = statAverages.find((stat) => stat.name === 'special-defense')?.value || 0;
  const hpAverage = statAverages.find((stat) => stat.name === 'hp')?.value || 0;
  const speedAverage = statAverages.find((stat) => stat.name === 'speed')?.value || 0;
  const offenseAverage = Math.round((physicalBias + specialBias) / 2);
  const bulkAverage = Math.round((hpAverage + defenseAverage + specialDefenseAverage) / 3);

  return {
    uniqueTypes,
    overlaps,
    averagePower,
    offensiveCoverage,
    uncoveredTypes,
    defensiveHoles,
    pressureTypes,
    resistCoverage,
    statAverages,
    statLeaders,
    strongestAverage: sortedAverages[0],
    weakestAverage: sortedAverages[sortedAverages.length - 1],
    offenseAverage,
    bulkAverage,
    speedAverage,
    fastestMember,
    attackProfile: physicalBias > specialBias + 10 ? 'Physical leaning' : specialBias > physicalBias + 10 ? 'Special leaning' : 'Mixed offense',
    balance: uniqueTypes.length >= 8 && defensiveHoles.length <= 2 ? 'Competitive spread' : uniqueTypes.length >= 5 ? 'Good variety' : 'Needs variety',
    topTypes: Object.entries(typeCounts)
      .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
      .slice(0, 4),
  };
};

const TeamBuilder = ({ team = [], onRemove, onClear, onDropPokemon, onMoveMember }) => {
  const filledCount = team.filter(Boolean).length;
  const [isDragOpen, setIsDragOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const members = useMemo(() => team.filter(Boolean), [team]);
  const analysis = useMemo(() => getTeamAnalysis(members), [members]);
  const selectedMember = selectedIndex === null ? null : team[selectedIndex];

  useEffect(() => {
    if (!filledCount) {
      setSelectedIndex(null);
      return;
    }

    if (selectedIndex !== null && team[selectedIndex]) return;
    setSelectedIndex(team.findIndex(Boolean));
  }, [filledCount, selectedIndex, team]);

  const handleDragStart = (event, index) => {
    const member = team[index];

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-team-index', String(index));

    if (!member?.sprite) return;

    const dragImage = document.createElement('img');
    dragImage.src = member.sprite;
    dragImage.alt = '';
    dragImage.className = 'team-drag-image';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 32, 32);

    window.setTimeout(() => dragImage.remove(), 0);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    setIsDragOpen(false);
    event.currentTarget.classList.remove('is-drag-over');

    const teamIndex = event.dataTransfer.getData('application/x-team-index');
    if (teamIndex !== '') {
      onMoveMember?.(Number(teamIndex), index);
      return;
    }

    const pokemonPayload = event.dataTransfer.getData('application/json');
    if (!pokemonPayload) return;

    try {
      onDropPokemon?.(JSON.parse(pokemonPayload), index);
    } catch (error) {
      console.error('TeamBuilder drop parse error:', error);
    }
  };

  const handleClear = () => {
    setSelectedIndex(null);
    onClear?.();
  };

  const handleRemoveSelected = () => {
    if (selectedIndex === null) return;
    onRemove?.(selectedIndex);
    setSelectedIndex(null);
  };

  return (
    <aside
      className={`team-builder ${isDragOpen ? 'is-drag-open' : ''}`}
      aria-label="Pokemon team builder"
      tabIndex="0"
      onDragEnter={() => setIsDragOpen(true)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOpen(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsDragOpen(false);
      }}
      onDrop={() => setIsDragOpen(false)}
      onWheel={(event) => event.stopPropagation()}
    >
      <div className="team-builder-header">
        <div>
          <p>Team</p>
          <strong>{filledCount}/6 Slots</strong>
        </div>
        {filledCount > 0 && <button type="button" onClick={handleClear}>Clear</button>}
      </div>

      <div className="team-layout">
        <section className="team-overview" aria-label="Pokemon team and comparisons">
          <div className="team-slots">
            {team.map((member, index) => (
              <button
                type="button"
                className={`team-slot ${member ? 'is-filled' : ''} ${selectedIndex === index ? 'is-selected' : ''}`}
                key={member?.name || `empty-${index}`}
                onClick={() => member && setSelectedIndex(index)}
                draggable={Boolean(member)}
                onDragStart={(event) => member && handleDragStart(event, index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.currentTarget.classList.add('is-drag-over');
                }}
                onDragLeave={(event) => event.currentTarget.classList.remove('is-drag-over')}
                onDrop={(event) => handleDrop(event, index)}
                title={member ? `View ${member.displayName}` : `Empty slot ${index + 1}`}
              >
                {member ? (
                  <>
                    <img src={member.sprite} alt={`${member.displayName} pixel sprite`} />
                    <span>{member.displayName}</span>
                  </>
                ) : (
                  <span className="empty-slot">{index + 1}</span>
                )}
              </button>
            ))}
          </div>

          {filledCount > 0 && (
            <div className="comparison-board">
              <div className="comparison-card is-risk">
                <span>Defensive Holes</span>
                <strong>{analysis.defensiveHoles.length ? `${analysis.defensiveHoles.length} gaps` : 'Covered'}</strong>
                <p>{analysis.defensiveHoles.length ? analysis.defensiveHoles.slice(0, 3).map(({ type, weak }) => `${formatName(type)} x${weak}`).join(', ') : 'No open weakness.'}</p>
              </div>

              <div className="comparison-card is-warning">
                <span>Pressure</span>
                <strong>{analysis.pressureTypes.length ? 'Watch' : 'Stable'}</strong>
                <p>{analysis.pressureTypes.length ? analysis.pressureTypes.slice(0, 3).map(({ type, weak }) => `${formatName(type)} hits ${weak}`).join(', ') : 'No 2+ shared weakness.'}</p>
              </div>

              <div className="comparison-card is-safe">
                <span>Switch-Ins</span>
                <strong>{analysis.resistCoverage.length ? 'Covered' : 'Thin'}</strong>
                <p>{analysis.resistCoverage.length ? analysis.resistCoverage.slice(0, 3).map(({ type, resist, immune }) => `${formatName(type)} ${resist}R/${immune}I`).join(', ') : 'Needs pivots.'}</p>
              </div>

              <div className="comparison-card">
                <span>Missing Hits</span>
                <strong>{analysis.uncoveredTypes.length ? `${analysis.uncoveredTypes.length} types` : 'None'}</strong>
                <p>{analysis.uncoveredTypes.length ? analysis.uncoveredTypes.slice(0, 4).map(formatName).join(', ') : 'All types pressured.'}</p>
              </div>
            </div>
          )}
        </section>

        {filledCount > 0 && (
          <div className="stats-row">
          {selectedMember && (
            <section className="team-detail" aria-label={`${selectedMember.displayName} stats`}>
              <button
                type="button"
                className="remove-selected"
                onClick={handleRemoveSelected}
                aria-label={`Remove ${selectedMember.displayName}`}
                title={`Remove ${selectedMember.displayName}`}
              >
                x
              </button>

              <div className="panel-heading">
                <span>Pokemon Stats</span>
                <strong>{selectedMember.displayName}</strong>
              </div>

          <div className="team-detail-heading">
            <img src={selectedMember.artwork || selectedMember.sprite} alt={selectedMember.displayName} />
            <div>
              <span>#{String(selectedMember.id).padStart(4, '0')}</span>
              <strong>{selectedMember.displayName}</strong>
              <p>{selectedMember.species || 'Pokemon'}{selectedMember.region ? ` / ${formatName(selectedMember.region)}` : ''}</p>
            </div>
          </div>

          <div className="type-chip-row">
            {selectedMember.types?.map((type) => <span className="type-chip" key={type}>{formatName(type)}</span>)}
          </div>

          {selectedMember.stats?.length > 0 && (
            <div className="team-stat-list">
              {selectedMember.stats.map((stat) => (
                <div className="team-stat" key={stat.name}>
                  <span>{formatName(stat.name)}</span>
                  <strong>{stat.value}</strong>
                  <i style={{ '--stat-value': `${Math.min(100, Math.round((stat.value / 160) * 100))}%` }} />
                </div>
              ))}
            </div>
          )}

          {selectedMember.abilities?.length > 0 && (
            <p className="team-abilities">Abilities: {selectedMember.abilities.map(formatName).join(', ')}</p>
          )}
            </section>
          )}

            <section className="team-stats" aria-label="Team stats">
              <div className="panel-heading">
                <span>Team Stats</span>
                <strong>{analysis.fastestMember ? `Fastest: ${analysis.fastestMember.member}` : 'No stats'}</strong>
              </div>

              <div className="team-stat-summary">
                <div>
                  <span>Offense</span>
                  <strong>{analysis.offenseAverage || '--'}</strong>
                </div>
                <div>
                  <span>Bulk</span>
                  <strong>{analysis.bulkAverage || '--'}</strong>
                </div>
                <div>
                  <span>Speed</span>
                  <strong>{analysis.speedAverage || '--'}</strong>
                </div>
                <div>
                  <span>BST Avg</span>
                  <strong>{analysis.averagePower || '--'}</strong>
                </div>
              </div>

              <div className="team-stat-callouts">
                <p><span>Best Avg</span>{analysis.strongestAverage ? `${formatName(analysis.strongestAverage.name)} ${analysis.strongestAverage.value}` : '--'}</p>
                <p><span>Lowest Avg</span>{analysis.weakestAverage ? `${formatName(analysis.weakestAverage.name)} ${analysis.weakestAverage.value}` : '--'}</p>
                <p><span>Attack Bias</span>{analysis.attackProfile}</p>
              </div>

              <div className="team-average-grid">
                {analysis.statAverages.map((stat) => (
                  <div className="team-average" key={stat.name}>
                    <span>{formatName(stat.name)}</span>
                    <strong>{stat.value || '--'}</strong>
                    <i style={{ '--stat-value': `${Math.min(100, Math.round((stat.value / 140) * 100))}%` }} />
                  </div>
                ))}
              </div>

              <div className="leader-strip">
                {analysis.statLeaders.map((leader) => (
                  <div className="leader-card" key={leader.name}>
                    <span>{formatName(leader.name)}</span>
                    <strong>{leader.member}</strong>
                    <em>{leader.value}</em>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {filledCount > 0 && (
          <section className="team-analysis" aria-label="Team analysis">
          <div className="analysis-heading">
            <span>Analysis</span>
            <strong>{analysis.balance}</strong>
          </div>

          <div className="analysis-grid">
            <div>
              <span>Atk Cover</span>
              <strong>{analysis.offensiveCoverage.length}/18</strong>
            </div>
            <div>
              <span>Avg Power</span>
              <strong>{analysis.averagePower || '--'}</strong>
            </div>
            <div>
              <span>Style</span>
              <strong>{analysis.attackProfile}</strong>
            </div>
          </div>

          <div className="type-chip-row">
            {analysis.topTypes.length ? analysis.topTypes.map(([type, count]) => (
              <span className="type-chip" key={type}>{formatName(type)}{count > 1 ? ` x${count}` : ''}</span>
            )) : <span className="analysis-muted">Add Pokemon to see coverage.</span>}
          </div>

          <p className={analysis.overlaps.length ? 'analysis-warning' : 'analysis-muted'}>
            {analysis.overlaps.length
              ? `Overlap: ${analysis.overlaps.map(([type, count]) => `${formatName(type)} x${count}`).join(', ')}`
              : 'No duplicate type overlap yet.'}
          </p>
          </section>
        )}
      </div>
    </aside>
  );
};

export default TeamBuilder;
