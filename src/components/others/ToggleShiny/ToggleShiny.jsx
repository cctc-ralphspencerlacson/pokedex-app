import sparkle from '../../../img/sparkle.png';
// CSS
import './ToggleShiny.css';

const ToggleShiny = ({ showShiny, setShowShiny }) => {

  return (
    <button className={`btn-transparent fn-toggle-shiny ${showShiny && 'active'}`} onClick={() => setShowShiny(!showShiny)}>
      <img src={sparkle} alt='sparkle' />
    </button>
  );
}

export default ToggleShiny;