import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getPokemonData } from '../../service/pokeapi';
import { calculatePercentage } from '../../utils/IntUtils';
import { getMaxStat, getStatLabel } from '../../utils/OtherUtils';
import { capitalize, extractRomanNumerals, removeHyphen } from '../../utils/StringUtils';
import Default from '../../assets/default.png';
import './ScrollPokedex.css';

function formatId(id) {
  return id ? `#${String(id).padStart(4, '0')}` : '#----';
}

function getArtworkOptions(pokemon) {
  if (!pokemon) return [];

  return [
    { label: 'Original', src: pokemon?.artwork?.default?.front },
    { label: 'Shiny', src: pokemon?.artwork?.shiny?.front },
  ].filter(({ src }) => Boolean(src));
}

function normalizeName(entry) {
  return entry?.name || entry?.pokemon?.name;
}

function PokemonShowcase({ name, index, stackState, setCardRef, onPokemonSelect, imageCycleNonce, imageCycleDirection, team = [], onAddToTeam }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artworkIndex, setArtworkIndex] = useState(0);
  const [artworkChanging, setArtworkChanging] = useState(false);
  const handledImageCycleNonce = useRef(imageCycleNonce);
  const artworkOptions = useMemo(() => getArtworkOptions(pokemon), [pokemon]);
  const activeArtwork = artworkOptions[artworkIndex] || { label: 'Original', src: Default };
  const isInTeam = team.some((member) => member?.name === pokemon?.name?.en);
  const isTeamFull = team.every(Boolean);

  const handlePokemonDragStart = (event) => {
    if (!pokemon) return;

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify(pokemon));

    const sprite = pokemon.sprites?.default?.front || pokemon.artwork?.default?.front;
    if (!sprite) return;

    const dragImage = document.createElement('img');
    dragImage.src = sprite;
    dragImage.alt = '';
    dragImage.className = 'pokemon-drag-image';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 32, 32);

    window.setTimeout(() => dragImage.remove(), 0);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getPokemonData(name).then((data) => {
      if (!mounted) return;
      setPokemon(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [name]);

  useEffect(() => {
    setArtworkIndex(0);
    handledImageCycleNonce.current = imageCycleNonce;
  }, [name]);

  useEffect(() => {
    if (stackState !== 'is-active-card') {
      handledImageCycleNonce.current = imageCycleNonce;
      return;
    }

    if (handledImageCycleNonce.current === imageCycleNonce) return;
    handledImageCycleNonce.current = imageCycleNonce;

    if (stackState !== 'is-active-card' || !imageCycleNonce || artworkOptions.length <= 1) return;

    setArtworkChanging(true);
    setArtworkIndex((current) => {
      const nextIndex = current + imageCycleDirection;
      return (nextIndex + artworkOptions.length) % artworkOptions.length;
    });
    const timeout = window.setTimeout(() => setArtworkChanging(false), 320);
    return () => window.clearTimeout(timeout);
  }, [artworkOptions.length, imageCycleDirection, imageCycleNonce, stackState]);

  return (
    <section
      className={`pokemon-showcase ${stackState} bg-${pokemon?.color || 'default'}`}
      data-card-index={index}
      data-card-name={name}
      ref={(node) => setCardRef(index, node)}
      style={{ '--card-index': index }}
    >
      {!loading && (
        <>
          <div className="showcase-watermark">{formatId(pokemon?.id)}</div>

          <div className="showcase-copy">
            <p className="showcase-kicker">Chapter {String(index + 1).padStart(2, '0')} / {capitalize(pokemon?.region || 'Unknown')} Region</p>
            <h2>{capitalize(removeHyphen(pokemon?.name?.en || name))}</h2>
            <strong>{pokemon?.name?.jp}</strong>

            <div className="showcase-types">
              {pokemon?.types?.map(({ type }) => (
                <span key={type.name}>{capitalize(type.name)}</span>
              ))}
            </div>

            <p className="showcase-description">{pokemon?.pokedex_entry}</p>

            <div className="showcase-facts">
              <span>Height <b>{pokemon?.height || 'N/A'}</b></span>
              <span>Weight <b>{pokemon?.weight || 'N/A'}</b></span>
              <span><b>{pokemon?.species?.replace(/ pokemon$/i, '') || 'Unknown'}</b></span>
              <span>Generation <b>{pokemon?.generation ? extractRomanNumerals(pokemon.generation) : 'Unknown'}</b></span>
            </div>

            <button
              type="button"
              className="team-add-button"
              disabled={isInTeam || isTeamFull}
              onClick={() => onAddToTeam?.(pokemon)}
            >
              {isInTeam ? 'In Team' : isTeamFull ? 'Team Full' : 'Add to Team'}
            </button>
          </div>

          <div
            className={`showcase-art ${artworkChanging ? 'is-changing-artwork' : ''}`}
            draggable={Boolean(pokemon)}
            onDragStart={handlePokemonDragStart}
            title="Drag to a team slot"
          >
            <img src={activeArtwork.src || Default} alt={`${pokemon?.name?.en} ${activeArtwork.label}`} />
            {artworkOptions.length > 1 && <span>{activeArtwork.label}</span>}
          </div>

          <div className={`showcase-research ${pokemon?.evolution?.length > 1 ? 'has-evolution' : ''}`}>
            <div className="research-panel stats-panel">
              <h3>Base Stats</h3>
              {pokemon?.stats?.map(({ stat, base_stat }) => {
                const percentage = calculatePercentage(base_stat, getMaxStat(stat.name));
                return (
                  <div className="showcase-stat" key={stat.name}>
                    <span>{getStatLabel(stat.name)}</span>
                    <div><i style={{ width: `${percentage}%` }} /></div>
                    <b>{base_stat}</b>
                  </div>
                );
              })}
            </div>

            <div className="research-panel">
              <h3>Abilities</h3>
              <div className="ability-pills">
                {pokemon?.abilities?.map(({ ability, slot }) => (
                  <span key={ability.name}>Slot {slot}: {capitalize(removeHyphen(ability.name))}</span>
                ))}
              </div>
            </div>

            <div className="research-panel moves-panel">
              <h3>Moves</h3>
              <div className="move-pills">
                {pokemon?.moves?.map(({ move }) => (
                  <span key={move.name}>{capitalize(removeHyphen(move.name))}</span>
                ))}
              </div>
            </div>

            {pokemon?.evolution?.length > 1 && (
              <div className="research-panel evolution-panel">
                <div className="evolution-heading">
                  <h3>Evolution Path</h3>
                  <span>{pokemon.evolution.length} stages</span>
                </div>
                <div className="evolution-path">
                  {pokemon.evolution.map((item, evolutionIndex) => {
                    const isCurrent = item.name.en === pokemon.name.en;
                    return (
                      <div className="evolution-step" key={item.name.en}>
                        {evolutionIndex > 0 && <span className="evolution-link" aria-hidden="true" />}
                        <button
                          className={isCurrent ? 'is-current-evolution' : ''}
                          type="button"
                          disabled={isCurrent}
                          onClick={() => onPokemonSelect(item.name.en)}
                          title={isCurrent ? 'Current Pokemon' : `Go to ${capitalize(removeHyphen(item.name.en))}`}
                        >
                          <img src={item.artwork.default.front} alt={`Evolution ${item.name.en}`} />
                          <span>{capitalize(removeHyphen(item.name.en))}</span>
                          {isCurrent && <small>Current</small>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default function ScrollPokedex({ pokemons, onNearEnd, loadingMore, jumpRequest, isFiltering, removingNames = [], isAdding, addingNames = [], controlRequest, team, onAddToTeam }) {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const previousActiveRef = useRef(0);
  const pullDirectionRef = useRef(1);
  const handledControlRequestRef = useRef(null);
  const entries = useMemo(() => pokemons?.results || [], [pokemons?.results]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageCycle, setImageCycle] = useState({ nonce: 0, direction: 1 });

  const setCardRef = useCallback((index, node) => {
    cardRefs.current[index] = node;
  }, []);

  const scrollToIndex = useCallback((index) => {
    const scroller = rootRef.current?.closest('.home');
    const trigger = rootRef.current?.querySelector(`[data-trigger-index="${index}"]`);
    if (!scroller || !trigger) return;

    gsap.to(scroller, {
      scrollTop: trigger.offsetTop - scroller.clientHeight * 0.18,
      duration: 1.05,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  }, []);

  const getLoopedIndex = useCallback((direction) => {
    if (!entries.length) return activeIndex;
    return (activeIndex + direction + entries.length) % entries.length;
  }, [activeIndex, entries.length]);

  const scrollToPokemon = useCallback((pokemonName) => {
    const targetIndex = entries.findIndex((entry) => normalizeName(entry) === pokemonName);
    if (targetIndex >= 0) scrollToIndex(targetIndex);
  }, [entries, scrollToIndex]);

  useEffect(() => {
    if (!entries.length) return;

    const preloadStart = Math.max(0, activeIndex - 2);
    const preloadEnd = Math.min(entries.length - 1, activeIndex + 4);
    const preloadNames = entries
      .slice(preloadStart, preloadEnd + 1)
      .map(({ name, pokemon }) => name || pokemon?.name)
      .filter(Boolean);

    preloadNames.forEach((name) => getPokemonData(name));
  }, [activeIndex, entries]);

  useEffect(() => {
    setActiveIndex(0);
    previousActiveRef.current = 0;
    requestAnimationFrame(() => scrollToIndex(0));
  }, [entries, scrollToIndex]);

  useEffect(() => {
    const scroller = rootRef.current?.closest('.home');
    if (!scroller) return;
    let frameId = null;

    const updateActiveCard = () => {
      frameId = null;
      const triggers = Array.from(rootRef.current?.querySelectorAll('.stack-trigger') || []);
      const viewportCenter = scroller.scrollTop + scroller.clientHeight * 0.5;
      let nextActive = 0;
      let closestDistance = Infinity;

      triggers.forEach((trigger, index) => {
        const center = trigger.offsetTop + trigger.offsetHeight * 0.5;
        const distance = Math.abs(center - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          nextActive = index;
        }
      });

      setActiveIndex(nextActive);
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    scroller.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      scroller.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [entries.length]);

  useEffect(() => {
    const scroller = rootRef.current?.closest('.home');
    if (!scroller) return;

    let wheelLock = false;
    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 20 || wheelLock) return;
      event.preventDefault();

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = getLoopedIndex(direction);
      if (nextIndex !== activeIndex) scrollToIndex(nextIndex);

      wheelLock = true;
      window.setTimeout(() => {
        wheelLock = false;
      }, 980);
    };

    scroller.addEventListener('wheel', handleWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', handleWheel);
  }, [activeIndex, getLoopedIndex, scrollToIndex]);

  useEffect(() => {
    if (!jumpRequest) return;
    if (jumpRequest.index < 0 || jumpRequest.index >= entries.length) return;

    requestAnimationFrame(() => scrollToIndex(jumpRequest.index));
  }, [entries.length, jumpRequest, scrollToIndex]);

  useEffect(() => {
    if (entries.length === 0 || loadingMore) return;
    if (activeIndex >= entries.length - 5) {
      onNearEnd?.();
    }
  }, [activeIndex, entries.length, loadingMore, onNearEnd]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = getLoopedIndex(direction);
      if (nextIndex !== activeIndex) scrollToIndex(nextIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, getLoopedIndex, scrollToIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      event.preventDefault();
      setImageCycle({
        nonce: Date.now(),
        direction: event.key === 'ArrowRight' ? 1 : -1,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!controlRequest) return;
    if (handledControlRequestRef.current === controlRequest.nonce) return;
    handledControlRequestRef.current = controlRequest.nonce;

    if (
      controlRequest.control === 'up' ||
      controlRequest.control === 'down' ||
      controlRequest.control === 'wheel-up' ||
      controlRequest.control === 'wheel-down'
    ) {
      const direction = controlRequest.control === 'down' || controlRequest.control === 'wheel-down' ? 1 : -1;
      const nextIndex = getLoopedIndex(direction);
      if (nextIndex !== activeIndex) scrollToIndex(nextIndex);
      return;
    }

    if (controlRequest.control === 'left' || controlRequest.control === 'right') {
      setImageCycle({
        nonce: controlRequest.nonce,
        direction: controlRequest.control === 'right' ? 1 : -1,
      });
    }
  }, [activeIndex, controlRequest, getLoopedIndex, scrollToIndex]);

  const getStackState = (index) => {
    const distance = index - activeIndex;
    if (distance === 0) return 'is-active-card';
    if (distance === -1) return 'is-prev-card';
    if (distance < -1) return 'is-old-card';
    if (distance === 1) return 'is-next-card';
    return 'is-future-card';
  };

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;
    if (isFiltering) {
      const removingSet = new Set(removingNames);
      cards.forEach((card, index) => {
        const shouldRemove = removingSet.has(card.dataset.cardName);
        const direction = index % 2 === 0 ? -1 : 1;
        if (shouldRemove) {
          gsap.to(card, {
            autoAlpha: 0,
            xPercent: -50,
            yPercent: -50,
            x: direction * 760,
            y: -90,
            rotation: direction * 18,
            scale: 0.92,
            duration: 0.76,
            ease: 'power3.in',
            overwrite: 'auto',
          });
        } else {
          gsap.to(card, {
            autoAlpha: 1,
            scale: 1.02,
            duration: 0.26,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });
      return;
    }

    const previousActive = previousActiveRef.current;
    if (activeIndex !== previousActive) {
      pullDirectionRef.current = Math.random() > 0.5 ? 1 : -1;
    }
    const pullDirection = pullDirectionRef.current;
    const addingSet = new Set(addingNames);

    cards.forEach((card) => {
      const index = Number(card.dataset.cardIndex);
      const distance = index - activeIndex;
      let config;

      if (distance === 0) {
        config = {
          autoAlpha: 1,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: 'saturate(1) blur(0px) brightness(1)',
          zIndex: 60,
        };
      } else if (distance === -1) {
        config = {
          autoAlpha: 0.82,
          xPercent: -50,
          yPercent: -50,
          x: -22,
          y: -74,
          rotation: -4,
          scale: 0.96,
          filter: 'saturate(0.86) blur(0.2px) brightness(0.82)',
          zIndex: 45,
        };
      } else if (distance < -1) {
        config = {
          autoAlpha: 0.48,
          xPercent: -50,
          yPercent: -50,
          x: 28,
          y: -122,
          rotation: 4.5,
          scale: 0.92,
          filter: 'saturate(0.68) blur(0.5px) brightness(0.64)',
          zIndex: 30,
        };
      } else if (distance === 1) {
        config = {
          autoAlpha: 0.84,
          xPercent: -50,
          yPercent: -50,
          x: 24,
          y: 86,
          rotation: 4,
          scale: 0.96,
          filter: 'saturate(0.86) blur(0.2px) brightness(0.86)',
          zIndex: 42,
        };
      } else {
        config = {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 210,
          rotation: -2,
          scale: 0.9,
          filter: 'saturate(0.72) blur(0.8px) brightness(0.72)',
          zIndex: 10,
        };
      }

      if (isAdding && addingSet.has(card.dataset.cardName)) {
        const dealDirection = index % 2 === 0 ? -1 : 1;
        gsap.fromTo(card, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: dealDirection * 760,
          y: 130,
          rotation: dealDirection * 18,
          scale: 0.88,
        }, {
          ...config,
          duration: 1.55,
          ease: 'expo.out',
          overwrite: 'auto',
        });
        return;
      }

      if (index === previousActive && index !== activeIndex) {
        gsap.timeline({ defaults: { overwrite: 'auto' } })
          .to(card, {
            x: pullDirection * 360,
            y: -34,
            rotation: pullDirection * 12,
            scale: 0.98,
            duration: 0.28,
            ease: 'power2.in',
          })
          .to(card, {
            ...config,
            duration: 0.66,
            ease: 'expo.out',
          });
        return;
      }

      gsap.to(card, {
        ...config,
        duration: 0.9,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });
    previousActiveRef.current = activeIndex;
  }, [activeIndex, entries.length, isFiltering, removingNames, isAdding, addingNames]);

  const visibleEntries = entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ index }) => Math.abs(index - activeIndex) <= 2);

  return (
    <main className="scroll-pokedex" ref={rootRef}>
      <div className="card-stack-stage">
        {visibleEntries.map(({ entry, index }) => {
          const name = normalizeName(entry);
          return (
            <PokemonShowcase
              key={name}
              name={name}
              index={index}
              stackState={getStackState(index)}
              setCardRef={setCardRef}
              onPokemonSelect={scrollToPokemon}
              imageCycleNonce={imageCycle.nonce}
              imageCycleDirection={imageCycle.direction}
              team={team}
              onAddToTeam={onAddToTeam}
            />
          );
        })}
      </div>

      <div className="scroll-triggers" aria-hidden="true">
        {entries.map((entry, index) => (
          <section className="stack-trigger" data-trigger-index={index} key={`${normalizeName(entry)}-trigger`} />
        ))}
      </div>

      {loadingMore && (
        <div className="stack-loading-more" aria-live="polite">
          Loading more Pokemon...
        </div>
      )}
    </main>
  );
}
