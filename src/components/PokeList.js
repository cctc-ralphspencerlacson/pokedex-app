// Component
import PokeCard from "./PokeCard";

const PokeList = (props) => {
  const { pokemons } = props;
  
  return(
    <>
    {pokemons.results.map((pokemon) => (
      <PokeCard name={pokemon.name} />
    ))}
    </>
  );
}

export default PokeList;
