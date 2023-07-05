
// Utils
import { extractRomanNumerals  } from "../utils/StringUtils.js";
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

export const getPokemonsPaginated = async (query, offset, limit) => {
    let parameters = "";
    
    try {
        if(query === 'pokemon-species') {
            parameters = `${query}?offset=${offset}&limit=${limit}`;
            const response = await axios.get(baseUrl + parameters);
            
            const data = {
                count: response?.data.count,
                results: response?.data.results
            }

            return data;
        } else {
            parameters = `type/${query}`;
            
            const response = await axios.get(baseUrl + parameters);
      
            let results = [];
            results = response.data.pokemon.slice(offset, offset + limit);
      
            const data = {
              count: response?.data.pokemon.length,
              results: results
            };
      
            return data;
        }
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonSearched = (query) => {
    console.log(query)
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
    let generationParam = `generation/${romanToInteger(extractRomanNumerals(generation).toUpperCase())}`;
    
    try {
        const response = await axios.get(baseUrl + generationParam);
        return response.data.main_region.name;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonTypes = async () => {
    let typeParam = `type`;
    
    try {
        const response = await axios.get(baseUrl + typeParam);

        return response.data.results.filter((type) => type.name !== 'unknown');
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonDescription = () => {

}