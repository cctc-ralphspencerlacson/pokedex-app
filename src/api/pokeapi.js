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

export const getPokemons = async (offset, limit) => {
    let parameters = `pokemon-species?offset=${offset}&limit=${limit}`;

    try {
        const response = await axios.get(baseUrl + parameters);
        return response.data;
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
            pokemon: await pokemonData.data,
            species: await speciesData.data
        }

        return data;
    } catch (error) {
        console.error(error);
    }
}