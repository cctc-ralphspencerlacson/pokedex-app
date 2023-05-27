import { useEffect, useState } from "react";
// Component
import PokeCard from "./PokeCard";
// API
import { getPokemons } from "../api/pokeapi.js";

function PokeList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 12;

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
    <div>
      {!loading ? (
        <div>
          {pokemons.results.map((pokemon) => (
            <PokeCard name={pokemon.name} />
          ))}

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

export default PokeList;
