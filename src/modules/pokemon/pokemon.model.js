import { Schema, model } from "mongoose";

const PokemonSchema = new Schema({
  pokedex_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: [String],
    required: true,
  },
  base: {
    type: {
      HP: Number,
      Attack: Number,
      Defense: Number,
      SpAttack: Number,
      SpDefense: Number,
      Speed: Number,
    },
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export const PokemonModel = model("Pokemon", PokemonSchema);
