import { useEffect, useState } from "react";
// Component
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PokeList from "./PokeList";
// API
import { getPokemonsPaginated } from "../service/pokeapi.js";
// CSS
import './PokeHome.css';

const PokeHome = () => {
  const [query, setQuery] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    setLimit(24)
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
      console.error("fetchPokemon: err: " + error);
    }
  }

  const handlePageClick = (newOffset) => setOffset(newOffset);
  const setSearchQuery = (query) => setQuery(query);
 
  return (
    <div>
    <Navbar 
      setSearchQuery={setSearchQuery} 
    />
      {!loading && (
        <div className="home">
          <PokeList pokemons={pokemons} />
        </div>
      )}

      <Footer 
        offset={offset}
        limit={limit}
        total={pokemons.count}
        handlePageClick={handlePageClick}
      />
    </div>
  );
}

export default PokeHome;