
// Utils
import { capitalize, extractRomanNumerals, formatRomanNumerals  } from "../utils/StringUtils.js";
import { romanToInteger } from "../utils/IntUtils.js";

/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/"

/**
 * Retrieves Pokemon species data by ID.
 *
 * @param {number} id - The ID of the Pokemon species.
 * @returns {Promise<Object>} A Promise that resolves to the data of the Pokemon species.
 */
export const getPokemonById = async (id) => {
    // Construct the API endpoint for the Pokemon species data
    let parameters = `pokemon-species/${id}`;
    
    try {    
        // Fetch the Pokemon species data by ID
        const response = await axios.get(baseUrl + parameters);

        // Assemble and return the data for the Pokemon species
        const data = {
            count: 1,
            results: [{
                name: response?.data.name,
                url: `https://pokeapi.co/api/v2/pokemon-species/${response?.data.id}`
            }]
        }
        
        return data;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
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
    let parameters = "";
    let data = {};

    try {
        if(typeFilter !== 'pokemon-species') {
            parameters = `type/${typeFilter}`;
            
            const response = await axios.get(baseUrl + parameters);
    
            // Paginate the results based on the offset and limit
            const results = response.data.pokemon.slice(offset, offset + limit);
    
            data = {
                count: response?.data.pokemon.length,
                results: results
            };
            
        } else if (regionFilter !== 'pokemon-species') {
            parameters = `generation/${regionFilter}`;
            
            const response = await axios.get(baseUrl + parameters);
    
            // Paginate the results based on the offset and limit
            const results = response.data.pokemon_species.slice(offset, offset + limit);
    
            data = {
                count: response?.data.pokemon_species.length,
                results: results
            };
        } else {
            parameters = `pokemon-species?offset=${offset}&limit=${limit}`;

            const response = await axios.get(baseUrl + parameters);
            
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
        const response = await axios.get(baseUrl + parameters);

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
export const getPokemonData = async (name) => {
    try {
        // Fetch data for the Pokemon species and Pokemon itself
        const pokemonResponse = await axios.get(baseUrl + `pokemon/${name}`);
        const speciesResponse = await axios.get(baseUrl + `pokemon-species/${name}`);
        
        const [pokemonData, speciesData] = await Promise.all([pokemonResponse, speciesResponse]);

        // Fetch Pokemon description asynchronously using the ID from species data
        const pokemonDesc = await getPokemonDescription(speciesData.data.id);
        
        // Assemble and return the detailed Pokemon data
        const data = {
            id: speciesData.data.id, 
            name: {
                en: speciesData.data?.name,
                jp: speciesData.data?.names[0]?.name
            },
            pokedex_entry: pokemonDesc,
            color: speciesData.data.color.name,
            generation: speciesData.data.generation.name,
            region: await getPokemonRegion(speciesData.data.generation.name),
            evolution: await getPokemonEvolutionChain(speciesData.data.evolution_chain.url),

            height: pokemonData.data.height,
            weight: pokemonData.data.weight,
            stats: pokemonData.data.stats,
            types: pokemonData.data.types,
            abilities: pokemonData.data.abilities,
            hasGenderDiff: speciesData.data.has_gender_differences,
            hasShinyVer: pokemonData?.data?.sprites?.other['official-artwork']?.front_shiny ? true : false,
            artwork: {
                default: {
                    front: pokemonData?.data?.sprites?.other['official-artwork']?.front_default
                },
                shiny: {
                    front: pokemonData?.data?.sprites?.other['official-artwork']?.front_shiny
                }
            },
            sprites: {
                default: {
                    front: pokemonData.data.sprites.front_default,
                    back: pokemonData.data.sprites.back_default
                },
                default_shiny: {
                    front: pokemonData.data.sprites?.front_shiny,
                    back: pokemonData.data.sprites?.back_shiny
                },
                female: {
                    front: pokemonData.data.sprites?.front_female,
                    back: pokemonData.data.sprites?.back_female
                },
                female_shiny: {
                    front: pokemonData.data.sprites?.front_shiny_female,
                    back: pokemonData.data.sprites?.back_shiny_female
                }
            },

            held_items: pokemonData.data.held_items,
        }

        return data;
    } catch (error) {
        // Handle errors by logging to the console
        console.error(error);
    }
}

/**
 * Retrieves the main region name for a specific Pokemon generation.
 *
 * @param {string} generation - The name of the Pokemon generation.
 * @returns {Promise<string>} A Promise that resolves to the main region name.
 */
export const getPokemonRegion = async (generation) => {
    let parameters = `generation/${romanToInteger(extractRomanNumerals(generation))}`;
    
    try {
        // Fetch data for the specified Pokemon generation
        const response = await axios.get(baseUrl + parameters);
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
export const getPokemonTypes = async () => {
    // Construct the API endpoint for the Pokemon types data
    let parameters = `type`;
    
    try {
        // Fetch the Pokemon types data
        const response = await axios.get(baseUrl + parameters);

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
        const response = await axios.get(baseUrl + parameters);

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
export const getPokemonDescription = async (id) => {
    // Construct the API endpoint for the Pokemon species data
    let parameters = `pokemon-species/${id}`;
    try {    
        // Fetch the Pokemon species data
        const response = await axios.get(baseUrl + parameters);
        
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
export const getPokemonEvolutionChain = async (chainUrl) => {
    try {
        // Fetch the evolution chain data from the provided URL
        const response = await axios.get(chainUrl);        

        const speciesNames = [];
        
        // Recursive function to traverse the evolution chain
        const traverseChain = async (details) => {
            if (details.species) {

                // Fetch data for the species and Pokemon
                const pokemonResponse = await axios.get(baseUrl + `pokemon/${details.species.name}`);
                const speciesResponse = await axios.get(baseUrl + `pokemon-species/${details.species.name}`);
    
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