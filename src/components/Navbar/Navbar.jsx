import { useEffect, useState } from "react";
// Components
import Dropdown from "../dropdown/Dropdown";
// Service
import { getPokemonTypes, getPokemonGenerations } from "../../service/pokeapi.js";
// Logo
import PokeApiLogo from '../../img/pokeapi.png';

// CSS
import './Navbar.css';

const Navbar = ({ selectedOption, onSearch, onTypeFilter, onGenerationFilter }) => {
  const [query, setQuery] = useState("");
  const [typeOptions, setTypeOptions] = useState('');
  const [genOptions, setGenOption] = useState('');

  useEffect(() => {
    fetchPokemonTypes();
    fetchPokemonGenerations();
  }, []);


  const fetchPokemonTypes =  async () => {
    try {
      const apiData = await getPokemonTypes();
      setTypeOptions(apiData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const fetchPokemonGenerations = async () => {
    try {
      const apiData = await getPokemonGenerations();
      setGenOption(apiData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  }

  return(
    <div className="navbar">
      <div className="logo">
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">
          <img src={PokeApiLogo} alt="pokeapi-logo" />
      </a>
      </div>

      <div className="search">
        <input 
            type="text"  
            placeholder="Search by pokedex ID or Name" 
            name="query"
            value={query} 
            onChange={handleQueryChange}
        />
      </div>

      <div className="filter">
        <span>Filter:</span>
        <Dropdown 
          header="Generation"
          options={genOptions} 
          selectedOption={selectedOption.gen}
          onSelect={onGenerationFilter} 
        />
        <Dropdown 
          header="Type"
          options={typeOptions} 
          selectedOption={selectedOption.type}
          onSelect={onTypeFilter}
        />
      </div>
    </div>
  );
}

export default Navbar;
