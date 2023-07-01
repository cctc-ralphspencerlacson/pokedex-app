import { useState } from "react";
// CSS
import './Navbar.css';

const Navbar = (props) => {
  const { setSearchQuery } = props;
  const [query, setQuery] = useState("");
  
  return(
    <div className="navbar">
      <input 
        type="text"  
        placeholder="Search by pokedex id or name" 
        name="query"
        value={query} 
        onChange={e => setQuery(e.target.value)}
    />
      <button onClick={()=>setSearchQuery(query)}>Go</button>
    </div>
  );
}

export default Navbar;
