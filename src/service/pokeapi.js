
// Utils
import { capitalize, extractRomanNumerals, formatRomanNumerals  } from "../utils/StringUtils.js";
import { romanToInteger } from "../utils/IntUtils.js";

/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/"

export const getPokemonById = async (id) => {
    let parameters = `pokemon-species/${id}`;
    
    try {    
        const response = await axios.get(baseUrl + parameters);
        const data = {
            count: 1,
            results: [{
                name: response?.data.name,
                url: `https://pokeapi.co/api/v2/pokemon-species/${response?.data.id}`
            }]
        }
        
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonsPaginated = async (typeFilter, regionFilter, offset, limit) => {
    let parameters = "";
    let data = {};

    try {
        if(typeFilter !== 'pokemon-species') {
            parameters = `type/${typeFilter}`;
            
            const response = await axios.get(baseUrl + parameters);
    
            let results = [];
            results = response.data.pokemon.slice(offset, offset + limit);
    
            data = {
                count: response?.data.pokemon.length,
                results: results
            };
            
        } else if (regionFilter !== 'pokemon-species') {
            parameters = `generation/${regionFilter}`;
            
            const response = await axios.get(baseUrl + parameters);
    
            let results = [];
            results = response.data.pokemon_species.slice(offset, offset + limit);
    
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
        console.error(error);
    }
}

export const getPokemonsSearchData = async () => {
    let parameters = 'pokemon-species?limit=100000&offset=0';

    try {
        const response = await axios.get(baseUrl + parameters);

        const data = {
            count: response?.data.count,
            results: response?.data.results
        }

        return data;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonData = async (name) => {
    try {
        const pokemonResponse = await axios.get(baseUrl + `pokemon/${name}`);
        const speciesResponse = await axios.get(baseUrl + `pokemon-species/${name}`);
        
        const [pokemonData, speciesData] = await Promise.all([pokemonResponse, speciesResponse]);

        const pokemonDesc = await getPokemonDescription(speciesData.data.id);
        
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
        console.error(error);
    }
}

export const getPokemonRegion = async (generation) => {
    let parameters = `generation/${romanToInteger(extractRomanNumerals(generation))}`;
    
    try {
        const response = await axios.get(baseUrl + parameters);
        return response.data.main_region.name;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonTypes = async () => {
    let parameters = `type`;
    
    try {
        const response = await axios.get(baseUrl + parameters);

        const filteredData = response.data.results.filter((type) => type.name !== 'unknown');
        const transformedData = filteredData.map(({ name }) => ({
            name: capitalize(name),
            value: name,
          }));

        return transformedData;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonGenerations = async () => {
    let parameters = `generation`;

    try {
        const response = await axios.get(baseUrl + parameters);

        const transformedData = response.data.results.map(({ name }) => ({
            name: capitalize(formatRomanNumerals(name)),
            value: romanToInteger(extractRomanNumerals(name)),
          }));

        return transformedData;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonDescription = async (id) => {
    let parameters = `pokemon-species/${id}`;
    try {    
        const response = await axios.get(baseUrl + parameters);
        
        let desc = ""
        response.data.flavor_text_entries.forEach(item => {
            if(item.language.name === 'en') {
                desc = item.flavor_text;
            }
        });

        return desc || 'N/A';
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonEvolutionChain = async (chainUrl) => {
    try {
        const response = await axios.get(chainUrl);        

        const speciesNames = [];
        const traverseChain = async (details) => {
            if (details.species) {

                const pokemonResponse = await axios.get(baseUrl + `pokemon/${details.species.name}`);
                const speciesResponse = await axios.get(baseUrl + `pokemon-species/${details.species.name}`);
    
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
                traverseChain(details.evolves_to[0]);
            }

            return speciesNames;
        }

        return traverseChain(response.data.chain);
      } catch (error) {
        console.error('Error:', error.message);
      }
}