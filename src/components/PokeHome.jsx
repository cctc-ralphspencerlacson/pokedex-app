import { useEffect, useState, useRef } from "react";
// Component
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
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
  const [page, setPage] = useState(0);

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
      console.log("fetchPokemon: err: " + error);
    }
  }

  /**
   * Go to previous page of pokemon list
   */
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  /**
   * Go to next page of pokemon list
   */
  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      console.log("reached bottom")
    }
  }

  const setSearchQuery = (query) => setQuery(query);

  console.log(pokemons)
  return (
    <div>
      {!loading ? (
        <>
        <Navbar 
          setSearchQuery={setSearchQuery} 
        />

        <div className="home" onScroll={handleScroll}>
          <PokeList pokemons={pokemons} />
        </div>

        <Footer 
          offset={offset}
          limit={limit}
          hasPrev={offset === 0}
          hasNext={pokemons.next === null} 
          handlePrevPage={handlePrevPage} 
          handleNextPage={handleNextPage}
        />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PokeHome;