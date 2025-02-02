import { Schema, Types, model } from "mongoose";
import { GAME_STATUS } from "./game.constants.js";

const GameSchema = new Schema({
  player1: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  player2: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
  isBot: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: Object.values(GAME_STATUS),
    default: GAME_STATUS.STARTED,
  },
  player1_pokemon: {
    type: {
      name: String,
      attack: Number,
      speed: Number,
      maxHp: Number,
      currentHp: Number,
      image: String,
      defense: Number,
    },
    required: true,
  },
  player2_pokemon: {
    type: {
      name: String,
      attack: Number,
      speed: Number,
      maxHp: Number,
      currentHp: Number,
      image: String,
      defense: Number,
    },
    default: null,
  },
  currentTurn: {
    type: Types.ObjectId,
    ref: "User",
  },
  winner: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
  logs: {
    type: [
      {
        message: String,
        player: {
          type: Types.ObjectId,
          ref: "User",
        },
      },
    ],
    default: [],
  },
});

export const GameModel = model("Game", GameSchema);
