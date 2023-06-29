import './CheckboxPokeball.css';

const CheckboxPokeball = (props) => {
  const { showShiny, setShowShiny } = props;

  return (
    <div class="wrapper">
        <label class="switch">
        <input type="checkbox" 
          value={showShiny} 
          onChange={e => setShowShiny(e.target.checked)} 
        />
        <span class="slider"></span>
        </label>
    </div>
  );
}

export default CheckboxPokeball;