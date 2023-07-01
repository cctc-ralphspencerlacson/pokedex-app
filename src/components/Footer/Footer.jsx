// CSS
import './Footer.css';

const Footer = (props) => {
  const { offset, limit, total, handlePageClick } = props;

  const renderPagination = () => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(startPage + 9, totalPages);
    const pages = [];
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick((i - 1) * limit)}
          disabled={offset === (i - 1) * limit}
        >
          {i}
        </button>
      );
    }
  
    return (
      <div>
        <button
          onClick={() => handlePageClick(0)}
          disabled={offset === 0}
        >
          First
        </button>

        {startPage > 1 && (
          <button
            onClick={() => handlePageClick((startPage - 2) * limit)}
            disabled={offset === (startPage - 2) * limit}
          >
            ...
          </button>
        )}

        {pages}

        {endPage < totalPages && (
          <button
            onClick={() => handlePageClick(endPage * limit)}
            disabled={offset === endPage * limit}
          >
            ...
          </button>
        )}
        
        <button
          onClick={() => handlePageClick((totalPages - 1) * limit)}
          disabled={offset === (totalPages - 1) * limit}
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className='footer'>
      <div className="navigation">
        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}

export default Footer;
