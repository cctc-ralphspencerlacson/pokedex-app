
// Utils
import { capitalize, removeHyphen, extractRomanNumerals, formatRomanNumerals  } from "../utils/StringUtils.js";
import { romanToInteger } from "../utils/IntUtils.js";

/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/"

export const getPokeApi = async (endpoint) => {

    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonById = async (id) => {
    let parameters = `pokemon-species/${id}`;
    
    try {    
        const response = await axios.get(baseUrl + parameters);
            console.log(response)
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
    let pokemonParam = `pokemon/${name}`;
    let speciesParam = `pokemon-species/${name}`;

    try {
        const pokemonResponse = await axios.get(baseUrl + pokemonParam);
        const speciesResponse = await axios.get(baseUrl + speciesParam);
        
        const [pokemonData, speciesData] = await Promise.all([pokemonResponse, speciesResponse]);

        const data = {
            id: speciesData.data.id, 
            name: {
                en: speciesData.data?.name,
                jp: speciesData.data?.names[0]?.name
            },
            color: speciesData.data.color.name,
            generation: speciesData.data.generation.name,
            region: await getPokemonRegion(speciesData.data.generation.name),

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