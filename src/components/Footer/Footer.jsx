// CSS
import './Footer.css';

const Footer = (props) => {
  const { offset, limit, hasPrev, hasNext, handlePrevPage, handleNextPage } = props;

  return (
    <div className='footer'>
      <div className="navigation">
        {/* Pagination */}
        <button className="nav prev" onClick={handlePrevPage} disabled={hasPrev}> &lsaquo; </button>
        <input className="offset" type="text" value={(offset + limit) / limit}/>
        <button className="nav next" onClick={handleNextPage} disabled={hasNext}> &rsaquo; </button>
      </div>
    </div>
  );
}

export default Footer;
