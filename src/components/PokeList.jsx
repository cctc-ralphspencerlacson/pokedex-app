// Component
import PokeCard from "./PokeCard";
import './PokeList.css';

const PokeList = ({ pokemons }) => {

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      console.log("reached bottom")
    }
  }
  console.log(pokemons)
  return(
    <div className="list" onScroll={handleScroll}>
      {pokemons?.results?.map((pokemon) => (
        <PokeCard name={pokemon.name || pokemon.pokemon.name} />
      ))}
    </div>
  );
}

export default PokeList;
