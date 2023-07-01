import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./others/BouncingPokeball/BouncingPokeball";
import ToggleShiny from "./others/ToggleShiny/ToggleShiny";
// API
import { getPokemonData } from "../service/pokeapi.js";
// Utils
import { removeHyphen, capitalize } from "../utils/StringUtils.js";
// Images
import Default from '../img/default.png';
// CSS
import './PokeCard.css';

const PokeCard = (props) => {
  const { name } = props;
  const [pokeData, setPokeData] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
        setLoading(true);

        const apiData = await getPokemonData(name);
        setPokeData(apiData);

        setTimeout(function() {
          setLoading(false);

          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 600);
        }, 3000);

    } catch (error) {
        console.log("fetchPokemonData: err: " + error);
    }
  }

  const setFlash = () => isVisible && "flash";
  const setShowShiny = (value) => setIsShiny(value);
  const getBackgroundColor = () => pokeData ? pokeData?.color : 'default';
  const getPokemonHeight = (height) => height + 350;
  const getPokemonImage = () => isShiny ? pokeData?.artwork.shiny.front : pokeData?.artwork.default.front;
  
  return (
    <>
    <div key={pokeData?.id} className={`card bg-${getBackgroundColor()} ${setFlash()}`}>
      { !loading ? (
          <>
            {pokeData?.hasShinyVer && (
              <ToggleShiny showShiny={isShiny} setShowShiny={setShowShiny} />
            )}
            <p className="id">{`#${pokeData?.id || 'N/A'}`}</p>
            <p className="name-en">{capitalize(removeHyphen(name))}</p>
            <p className="region">{`Region: ${capitalize(pokeData?.region)}`}</p>
            <p className="height">{`Height: ${pokeData?.height || 'N/A'}`}</p>
            <p className="weight">{`Weight: ${pokeData?.weight || 'N/A'}`}</p>
            {pokeData ? (
              <img 
                src={getPokemonImage()} 
                alt={`${pokeData?.id}-${pokeData?.name.en}-sprite`} 
                style={{height: getPokemonHeight(pokeData?.height)}}
              />
            ) : (
              <img 
                src={Default} 
                alt={`unavailable-pokemon-sprite`} 
                style={{height: 200}}
              />
            )}
            <p className="name-jp">{pokeData?.name.jp}</p>
          </>
      ) : (
        <BouncingPokeball />
      )}
      </div>
    </>
  );
}

export default PokeCard;