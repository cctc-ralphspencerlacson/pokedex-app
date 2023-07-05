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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pokemon-species');
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 24;


  useEffect(() => {
    fetchPokemons();
  }, [offset, filter]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      
      const apiData = await getPokemonsPaginated(filter, offset, limit);
      setPokemons(apiData);
      
      setLoading(false);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const handlePageClick = (newOffset) => setOffset(newOffset);
  const setSearchQuery = (query) => setSearch(query);
  const setFilterQuery = (option) => setFilter(option);

  return (
    <div>
      <Navbar 
        setSearchQuery={setSearchQuery}
        setFilterQuery={setFilterQuery} 
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