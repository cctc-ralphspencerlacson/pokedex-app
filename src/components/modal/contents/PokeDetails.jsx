// Util
import { calculatePercentage } from '../../../utils/IntUtils';
import { getStatLabel, getMaxStat } from '../../../utils/OtherUtils';
// Components
import ProgressBar from '../../others/ProgressBar/ProgressBar';
// CSS
import './PokeDetails.css';
import { capitalize } from '../../../utils/StringUtils';

const PokeDetails = ({ pokeData, colorScheme }) => {
  
  return (
    <>
      <div className={`content bb-${colorScheme}`}>
        <div className='visual'>

        </div>
        <div className='information'>
          <div className='desc'>
            <h2>DESCRIPTION</h2>
            <p>
              {pokeData.pokedex_entry}
              <a 
                className={`c-${colorScheme}`} 
                href={`https://www.pokemon.com/us/pokedex/${pokeData.name.en}`} 
                target='_blank' 
                rel="noreferrer"> 
                read more &gt; 
              </a>
            </p>
          </div>
          <PokeChar pokeData={pokeData} colorScheme={colorScheme} />
          <PokeStats stats={pokeData.stats} colorScheme={colorScheme} />
        </div>
      </div>
    </>
  );
};

function PokeChar({pokeData, colorScheme}) {
  return (
    <div className='char'>
      <h2>CHARACTERISTICS</h2>
      <div className='container'>
        <div className='details'>
          <div className='type'>
            <h3>Type(s):</h3>
            {pokeData.types.map(({
              type
            }) => { return <img src={require(`../../../assets/poke-types/${type.name}.ico`)} alt={type.name}/>; })}
          </div>

          <div className='height'>
            <h3>Height:</h3>
            <p>{Math.round(pokeData.height * 0.328084)} ft</p>
          </div>

          <div className='weight'>
            <h3>Weight:</h3>
            <p>{Math.round(pokeData.weight* 0.220462262)} lbs</p>
          </div>
        </div>

        <div className='ability'>
          <h3>Abilities:</h3>
          {pokeData.abilities.map(({ ability }) => {
            return <p className={`c-${colorScheme}`}>- {capitalize(ability.name)}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

function PokeStats({stats, colorScheme}) {
  return (
    <div className='stat'>
      <h2>STATISTICS</h2>
      <div className='container'>
        {stats.map(({ stat, base_stat }) => {
          return (
            <div style={{ 'marginTop': '0.5rem' }}>
              <span style={{ 'width': '10%' }}>
                {getStatLabel(stat.name)}
              </span>

              <ProgressBar percentage={calculatePercentage(base_stat, getMaxStat(stat.name))} color={`bg-${colorScheme}`} />

              <span style={{ 'width': '10%', 'textAlign': 'center' }}>
                {base_stat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PokeDetails;
