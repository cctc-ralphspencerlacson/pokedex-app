import { useEffect, useState } from "react";
// Component
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PokeList from "./PokeList";
// API
import { getPokemonsSearchData, getPokemonsPaginated } from "../service/pokeapi.js";
// CSS
import './PokeHome.css';

const PokeHome = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filter, setFilter] = useState('pokemon-species');
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loading, setLoading] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    if(!search) {
      fetchPokemons();
    } else {
      onSearch(search);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };

  }, [offset, filter]);

  const fetchPokemons = async () => {

    const searchData = await getPokemonsSearchData();
    setSearchData(searchData);

    try {
      setLoading(true);
      
      const apiData = await getPokemonsPaginated(filter, offset, limit);
      setPokemons(apiData);
      
      setLoading(false);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }
  
  const onFilter = async (option) => {
    setSearch('');
    setOffset(0);
    setFilter(option);
  }

  const onSearch = (query) => {
    // Clear the previous timeout if exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger after 1 second of inactivity
    const newTypingTimeout = setTimeout(() => {
      // The user has stopped typing, handle the event here

      if(!query){
        setSearch('');
        setFilter('pokemon-species');
        fetchPokemons();
        return;
      } 
    
      setPokemons([]);
      setSearch(query);

      const regex = new RegExp(`^${query}`, 'i');

      const filteredData = searchData.results.filter(item => {
        const itemName = item.name;
        return regex.test(itemName);
      });

      setPokemons({
        count: filteredData.length,
        results: filteredData
      });

    }, 1000);

    setTypingTimeout(newTypingTimeout);
  
  }

  return (
    <div>
      <Navbar 
        onSearch={onSearch}
        onFilter={onFilter} 
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
          hasSearch={!search}
          handlePageClick={(newOffset) =>  setOffset(newOffset)}
        />
    </div>
  );
}

export default PokeHome;