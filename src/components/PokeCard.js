import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./BouncingPokeball/BouncingPokeball";
// API
import { getPokemonData } from "../api/pokeapi.js";
// Utils
import { removeHyphenAndCapitalize } from "../utils/StringUtils.js";

const PokeCard = (props) => {
  const { name } = props;
  const [pokeData, setPokeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokemonData();
  }, []);

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
        <div>
          <p>{removeHyphenAndCapitalize(name)}</p>
        </div>
      ) : (
        <BouncingPokeball />
      )}
    </>
  );
}

export default PokeCard;
