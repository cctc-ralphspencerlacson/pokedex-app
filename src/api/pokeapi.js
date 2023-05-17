/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

const baseUrl = "https://pokeapi.co/api/v2/"


export const getPokemon = async (offset, limit) => {
    
    let parameters = `pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await axios.get(baseUrl + parameters);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}