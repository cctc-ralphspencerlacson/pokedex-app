import PokeHome from "./components/PokeHome";

import './App.css';

function App() {
  return (
    <div className="App">
      <PokeHome limit={20}/>
    </div>
  );
}

export default App;
