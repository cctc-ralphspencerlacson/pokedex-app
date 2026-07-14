import ScrollPokedex from './pokedex/ScrollPokedex';
import cryingPikachu from '../assets/pikachu/crying-pikachu.png';
import './PokeList.css';

const PokeList = ({ pokemons, onNearEnd, loadingMore, jumpRequest, isFiltering, removingNames, isAdding, addingNames, controlRequest, team, onAddToTeam }) => {
  return (
    <>
      {pokemons.count !== 0 ? (
        <ScrollPokedex
          pokemons={pokemons}
          onNearEnd={onNearEnd}
          loadingMore={loadingMore}
          jumpRequest={jumpRequest}
          isFiltering={isFiltering}
          removingNames={removingNames}
          isAdding={isAdding}
          addingNames={addingNames}
          controlRequest={controlRequest}
          team={team}
          onAddToTeam={onAddToTeam}
        />
      ) : (
        <div className="not-found">
          <h1>No Pokemon found</h1>
          <img src={cryingPikachu} alt="crying-pikachu" />
        </div>
      )}
    </>
  );
}

export default PokeList;
