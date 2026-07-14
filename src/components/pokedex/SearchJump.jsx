import { useEffect, useState } from 'react';
import './SearchJump.css';

const SearchJump = ({ onJump, status, loading }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) return;

    const clearSearchOnNavigate = (event) => {
      if (event.type === 'keydown' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      setQuery('');
    };

    window.addEventListener('wheel', clearSearchOnNavigate, { passive: true });
    window.addEventListener('keydown', clearSearchOnNavigate);

    return () => {
      window.removeEventListener('wheel', clearSearchOnNavigate);
      window.removeEventListener('keydown', clearSearchOnNavigate);
    };
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    onJump(value);
  };

  return (
    <form className="search-jump" onSubmit={handleSubmit}>
      <label htmlFor="pokemon-jump">Jump to Pokemon</label>
      <div>
        <input
          id="pokemon-jump"
          type="text"
          placeholder="Name or #"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'Loading' : 'Go'}</button>
      </div>
      {status && <p>{status}</p>}
    </form>
  );
};

export default SearchJump;
