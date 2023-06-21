import { useState } from "react";

const PokeSearch = (props) => {
  const { setSearchQuery } = props;
  const [query, setQuery] = useState("");
  
  return(
    <>
      <input 
        type="text"  
        placeholder="Search by pokedex id or name" 
        name="query"
        value={query} 
        onChange={e => setQuery(e.target.value)}
    />
      <button onClick={()=>setSearchQuery(query)}>Go</button>
    </>
  );
}

export default PokeSearch;
