import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./BouncingPokeball/BouncingPokeball";
import CheckboxPokeball from "./CheckboxPokeball/CheckboxPokeball";
// API
import { getPokemonData } from "../service/pokeapi.js";
// Utils
import { removeHyphen, capitalize } from "../utils/StringUtils.js";
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

  console.log(isShiny)
  return (
    <>
    <div key={pokeData?.id} className={`card bg-${getBackgroundColor()} ${setFlash()}`}>
      { !loading ? (
          <>
            {pokeData?.hasShinyVer && (
              <CheckboxPokeball showShiny={isShiny} setShowShiny={setShowShiny} />
            )}
            <p className="id">{`#${pokeData?.id}`}</p>
            <p className="name-en">{capitalize(removeHyphen(name))}</p>
            <p className="region">{`Region: ${capitalize(pokeData?.region)}`}</p>
            <p className="height">{`Height: ${pokeData?.height}`}</p>
            <p className="weight">{`Weight: ${pokeData?.weight}`}</p>
            <img 
              src={getPokemonImage()} 
              alt={`${pokeData?.id}-${pokeData?.name.en}-sprite`} 
              style={{height: getPokemonHeight(pokeData?.height)}}
            />
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