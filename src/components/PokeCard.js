import { useEffect, useState } from "react";
// API
import { getPokemonData } from "../api/pokeapi.js";
// Utils
import { removeHyphenAndCapitalize } from "../utils/StringUtils.js";

function PokeCard(props) {
  const {pokemon} = props;

  const [pokeData, setPokeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokemonData()
  }, []);

  /**
   * Get details of Pokemon and its Specie
   * - Assign to pokeData (useState)
   */
  const fetchPokemonData = async () => {
    try {
        setLoading(true);
        const apiData = await getPokemonData(pokemon);
        setPokeData(apiData);
        setLoading(false);
    } catch (error) {
        console.log("fetchPokemonData: err: " + error);
    }
  }

  return (
    <>
    {!loading ? (
        <div key={pokeData?.pokemon?.id}>
            <p> {removeHyphenAndCapitalize(pokemon)} </p>
        </div>
    ) : (
        <p>Catching Pokemon...</p>
    )}
    </>
  );
}

export default PokeCard;
