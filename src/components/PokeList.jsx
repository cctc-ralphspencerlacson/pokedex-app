// Component
import PokeCard from "./PokeCard";
import './PokeList.css';

const PokeList = (props) => {
  const { pokemons } = props;

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      console.log("reached bottom")
    }
  }
  
  return(
    <div className="list" onScroll={handleScroll}>
      {pokemons.results.map((pokemon) => (
        <PokeCard name={pokemon.name} />
      ))}
    </div>
  );
}

export default PokeList;
