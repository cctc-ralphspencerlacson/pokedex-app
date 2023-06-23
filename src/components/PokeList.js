// Component
import PokeCard from "./PokeCard";
import './PokeList.css';

const PokeList = (props) => {
  const { pokemons } = props;
  
  return(
    <div className="list">
      {pokemons.results.map((pokemon) => (
        <PokeCard name={pokemon.name} />
      ))}
    </div>
  );
}

export default PokeList;
