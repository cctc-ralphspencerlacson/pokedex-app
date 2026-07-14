
// Utils
import { capitalize, extractRomanNumerals, formatRomanNumerals  } from "../utils/StringUtils.js";
import { romanToInteger } from "../utils/IntUtils.js";

/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/"

const _requestCache = new Map();
const _requestPromiseCache = new Map();

const cachedGet = async (url) => {
    if (_requestCache.has(url)) return _requestCache.get(url);
    if (_requestPromiseCache.has(url)) return _requestPromiseCache.get(url);

    const promise = axios.get(url)
        .then((response) => {
            _requestCache.set(url, response);
            return response;
        })
        .finally(() => {
            _requestPromiseCache.delete(url);
        });

    _requestPromiseCache.set(url, promise);
    return promise;
}

/**
 * Retrieves paginated data of Pokemon based on filter criteria.
 *
 * @param {string} typeFilter - The type filter.
 * @param {string} regionFilter - The region filter.
 * @param {number} offset - The offset value for pagination.
 * @param {number} limit - The limit value for pagination.
 * @returns {Promise<Object>} A Promise that resolves to the paginated data of Pokemon.
 */
export const getPokemonsPaginated = async (typeFilter, regionFilter, offset, limit) => {
    let data = {};

    try {
        const isTypeActive = typeFilter !== 'pokemon-species';
        const isRegionActive = regionFilter !== 'pokemon-species';

        // Combined filter: intersect type and generation lists
        if (isTypeActive && isRegionActive) {
            const [typeResponse, genResponse] = await Promise.all([
                cachedGet(baseUrl + `type/${typeFilter}`),
                cachedGet(baseUrl + `generation/${regionFilter}`)
            ]);

            const genNames = new Set(
                genResponse.data.pokemon_species.map((s) => s.name)
            );

            const allIntersected = typeResponse.data.pokemon.filter((entry) =>
                genNames.has(entry.pokemon.name)
            );

            const results = allIntersected.slice(offset, offset + limit);

            data = {
                count: allIntersected.length,
                results: results.map((entry) => entry.pokemon)
            };

        } else if (isTypeActive) {
            const response = await cachedGet(baseUrl + `type/${typeFilter}`);
    
            const results = response.data.pokemon.slice(offset, offset + limit);
    
            data = {
                count: response?.data.pokemon.length,
                results: results.map((entry) => entry.pokemon)
            };
            
        } else if (isRegionActive) {
            const response = await cachedGet(baseUrl + `generation/${regionFilter}`);
    
            const results = response.data.pokemon_species.slice(offset, offset + limit);
    
            data = {
                count: response?.data.pokemon_species.length,
                results: results
            };
        } else {
            const response = await cachedGet(baseUrl + `pokemon-species?offset=${offset}&limit=${limit}`);
            
            data = {
                count: response?.data.count,
                results: response?.data.results
            }
        }
    
        return data;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves data of all Pokemon species for search.
 *
 * @returns {Promise<Object>} A Promise that resolves to the data of Pokemon species for search.
 */
export const getPokemonsSearchData = async () => {
    // Construct the API endpoint for the Pokemon species data
    let parameters = 'pokemon-species?limit=100000&offset=0';

    try {
        // Fetch the Pokemon species data for search
        const response = await cachedGet(baseUrl + parameters);

        // Assemble and return the search data
        const data = {
            count: response?.data.count,
            results: response?.data.results
        }

        return data;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves detailed data of a Pokemon by name.
 *
 * @param {string} name - The name of the Pokemon.
 * @returns {Promise<Object>} A Promise that resolves to the detailed data of the Pokemon.
 */
let _pokemonDataCache = null;
let _pokemonDataPromiseCache = null;
export const getPokemonData = async (name) => {
    if (!_pokemonDataCache) _pokemonDataCache = new Map();
    if (!_pokemonDataPromiseCache) _pokemonDataPromiseCache = new Map();

    const cacheKey = String(name).toLowerCase();
    if (_pokemonDataCache.has(cacheKey)) return _pokemonDataCache.get(cacheKey);
    if (_pokemonDataPromiseCache.has(cacheKey)) return _pokemonDataPromiseCache.get(cacheKey);

    const promise = (async () => {
    try {
        // Fetch data for the Pokemon species and Pokemon itself in parallel
        const [pokemonResponse, speciesResponse] = await Promise.all([
            cachedGet(baseUrl + `pokemon/${cacheKey}`),
            cachedGet(baseUrl + `pokemon-species/${cacheKey}`)
        ]);
        const pokemonData = pokemonResponse.data;
        const speciesData = speciesResponse.data;

        // Fetch Pokemon description asynchronously using the ID from species data
        const pokemonDesc = await getPokemonDescription(speciesData.id);
        
        // Assemble and return the detailed Pokemon data
        const data = {
            id: speciesData.id, 
            name: {
                en: speciesData?.name,
                jp: speciesData?.names[0]?.name
            },
            pokedex_entry: pokemonDesc,
            color: speciesData.color.name,
            species: speciesData.genera.find(({ language }) => language.name === 'en')?.genus || 'Unknown Pokemon',
            generation: speciesData.generation.name,
            region: await getPokemonRegion(speciesData.generation.name),
            evolution: await getPokemonEvolutionChain(speciesData.evolution_chain.url),

            height: pokemonData.height,
            weight: pokemonData.weight,
            stats: pokemonData.stats,
            types: pokemonData.types,
            abilities: pokemonData.abilities,
            moves: pokemonData.moves
                .filter(({ version_group_details }) =>
                    version_group_details.some((detail) => detail.move_learn_method.name === 'level-up')
                ),
            hasGenderDiff: speciesData.has_gender_differences,
            hasShinyVer: pokemonData?.sprites?.other['official-artwork']?.front_shiny ? true : false,
            artwork: {
                default: {
                    front: pokemonData?.sprites?.other['official-artwork']?.front_default
                },
                shiny: {
                    front: pokemonData?.sprites?.other['official-artwork']?.front_shiny
                }
            },
            sprites: {
                default: {
                    front: pokemonData.sprites.front_default,
                    back: pokemonData.sprites.back_default
                },
                default_shiny: {
                    front: pokemonData.sprites?.front_shiny,
                    back: pokemonData.sprites?.back_shiny
                },
                female: {
                    front: pokemonData.sprites?.front_female,
                    back: pokemonData.sprites?.back_female
                },
                female_shiny: {
                    front: pokemonData.sprites?.front_shiny_female,
                    back: pokemonData.sprites?.back_shiny_female
                }
            },

            held_items: pokemonData.held_items,
        }

        _pokemonDataCache.set(cacheKey, data);
        return data;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    } finally {
        _pokemonDataPromiseCache.delete(cacheKey);
    }
    })();

    _pokemonDataPromiseCache.set(cacheKey, promise);
    return promise;
}

/**
 * Retrieves the main region name for a specific Pokemon generation.
 *
 * @param {string} generation - The name of the Pokemon generation.
 * @returns {Promise<string>} A Promise that resolves to the main region name.
 */
const getPokemonRegion = async (generation) => {
    let parameters = `generation/${romanToInteger(extractRomanNumerals(generation))}`;
    
    try {
        // Fetch data for the specified Pokemon generation
        const response = await cachedGet(baseUrl + parameters);
        // Return the main region name from the fetched data
        return response.data.main_region.name;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves Pokemon types data and transforms it for display.
 *
 * @returns {Promise<Object[]>} A Promise that resolves to an array of transformed Pokemon types data.
 */
/**
 * Fetches 3D model data for all Pokemon from the 3D API.
 * Uses a module-level cache to avoid duplicate requests.
 *
 * @returns {Promise<Array>} A Promise that resolves to an array of Pokemon 3D data.
 */
export const getPokemon3dData = async () => {
  return cachedGet('https://pokemon-3d-api.onrender.com/v1/pokemon')
    .then(res => res.data)
    .catch(err => {
      console.error('getPokemon3dData: err: ' + err);
      return [];
    });
};

export const getPokemonTypes = async () => {
    // Construct the API endpoint for the Pokemon types data
    let parameters = `type`;
    
    try {
        // Fetch the Pokemon types data
        const response = await cachedGet(baseUrl + parameters);

        // Filter out the 'unknown' type and transform the data for display
        const filteredData = response.data.results.filter((type) => type.name !== 'unknown');
        const transformedData = filteredData.map(({ name }) => ({
            name: capitalize(name),
            value: name,
          }));

        return transformedData;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves Pokemon generations data and transforms it for display.
 *
 * @returns {Promise<Object[]>} A Promise that resolves to an array of transformed Pokemon generations data.
 */
export const getPokemonGenerations = async () => {
    // Construct the API endpoint for the Pokemon generations data
    let parameters = `generation`;

    try {
        // Fetch the Pokemon generations data
        const response = await cachedGet(baseUrl + parameters);

        // Transform the data for display
        const transformedData = response.data.results.map(({ name }) => ({
            name: capitalize(formatRomanNumerals(name)),
            value: romanToInteger(extractRomanNumerals(name)),
          }));

        return transformedData;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves the description of a Pokemon based on the provided ID.
 *
 * @param {number} id - The ID of the Pokemon species.
 * @returns {Promise<string>} A Promise that resolves to the Pokemon description or 'N/A'.
 */
const getPokemonDescription = async (id) => {
    // Construct the API endpoint for the Pokemon species data
    let parameters = `pokemon-species/${id}`;
    try {    
        // Fetch the Pokemon species data
        const response = await cachedGet(baseUrl + parameters);
        
        // Initialize the description variable
        let desc = ""
        // Find the English flavor text entry for the description
        response.data.flavor_text_entries.forEach(item => {
            if(item.language.name === 'en') {
                desc = item.flavor_text;
            }
        });

        // Return the description or 'N/A' if not found
        return desc || 'N/A';
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves the evolution chain of a Pokemon based on the provided chain URL.
 *
 * @param {string} chainUrl - The URL of the evolution chain.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of Pokemon evolution data.
 */
const getPokemonEvolutionChain = async (chainUrl) => {
    try {
        // Fetch the evolution chain data from the provided URL
        const response = await cachedGet(chainUrl);        

        const speciesNames = [];
        
        // Recursive function to traverse the evolution chain
        const traverseChain = async (details) => {
            if (details.species) {

                // Fetch data for the species and Pokemon
                const pokemonResponse = await cachedGet(baseUrl + `pokemon/${details.species.name}`);
                const speciesResponse = await cachedGet(baseUrl + `pokemon-species/${details.species.name}`);
    
                // Collect species information and related data
                speciesNames.push({
                    name:{
                        en: speciesResponse.data?.name,
                        jp: speciesResponse.data?.names[0]?.name
                    },
                    types: pokemonResponse.data.types,
                    hasShinyVer: pokemonResponse?.data?.sprites?.other['official-artwork']?.front_shiny ? true : false,
                    artwork: {
                        default: {
                            front: pokemonResponse?.data?.sprites?.other['official-artwork']?.front_default
                        },
                        shiny: {
                            front: pokemonResponse?.data?.sprites?.other['official-artwork']?.front_shiny
                        }
                    },
                    sprites: {
                        default: {
                            front: pokemonResponse.data.sprites.front_default,
                            back: pokemonResponse.data.sprites.back_default
                        },
                        default_shiny: {
                            front: pokemonResponse.data.sprites?.front_shiny,
                            back: pokemonResponse.data.sprites?.back_shiny
                        },
                        female: {
                            front: pokemonResponse.data.sprites?.front_female,
                            back: pokemonResponse.data.sprites?.back_female
                        },
                        female_shiny: {
                            front: pokemonResponse.data.sprites?.front_shiny_female,
                            back: pokemonResponse.data.sprites?.back_shiny_female
                        }
                    },
                });
            }

            if(details.evolves_to.length > 0) {
                // Recursively traverse the evolution chain
                traverseChain(details.evolves_to[0]);
            }

            return speciesNames;
        }

        // Start traversing the evolution chain from the root
        return traverseChain(response.data.chain);
      } catch (error) {
        console.error('Error:', error.message);
      }
}
