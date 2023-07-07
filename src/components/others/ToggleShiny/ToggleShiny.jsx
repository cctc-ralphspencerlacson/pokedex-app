import sparkle from '../../../img/sparkle.png';
// CSS
import './ToggleShiny.css';

const ToggleShiny = ({ showShiny, setShowShiny }) => {

  const handleOnClick = (e) => {
    e.stopPropagation();
    setShowShiny(!showShiny);
  }

  return (
    <button className={`btn-transparent fn-toggle-shiny ${showShiny && 'active'}`} onClick={handleOnClick}>
      <div className="circling-waves"></div>
      <img src={sparkle} alt='sparkle' />
    </button>
  );
}

export default ToggleShiny;