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
    // Fetch search data
    fetchSearchData();
    
    // Handle different scenarios based on search state
    if(!search) {
      // Fetch pokemons when search is empty
      fetchPokemons();
    } else {
      // Invoke the onSearch callback when search is not empty
      onSearch(search);
    }

    // Cleanup function to clear typing timeout
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  // eslint-disable-next-line 
  }, [offset, filter]);

  /**
   * Fetches search data for Pokemon search functionality and updates the search data state.
   *
   * @throws {Error} If there's an error during the search data fetch.
   */
  const fetchSearchData = async () => {
    try {
      // Fetch search data from the API
      const searchData = await getPokemonsSearchData();

      // Update the search data state with the fetched data
      setSearchData(searchData);
    } catch (error) {
      // Handle errors by logging to the console
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Fetches paginated Pokemon data based on filters and updates the Pokemon data state.
   *
   * @throws {Error} If there's an error during the Pokemon data fetch.
   */
  const fetchPokemons = async () => {
    try {
      // Set loading state to indicate data fetching
      setLoading(true);

      
      // Fetch paginated Pokemon data from the API based on filters and offset
      const apiData = await getPokemonsPaginated(filter.type, filter.gen, offset, limit);

      setTimeout(function() {
          // Update the Pokemon data state with the fetched data
          setPokemons(apiData);
          
          // Turn off loading state after a delay
          setLoading(false);
      }, 2800);
    } catch (error) {
      // Handle errors by logging to the console
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Fetches Pokemon data by ID and updates the Pokemon data state.
   *
   * @param {number} id - The ID of the Pokemon to fetch.
   * @throws {Error} If there's an error during the Pokemon data fetch.
   */
  const fetchPokemonById = async (id) => {
    try {
      // Set loading state to indicate data fetching
      setLoading(true);

      // Fetch Pokemon data from the API based on the provided ID
      const apiData = await getPokemonById(id);
      
      setTimeout(function() {
        // Update the Pokemon data state with the fetched data
        setPokemons(apiData);
        
        // Turn off loading state after a delay
        setLoading(false);
      }, 2000);
    } catch (error) {
      // Handle errors by logging to the console
      console.error("fetchPokemon: err: " + error);
    }
  }
  
  /**
   * Handles the selection of a type filter option and updates relevant state.
   *
   * @param {Object} option - The selected type filter option.
   */
  const onTypeFilter = async (option) => {
    // Reset search, offset, and selected option
    setSearch('');
    setOffset(0);
    setSelectedOption({'type': option, 'gen': null});
    
    // Update filter based on selected option
    if(!option) {
      setFilter({'type': 'pokemon-species', 'gen': 'pokemon-species'});
    } else {
      setFilter({'type': option.value, 'gen': 'pokemon-species'});
    }
  }

  /**
   * Handles the selection of a generation filter option and updates relevant state.
   *
   * @param {Object} option - The selected generation filter option.
   */
  const onGenerationFilter = async (option) => {
    // Reset search, offset, and selected option
    setSearch('');
    setOffset(0);
    setSelectedOption({'type': null, 'gen': option});
    
    // Update filter based on selected option
    if(!option) {
      setFilter({'type': 'pokemon-species', 'gen': 'pokemon-species'});
    } else {
      setFilter({'type': 'pokemon-species', 'gen': option.value, });
    }
  }

  /**
   * Handles the search action and updates relevant state based on the query.
   *
   * @param {string} query - The search query entered by the user.
   */
  const onSearch = (query) => {
    // Clear selected options for type and generation
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
        // If query is empty, reset search and fetch all pokemons
        setSearch('')
        fetchPokemons();
        return;
      } 

      if(!isNaN(query)) {
        // If query is a number, fetch a specific Pokemon by ID
        fetchPokemonById(query);
      }

      // Clear previous pokemons and set search query 
      setPokemons([]);
      setSearch(query);

      // Create a regular expression for case-insensitive matching
      const regex = new RegExp(`^${query}`, 'i');
      
      // Filter search data based on the query
      const filteredData = searchData.results.filter(item => {
        const itemName = item.name;
        return regex.test(itemName);
      });

      // Update pokemons state with filtered data
      setPokemons({
        count: filteredData.length,
        results: filteredData
      });

    }, 1000);

    // Set the new typing timeout
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