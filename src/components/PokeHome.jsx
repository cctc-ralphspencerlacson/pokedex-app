import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaComputerMouse } from "react-icons/fa6";
// Component
import PokeList from "./PokeList";
import FilterDock from "./pokedex/FilterDock";
import SearchJump from "./pokedex/SearchJump";
import TeamBuilder from "./pokedex/TeamBuilder";
import BouncingPokeball from "./others/BouncingPokeball/BouncingPokeball";
// Service
import { getPokemonData, getPokemonGenerations, getPokemonsPaginated, getPokemonsSearchData, getPokemonTypes } from "../service/pokeapi.js";
// Assets
import runningPikachu from '../assets/pikachu/running-pikachu.gif';
// CSS
import './PokeHome.css';

const capitalizeTeamName = (name = '') => name
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const KeyboardHint = ({ activeControl, onControl }) => {
  const dragStart = useRef(null);
  const didDrag = useRef(false);

  const handleDragStart = (event) => {
    dragStart.current = event.clientY;
    didDrag.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleDragEnd = (event) => {
    if (dragStart.current === null) return;

    const delta = event.clientY - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) < 14) return;

    didDrag.current = true;
    onControl(delta > 0 ? 'wheel-down' : 'wheel-up');
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  const handleScrollClick = () => {
    if (didDrag.current) return;
    onControl('wheel-down');
  };

  return (
  <aside className="keyboard-hint" aria-label="Keyboard controls">
    <div className="keyboard-tooltip">
      Press Up/Down or scroll to move Pokemon. Press Left/Right to cycle Original/Shiny artwork.
    </div>
    <button type="button" className={`key key-up ${activeControl === 'up' ? 'is-active' : ''}`} onClick={() => onControl('up')}><FaArrowUp /></button>
    <div className="key-row">
      <button type="button" className={`key ${activeControl === 'left' ? 'is-active' : ''}`} onClick={() => onControl('left')}><FaArrowLeft /></button>
      <button type="button" className={`key ${activeControl === 'down' ? 'is-active' : ''}`} onClick={() => onControl('down')}><FaArrowDown /></button>
      <button type="button" className={`key ${activeControl === 'right' ? 'is-active' : ''}`} onClick={() => onControl('right')}><FaArrowRight /></button>
    </div>
    <button
      type="button"
      className={`mouse-key ${activeControl === 'wheel-up' || activeControl === 'wheel-down' ? 'is-active' : ''}`}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
      onPointerCancel={() => { dragStart.current = null; }}
      onClick={handleScrollClick}
    >
      <FaComputerMouse />
      <span>{activeControl === 'wheel-up' ? 'Scroll Up' : activeControl === 'wheel-down' ? 'Scroll Down' : 'Scroll'}</span>
    </button>
  </aside>
  );
};

