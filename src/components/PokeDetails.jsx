import { useEffect, useState } from 'react';
// Service
import { getPokemonDescription } from '../service/pokeapi';
// Util
import { getStatLabel, getMaxStat } from '../utils/OtherUtils';
// CSS
import './PokeDetails.css';

const PokeDetails = ({pokeData, colorScheme}) => {
    const [pokeDesc, setPokeDesc] = useState('');

  useEffect(() => {
    fetchDescription();
  }, [pokeData]);

  const fetchDescription = async () => {
    try {
      const apiData = await getPokemonDescription(pokeData.id);
      setPokeDesc(apiData);

    } catch (error) {
      console.error("getPokemonDescription: err: " + error);
    }
  }
    console.log(pokeData)
  return (
    <>
    <div className={`content bb-${colorScheme}`}>
      <div className='visual'>

      </div>
      <div className='details'>
        <div className='desc'>
            <h3>DESCRIPTION</h3>
            <p>{pokeDesc}</p>
        </div>
        <div className='char'>
            <h3>CHARACTERISTICS</h3>
            
        </div>
        <div className='stat'>
            <h3>STATISTICS</h3>
            <div>
              {pokeData.stats.map((item) => {
                return (
                  <p>
                    {getStatLabel(item.stat.name)} ( {item.base_stat} / {getMaxStat(item.stat.name)} ) {item.base_stat}
                  </p>
                )
              })}
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PokeDetails;
