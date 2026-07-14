import { useState } from 'react';
import './TeamBuilder.css';

const TeamBuilder = ({ team = [], onRemove, onClear, onDropPokemon, onMoveMember }) => {
  const filledCount = team.filter(Boolean).length;
  const [isDragOpen, setIsDragOpen] = useState(false);

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
    >
      <div className="team-builder-header">
        <div>
          <p>Team</p>
          <strong>{filledCount}/6 Slots</strong>
        </div>
        {filledCount > 0 && <button type="button" onClick={onClear}>Clear</button>}
      </div>

      <div className="team-slots">
        {team.map((member, index) => (
          <button
            type="button"
            className={`team-slot ${member ? 'is-filled' : ''}`}
            key={member?.name || `empty-${index}`}
            onClick={() => member && onRemove(index)}
            draggable={Boolean(member)}
            onDragStart={(event) => member && handleDragStart(event, index)}
            onDragOver={(event) => {
              event.preventDefault();
              event.currentTarget.classList.add('is-drag-over');
            }}
            onDragLeave={(event) => event.currentTarget.classList.remove('is-drag-over')}
            onDrop={(event) => handleDrop(event, index)}
            title={member ? `Remove ${member.displayName}` : `Empty slot ${index + 1}`}
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
    </aside>
  );
};

export default TeamBuilder;
