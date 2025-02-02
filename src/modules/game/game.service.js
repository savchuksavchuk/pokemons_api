import { PokemonService } from "../pokemon/pokemon.service.js";
import { GAME_STATUS } from "./game.constants.js";
import { GameModel } from "./game.model.js";

export class GameService {
  static startGameWithBot = async (playerId, pokemonId) => {
    const playerPokemon = await PokemonService.getPokemonById(pokemonId);
    const botPokemon = await PokemonService.selectPokemonCounter(pokemonId);

    const playerPokemonData = {
      name: playerPokemon.name,
      attack: playerPokemon.base.Attack,
      speed: playerPokemon.base.Speed,
      defense: playerPokemon.base.Defense,
      maxHp: playerPokemon.base.HP,
      currentHp: playerPokemon.base.HP,
      image: playerPokemon.image,
    };

    const botPokemonData = {
      name: botPokemon.name,
      attack: botPokemon.base.Attack,
      speed: botPokemon.base.Speed,
      defense: botPokemon.base.Defense,
      maxHp: botPokemon.base.HP,
      currentHp: botPokemon.base.HP,
      image: botPokemon.image,
    };

    const turn =
      playerPokemonData.speed > botPokemonData.speed ? playerId : null;

    const game = await GameModel.create({
      player1: playerId,
      player1_pokemon: playerPokemonData,
      player2_pokemon: botPokemonData,
      isBot: true,
      currentTurn: turn,
    });

    return game;
  };

  static attack = async (gameId, playerId = null) => {
    const game = await this.getGameById(gameId);

    if (Boolean(game.currentTurn) && game.currentTurn.toString() !== playerId) {
      return;
    }

    const isPlayerAttacking = game.player1.toString() === playerId;

    const attackingPokemon = isPlayerAttacking
      ? game.player1_pokemon
      : game.player2_pokemon;

    const defendingPokemon = isPlayerAttacking
      ? game.player2_pokemon
      : game.player1_pokemon;

    const damage = this.calculateDamage(
      attackingPokemon.attack,
      attackingPokemon.defense
    );

    defendingPokemon.currentHp -= damage;

    if (defendingPokemon.currentHp <= 0) {
      game.status = GAME_STATUS.FINISHED;
      game.winner = isPlayerAttacking ? game.player1 : game.player2;
    }

    game.currentTurn = isPlayerAttacking ? game.player2 : game.player1;

    const logString =
      damage > 0
        ? `${attackingPokemon.name} attacked and dealt ${damage} damage`
        : ` ${attackingPokemon.name} missed the attack`;

    const logObject = {
      message: logString,
      player: playerId,
    };

    game.logs.push(logObject);

    await game.save();

    return GameModel.findById(gameId);
  };

  static botAttack = (gameId) => {
    return this.attack(gameId, null);
  };

  static getGameById = (gameId) => {
    return GameModel.findById(gameId);
  };

  static calculateDamage = (attack, defense) => {
    const randomFactor = (Math.floor(Math.random() * 11) / 10).toFixed(1);

    return Math.floor(
      (((2 * 6 + 2) * 6 * (attack / defense)) / 6 + 2) * randomFactor
    );
  };
}
