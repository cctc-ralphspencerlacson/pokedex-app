import { useEffect, useState } from "react";
// Component
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PokeList from "./PokeList";
// Service
import { getPokemonsSearchData, getPokemonsPaginated, getPokemonById } from "../service/pokeapi.js";
// Assets
import runningPikachu from '../assets/pikachu/running-pikachu.gif';
// CSS
import './PokeHome.css';

const PokeHome = () => {
  // Pokemons
  const [pokemons, setPokemons] = useState([]);
  // Filter
  const [filter, setFilter] = useState({'type': 'pokemon-species', 'gen': 'pokemon-species'});
  const [selectedOption, setSelectedOption] = useState({'type': null, 'gen': null})
  // Search
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  // Loading
  const [loading, setLoading] = useState([]);
  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchSearchData();

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
  // eslint-disable-next-line 
  }, [offset, filter]);

  const fetchSearchData = async () => {
    try {
      const searchData = await getPokemonsSearchData();
      setSearchData(searchData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const fetchPokemons = async () => {
    try {
      setLoading(true);

      const apiData = await getPokemonsPaginated(filter.type, filter.gen, offset, limit);
      setTimeout(function() {
          setPokemons(apiData);
          setLoading(false);
      }, 3500);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const fetchPokemonById = async (id) => {
    try {
      setLoading(true);

      const apiData = await getPokemonById(id);
      
      setTimeout(function() {
          setPokemons(apiData);
          setLoading(false);
      }, 3500);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }
  
  const onTypeFilter = async (option) => {
    setSearch('');
    setOffset(0);
    setSelectedOption({'type': option, 'gen': null});
    
    if(!option) {
      setFilter({'type': 'pokemon-species', 'gen': 'pokemon-species'});
    } else {
      setFilter({'type': option.value, 'gen': 'pokemon-species'});
    }
  }

  const onGenerationFilter = async (option) => {
    setSearch('');
    setOffset(0);
    setSelectedOption({'type': null, 'gen': option});
    
    if(!option) {
      setFilter({'type': 'pokemon-species', 'gen': 'pokemon-species'});
    } else {
      setFilter({'type': 'pokemon-species', 'gen': option.value, });
    }
  }

  const onSearch = (query) => {
    setSelectedOption({
      type: null,
      gen: null
    })

    // Clear the previous timeout if exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger after 1 second of inactivity
    const newTypingTimeout = setTimeout(() => {
      // The user has stopped typing, handle the event here
      
      if(!query){
        setSearch('')
        fetchPokemons();
        return;
      } 

      if(!isNaN(query)) {
        fetchPokemonById(query);
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
        selectedOption={selectedOption}
        onSearch={onSearch}
        onTypeFilter={onTypeFilter}
        onGenerationFilter={onGenerationFilter}
      />
        {!loading ? (
          <div className="home">
            <PokeList pokemons={pokemons} />
          </div>
        ) : (
          <div className="home-loading">
            <img src={runningPikachu} alt='tenor-rafaelfracasso-15385062' />
          </div>
        )}

        <Footer 
          offset={offset}
          limit={limit}
          total={pokemons.count}
          showPagination={!search || pokemons.count === 0}
          handlePageClick={(newOffset) =>  setOffset(newOffset)}
        />
    </div>
  );
}

export default PokeHome;