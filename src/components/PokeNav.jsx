// CSS
import './PokeNav.css';

const PokeNav = (props) => {
  const { offset, limit, hasNext, handlePrevPage, handleNextPage } = props;

  return (
    <div className="navigation">
        {/* Pagination */}
        <button className="nav prev" onClick={handlePrevPage} disabled={offset === 0}> {"<"} </button>
        <input className="offset" type="text" value={Math.ceil(offset/limit + 1)}/>
        <button className="nav next" onClick={handleNextPage} disabled={hasNext}> {">"} </button>
    </div>
  );
}

export default PokeNav;
