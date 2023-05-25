/**
 * Public API data from PokeAPI
 * ------------------------------------------ */

import axios from "axios";

export const getPokeApi = async (endpoint) => {

    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


export const getPokemons = async (offset, limit) => {
    const baseUrl = "https://pokeapi.co/api/v2/"
    let parameters = `pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await axios.get(baseUrl + parameters);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getPokemonsDEtails = async (idt) => {
    const baseUrl = "https://pokeapi.co/api/v2/"
    let parameters = `pokemon/${id}`;

    try {
        const response = await axios.get(baseUrl + parameters);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}