import { useEffect, useState } from "react";
// Component
import PokeSearch from "./PokeSearch";
import PokeList from "./PokeList";
// API
import { getPokemonsPaginated } from "../service/pokeapi.js";
// CSS
import './PokeHome.css';
import PokeNav from "./PokeNav";

const PokeHome = (props) => {
  const { limit } = props;
  const [query, setQuery] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);

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
      
      const apiData = await getPokemonsPaginated(offset, limit);
      setPokemons(apiData)

      setLoading(false);
    } catch (error) {
      console.log("fetchPokemon: err: " + error);
    }
  }

  /**
   * Get previous page of pokemon list
   */
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
      setPage(offset/limit);
    }
  };

  /**
   * Get next page of pokemon list
   */
  const handleNextPage = () => {
    setOffset(offset + limit);
    setPage(offset/limit);
  };
  
  return (
    <div className="home">
      {!loading ? (
        <div>
          <PokeSearch setSearchQuery={setSearchQuery} />
          <PokeList pokemons={pokemons} />

          <PokeNav 
            offset={offset}
            limit={limit}
            hasNext={pokemons.next === null} 
            handlePrevPage={handlePrevPage} 
            handleNextPage={handleNextPage}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PokeHome;