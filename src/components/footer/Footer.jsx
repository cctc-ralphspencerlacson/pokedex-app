// CSS
import './Footer.css';

/**
 * Footer component for displaying pagination controls.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.offset - The current offset of the displayed data.
 * @param {number} props.limit - The limit of items displayed per page.
 * @param {number} props.total - The total number of items available.
 * @param {boolean} props.showPagination - Indicates whether to show pagination controls.
 * @param {Function} props.handlePageClick - Callback function for handling page clicks.
 * @returns {JSX.Element|null} The footer component or null if pagination is not shown.
 */
const Footer = ({ offset, limit, total, showPagination, handlePageClick }) => {

  /**
   * Renders pagination buttons based on the current page and total pages.
   *
   * @returns {JSX.Element[]} An array of pagination buttons.
   */
  const renderPagination = () => {
    // Calculate the total number of pages and the current page
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    // Calculate the range of visible page numbers
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(startPage + 4, totalPages);
    const pages = [];
  
    // Generate pagination buttons within the visible range
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
            &lt;
          </button>
        )}

        {pages}

        {endPage < totalPages && (
          <button
            onClick={() => handlePageClick(endPage * limit)}
            disabled={offset === endPage * limit}
          >
            &gt;
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
        {showPagination && renderPagination()}
      </div>
    </div>
  );
}

export default Footer;
