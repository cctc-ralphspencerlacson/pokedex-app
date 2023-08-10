// Util
import { calculatePercentage } from '../../../utils/IntUtils';
import { getStatLabel, getMaxStat } from '../../../utils/OtherUtils';
// Components
import ProgressBar from '../../others/ProgressBar/ProgressBar';
// CSS
import './PokeDetails.css';
import { capitalize, extractRomanNumerals } from '../../../utils/StringUtils';

const PokeDetails = ({ pokeData, colorScheme }) => {
  
  return (
    <>
      <div className={`content bb-${colorScheme}`}>
        <div className='visual'>
          <p className={`id c-${colorScheme}`}>
            #{pokeData.id < 10 ? `00${pokeData.id}` : pokeData.id < 100 ? `0${pokeData.id}` : pokeData.id}
          </p>
          <div>
            <img src={pokeData.artwork.default.front} alt={`${pokeData.name.en}-official-artwork`} />
          </div>
          <p className='name-en'>{capitalize(pokeData.name.en)}</p>
          <p className='name-jp'>{pokeData.name.jp}</p>
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
          <PokeChar data={pokeData} colorScheme={colorScheme} />
          <PokeStats stats={pokeData.stats} colorScheme={colorScheme} />
        </div>
      </div>
    </>
  );
};

function PokeChar({data, colorScheme}) {
  return (
    <div className='char'>
      <h2>CHARACTERISTICS</h2>
      <div className='container'>
        <div className='details'>
          <div className='type'>
            <h3>Type(s):</h3>
            {data.types.map(({
              type
            }) => { return <img src={require(`../../../assets/poke-types/${type.name}.ico`)} alt={type.name}/>; })}
          </div>

          <div className='height'>
            <h3>Height:</h3>
            <p>{Math.round(data.height * 0.328084)} ft</p>
          </div>

          <div className='weight'>
            <h3>Weight:</h3>
            <p>{Math.round(data.weight* 0.220462262)} lbs</p>
          </div>
        </div>

        <div className='ability'>
          <h3>Abilities:</h3>
          {data.abilities.map(({ ability, slot }) => {
            return <p>
              <span>Slot {slot}: </span>
              <span className={`c-${colorScheme}`}>{capitalize(ability.name)}</span>
            </p>;
          })}
        </div>

        <div className='others'>
          <p>Region: <span>{capitalize(data.region)}</span></p>
          <p>Generation: <span>{extractRomanNumerals(data.generation)}</span></p>
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
