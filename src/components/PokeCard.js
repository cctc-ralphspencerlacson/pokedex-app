import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./BouncingPokeball/BouncingPokeball";
// API
import { getPokemonData } from "../api/pokeapi.js";
// Utils
import { removeHyphenAndCapitalize } from "../utils/StringUtils.js";

function PokeCard(props) {
  const {name} = props;

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
        const apiData = await getPokemonData(name);
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
            <p> {removeHyphenAndCapitalize(name)} </p>
        </div>
    ) : (
        <BouncingPokeball />
    )}
    </>
  );
}

export default PokeCard;
