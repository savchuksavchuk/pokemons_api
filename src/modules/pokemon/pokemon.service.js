import { PokemonModel } from "./pokemon.model.js";
import { POKEMON_COUNTERS_TYPE } from "./pokemon.constant.js";

export class PokemonService {
  static async getPokemons(page, count, search) {
    const skip = (page - 1) * count;

    const pokemons = await PokemonModel.find({
      name: { $regex: search, $options: "i" },
    })
      .skip(skip)
      .limit(count)
      .exec();

    const totalCount = await PokemonModel.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    const totalPages = Math.ceil(totalCount / count);

    return {
      pokemons,
      page,
      count,
      totalCount,
      totalPages,
    };
  }

  static getPokemonById(pokemonId) {
    return PokemonModel.findById(pokemonId);
  }

  static async selectPokemonCounter(pokemonId) {
    const pokemon = await this.getPokemonById(pokemonId);

    const pokemonType = pokemon.type[0];

    const counterType = POKEMON_COUNTERS_TYPE[pokemonType];

    const counterPokemon = await PokemonModel.aggregate([
      { $match: { type: counterType } },
      { $sample: { size: 1 } },
    ]);

    return counterPokemon[0];
  }
}
