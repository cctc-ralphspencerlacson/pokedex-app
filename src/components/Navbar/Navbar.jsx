import { useEffect, useState } from "react";
// Components
import Dropdown from "../dropdown/Dropdown";
// API
import { getPokemonTypes } from "../../service/pokeapi.js";
// Logo
import PokeApiLogo from '../../img/pokeapi.png';

// CSS
import './Navbar.css';

const Navbar = ({ setSearchQuery, setFilterQuery }) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState('pokemon-species');


  useEffect(() => {
    fetchPokemonTypes();
  }, []);


  const fetchPokemonTypes =  async () => {
    try {
      const apiData = await getPokemonTypes();
      setOptions(apiData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
  }
  
  return(
    <div className="navbar">
      <div className="logo">
        <img src={PokeApiLogo} alt="pokeapi-logo" />
      </div>

      <div className="search">
        <input 
            type="text"  
            placeholder="Search by pokedex id or name" 
            name="query"
            value={query} 
            onChange={handleQueryChange}
        />
      </div>

      <div className="filter">
        <Dropdown options={options} onSelect={setFilterQuery}/>
      </div>
    </div>
  );
}

export default Navbar;