const PokeHome = () => {
  // Pokemons
  const [pokemons, setPokemons] = useState([]);
  // Loading
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [genOptions, setGenOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({ type: null, gen: null });
  const [filter, setFilter] = useState({ type: 'pokemon-species', gen: 'pokemon-species' });
  const [jumpRequest, setJumpRequest] = useState(null);
  const [jumpStatus, setJumpStatus] = useState('');
  const [jumpLoading, setJumpLoading] = useState(false);
  const [deckFiltering, setDeckFiltering] = useState(false);
  const [removingNames, setRemovingNames] = useState([]);
  const [deckAdding, setDeckAdding] = useState(false);
  const [addingNames, setAddingNames] = useState([]);
  const [team, setTeam] = useState(Array(6).fill(null));
  const [activeControl, setActiveControl] = useState(null);
  const [controlRequest, setControlRequest] = useState(null);
  const loadingMoreRef = useRef(false);
  const isFirstLoad = useRef(true);
  const controlGlowTimeout = useRef(null);
  const limit = 24;

  const flashControl = (control) => {
    setActiveControl(control);
    if (controlGlowTimeout.current) window.clearTimeout(controlGlowTimeout.current);
    controlGlowTimeout.current = window.setTimeout(() => setActiveControl(null), 260);
  };

  const triggerControl = (control) => {
    flashControl(control);
    setControlRequest({ control, nonce: Date.now() });
  };

  const toTeamMember = (pokemon) => ({
    name: pokemon.name.en,
    displayName: capitalizeTeamName(pokemon.name.en),
    id: pokemon.id,
    sprite: pokemon.sprites?.default?.front || pokemon.artwork?.default?.front,
    types: pokemon.types?.map(({ type }) => type.name) || [],
  });

  const addPokemonToTeam = (pokemon) => {
    if (!pokemon) return;

    setTeam((currentTeam) => {
      if (currentTeam.some((member) => member?.name === pokemon.name.en)) return currentTeam;

      const emptyIndex = currentTeam.findIndex((member) => !member);
      if (emptyIndex === -1) return currentTeam;

      const nextTeam = [...currentTeam];
      nextTeam[emptyIndex] = toTeamMember(pokemon);

      return nextTeam;
    });
  };

  const placePokemonInTeamSlot = (pokemon, slotIndex) => {
    if (!pokemon) return;

    setTeam((currentTeam) => {
      const nextTeam = currentTeam.map((member) => member?.name === pokemon.name.en ? null : member);
      nextTeam[slotIndex] = toTeamMember(pokemon);
      return nextTeam;
    });
  };

  const moveTeamMember = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    setTeam((currentTeam) => {
      const nextTeam = [...currentTeam];
      const movingMember = nextTeam[fromIndex];
      nextTeam[fromIndex] = nextTeam[toIndex];
      nextTeam[toIndex] = movingMember;
      return nextTeam;
    });
  };

  const removePokemonFromTeam = (index) => {
    setTeam((currentTeam) => currentTeam.map((member, memberIndex) => memberIndex === index ? null : member));
  };

  const clearTeam = () => setTeam(Array(6).fill(null));

  useEffect(() => {
    fetchPokemons(0, false);
    fetchSearchData();
    fetchFilterOptions();
  // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const controlByKey = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      if (controlByKey[event.key]) flashControl(controlByKey[event.key]);
    };

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 20) return;
      flashControl(event.deltaY > 0 ? 'wheel-down' : 'wheel-up');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      if (controlGlowTimeout.current) window.clearTimeout(controlGlowTimeout.current);
    };
  }, []);

  const fetchSearchData = async () => {
    try {
      const data = await getPokemonsSearchData();
      setSearchData(data?.results || []);
    } catch (error) {
      console.error("fetchSearchData: err: " + error);
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const [types, generations] = await Promise.all([
        getPokemonTypes(),
        getPokemonGenerations(),
      ]);
      setTypeOptions(types || []);
      setGenOptions(generations || []);
    } catch (error) {
      console.error("fetchFilterOptions: err: " + error);
    }
  }

  /**
   * Fetches paginated Pokemon data based on filters and updates the Pokemon data state.
   *
   * @throws {Error} If there's an error during the Pokemon data fetch.
   */
  const fetchPokemons = async (offset = 0, append = false, activeFilter = filter, showLoader = true) => {
    try {
      if (append) {
        setLoadingMore(true);
        loadingMoreRef.current = true;
      } else if (showLoader) {
        setLoading(true);
      }

      const apiData = await getPokemonsPaginated(activeFilter.type, activeFilter.gen, offset, limit);
      const delay = append ? 500 : showLoader ? 1800 : 0;

      await new Promise((resolve) => window.setTimeout(resolve, delay));
          setPokemons((prev) => {
            if (!append) return apiData;

            const previousResults = prev?.results || [];
            const nextResults = apiData?.results || [];
            const seen = new Set(previousResults.map((pokemon) => pokemon.name || pokemon.pokemon?.name));
            const mergedResults = [
              ...previousResults,
              ...nextResults.filter((pokemon) => !seen.has(pokemon.name || pokemon.pokemon?.name)),
            ];

            return {
              count: apiData.count,
              results: mergedResults,
            };
          });
          setLoading(false);
          setLoadingMore(false);
          loadingMoreRef.current = false;
          isFirstLoad.current = false;
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
      setLoading(false);
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }

  const loadMorePokemons = () => {
    const loaded = pokemons?.results?.length || 0;
    const total = pokemons?.count || 0;

    if (loadingMoreRef.current || loaded === 0 || loaded >= total) return;
    fetchPokemons(loaded, true, filter);
  }

  const getPokemonName = (pokemon) => pokemon?.name || pokemon?.pokemon?.name;

  const applyFilter = async (nextFilter) => {
    setFilter(nextFilter);
    setJumpRequest(null);

    try {
      const nextData = await getPokemonsPaginated(nextFilter.type, nextFilter.gen, 0, limit);
      const nextNames = new Set((nextData?.results || []).map(getPokemonName));
      const currentNames = new Set((pokemons?.results || []).map(getPokemonName));
      const removed = (pokemons?.results || [])
        .map(getPokemonName)
        .filter((name) => name && !nextNames.has(name));
      const added = (nextData?.results || [])
        .map(getPokemonName)
        .filter((name) => name && !currentNames.has(name));
      const nextPokemonNames = (nextData?.results || [])
        .map(getPokemonName)
        .filter(Boolean);

      await Promise.allSettled(nextPokemonNames.map((name) => getPokemonData(name)));

      setRemovingNames(removed);
      setAddingNames([]);
      setDeckAdding(false);
      setDeckFiltering(true);

      window.setTimeout(() => {
        setPokemons(nextData);
        setDeckFiltering(false);
        setRemovingNames([]);
        setAddingNames(added);
        setDeckAdding(true);
        window.setTimeout(() => {
          setDeckAdding(false);
          setAddingNames([]);
        }, 1900);
      }, 920);
    } catch (error) {
      console.error("applyFilter: err: " + error);
      setDeckFiltering(false);
      setRemovingNames([]);
      setDeckAdding(false);
      setAddingNames([]);
    }
  }

  const onTypeFilter = (option) => {
    setSelectedOption((prev) => ({ ...prev, type: option }));
    applyFilter({ ...filter, type: option ? option.value : 'pokemon-species' });
  }

  const onGenerationFilter = (option) => {
    setSelectedOption((prev) => ({ ...prev, gen: option }));
    applyFilter({ ...filter, gen: option ? option.value : 'pokemon-species' });
  }

  const jumpToPokemon = async (query) => {
    const value = query.trim().toLowerCase().replace(/^#/, '');
    if (!value) return;

    setJumpLoading(true);
    setJumpRequest(null);
    setSelectedOption({ type: null, gen: null });
    setFilter({ type: 'pokemon-species', gen: 'pokemon-species' });
    setDeckFiltering(false);
    setRemovingNames([]);
    setDeckAdding(false);
    setAddingNames([]);

    const targetIndex = /^\d+$/.test(value)
      ? Number(value) - 1
      : searchData.findIndex((pokemon) => pokemon.name.toLowerCase() === value);

    if (targetIndex < 0) {
      setJumpStatus('Pokemon not found');
      setJumpLoading(false);
      return;
    }

    setJumpStatus('Fetching Pokemon first...');

    let availableResults = [];

    try {
      const desiredLimit = Math.max(targetIndex + limit, limit);
      const data = await getPokemonsPaginated('pokemon-species', 'pokemon-species', 0, desiredLimit);
      availableResults = data?.results || [];
      setPokemons(data);
    } catch (error) {
      console.error("jumpToPokemon: err: " + error);
      setJumpStatus('Could not load Pokemon');
      setJumpLoading(false);
      return;
    }

    const preloadStart = Math.max(0, targetIndex - 4);
    const preloadEnd = Math.min(availableResults.length - 1, targetIndex + 4);
    const preloadNames = availableResults
      .slice(preloadStart, preloadEnd + 1)
      .map((pokemon) => pokemon.name || pokemon.pokemon?.name)
      .filter(Boolean);

    if (preloadNames.length) {
      setJumpStatus('Loading Pokemon details...');
      await Promise.allSettled(preloadNames.map((name) => getPokemonData(name)));
    }

    setJumpStatus(`Jumping to #${String(targetIndex + 1).padStart(4, '0')}`);
    window.requestAnimationFrame(() => {
      setJumpRequest({ index: targetIndex, nonce: Date.now() });
      window.setTimeout(() => setJumpLoading(false), 650);
    });
  }

  return (
    <div className="portfolio-shell">
        {!loading ? (
          <div className="home">
            <SearchJump onJump={jumpToPokemon} status={jumpStatus} loading={jumpLoading} />
            <TeamBuilder
              team={team}
              onRemove={removePokemonFromTeam}
              onClear={clearTeam}
              onDropPokemon={placePokemonInTeamSlot}
              onMoveMember={moveTeamMember}
            />
            <FilterDock
              typeOptions={typeOptions}
              genOptions={genOptions}
              activeType={selectedOption.type}
              activeGen={selectedOption.gen}
              onTypeChange={onTypeFilter}
              onGenChange={onGenerationFilter}
            />
            <KeyboardHint activeControl={activeControl} onControl={triggerControl} />
            <PokeList
              pokemons={pokemons}
              onNearEnd={loadMorePokemons}
              loadingMore={loadingMore}
              jumpRequest={jumpRequest}
              isFiltering={deckFiltering}
              removingNames={removingNames}
              isAdding={deckAdding}
              addingNames={addingNames}
              controlRequest={controlRequest}
              team={team}
              onAddToTeam={addPokemonToTeam}
            />
          </div>
        ) : isFirstLoad.current ? (
          <div className="home-loading">
            <img src={runningPikachu} alt='tenor-rafaelfracasso-15385062' />
          </div>
        ) : (
          <div className="home-loading-simple">
            <BouncingPokeball />
          </div>
        )}

    </div>
  );
}

export default PokeHome;
