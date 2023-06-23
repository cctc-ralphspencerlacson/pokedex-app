import { useEffect, useState } from "react";
// Component
import PokeSearch from "./PokeSearch";
import PokeList from "./PokeList";
// API
import { getPokemons, getPokemonData } from "../api/pokeapi.js";
// CSS
import './PokeHome.css';

const PokeHome = (props) => {
  const { limit } = props;
  const [query, setQuery] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);

  const setSearchQuery = (query) => setQuery(query);

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  /**
   * Get all Species of the pokemon paginated
   * - Assign to pokemons (useState)
   */
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      
      const apiData = await getPokemons(offset, limit);
      setPokemons(apiData)

      setLoading(false);
    } catch (error) {
      console.log("fetchPokemon: err: " + error);
    }
  }

  /**
   * Get next page of pokemon list
   */
  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  /**
   * Get previous page of pokemon list
   */
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  return (
    <div className="home">
      {!loading ? (
        <div>
          <PokeSearch setSearchQuery={setSearchQuery} />
          <PokeList pokemons={pokemons} />

          {/* Pagination */}
          <button onClick={handlePrevPage} disabled={offset === 0}> Previous Page </button>
          <button onClick={handleNextPage} disabled={pokemons.next === null}>Next Page</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PokeHome;
