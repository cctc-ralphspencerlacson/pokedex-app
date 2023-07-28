import { useEffect, useState } from 'react';
// Service
import { getPokemonDescription } from '../service/pokeapi';
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
        </div>
      </div>
    </div>
    </>
  );
};

export default PokeDetails;
