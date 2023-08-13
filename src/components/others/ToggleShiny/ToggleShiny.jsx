import sparkle from '../../../assets/sparkle.png';
// CSS
import './ToggleShiny.css';

/**
 * ToggleShiny component for providing an interface to toggle shiny display.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.showShiny - Indicates whether shiny display is active.
 * @param {Function} props.setShowShiny - Callback function to set shiny display state.
 * @returns {JSX.Element} The ToggleShiny component.
 */
const ToggleShiny = ({ showShiny, setShowShiny }) => {

  /**
   * Handles the click event by toggling the shiny display state and stopping event propagation.
   *
   * @param {Object} e - The event object triggered by the click.
   */
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