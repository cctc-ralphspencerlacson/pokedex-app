import './FilterDock.css';

const FilterDock = ({ typeOptions = [], genOptions = [], activeType, activeGen, onTypeChange, onGenChange }) => {
  const selectedGen = activeGen?.name || 'All Gen';
  const selectedType = activeType?.name || 'All Types';

  return (
    <aside className="filter-dock" aria-label="Pokemon filters" tabIndex="0">
      <div className="filter-dock-header">
        <div>
          <p>Filter deck</p>
          <strong>{selectedGen} / {selectedType}</strong>
        </div>
        <button type="button" onClick={() => { onTypeChange(null); onGenChange(null); }}>Reset</button>
      </div>

      <div className="filter-dock-body">
        <div className="filter-dock-section">
          <span className="filter-section-label">Generation</span>
          <div className="filter-dock-row" aria-label="Generation filter">
            <button type="button" className={!activeGen ? 'active' : ''} onClick={() => onGenChange(null)}>All Gen</button>
            {genOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={activeGen?.value === option.value ? 'active' : ''}
                onClick={() => onGenChange(option)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-dock-section type-section">
          <span className="filter-section-label">Type</span>
          <div className="filter-dock-row type-row" aria-label="Type filter">
            <button type="button" className={!activeType ? 'active' : ''} onClick={() => onTypeChange(null)}>All Types</button>
            {typeOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={activeType?.value === option.value ? 'active' : ''}
                onClick={() => onTypeChange(option)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterDock;
