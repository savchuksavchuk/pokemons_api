import { RateLimiter } from "../utils/socket_rate_limiter.js";
import { GAME_STATUS } from "./game.constants.js";
import { GameService } from "./game.service.js";

export class GameWithBotNamespaceController {
  constructor(io, routePath) {
    this.namespacePath = `${routePath}/game-with-bot`;
    this.gameWithBotNamespace = io.of(this.namespacePath);
    this.rateLimiter = new RateLimiter();
    this.botAttackDelay = 2000;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.gameWithBotNamespace.on("connection", (socket) =>
      this.handleConnection(socket)
    );
  }

  handleConnection(socket) {
    console.log(`✅ User connected: ${socket.id}`);
    socket.on("disconnect", () => this.handleDisconnect(socket));

    socket.on("start-with-bot", (data) =>
      this.handleStartWithBot(socket, data)
    );
    socket.on("attack", (data) =>
      this.rateLimiter.limit(socket, "attack", 1, this.botAttackDelay, () =>
        this.handleAttack(socket, data)
      )
    );
  }

  async handleStartWithBot(socket, { playerId, pokemonId }) {
    try {
      const game = await GameService.startGameWithBot(playerId, pokemonId);

      const botTurn = game.currentTurn === null;

      if (botTurn) {
        setTimeout(async () => {
          const gameAfterBotAttack = await GameService.botAttack(game._id);

          socket.emit("game-updated", {
            message: gameAfterBotAttack,
          });
        }, this.botAttackDelay);
      }

      socket.emit("game-started", { message: game });
    } catch (error) {
      socket.emit("error", { message: "Failed to start game" });
    }
  }

  async handleAttack(socket, { gameId, playerId }) {
    console.log(`🔥 Attack from player ${playerId}`);

    try {
      const currentGame = await GameService.getGameById(gameId);

      if (
        Boolean(currentGame.currentTurn) &&
        currentGame.currentTurn.toString() !== playerId
      ) {
        throw new Error("It's not your turn");
      }

      const game = await GameService.attack(gameId, playerId);

      if (game.status === GAME_STATUS.FINISHED) {
        socket.emit("game-finished", {
          message: game,
        });

        return;
      }

      if (game.currentTurn === null) {
        setTimeout(async () => {
          console.log(`🔥 Attack from bot`);

          const gameAfterBotAttack = await GameService.botAttack(gameId);

          socket.emit("game-updated", {
            message: gameAfterBotAttack,
          });
        }, this.botAttackDelay);
      }

      socket.emit("game-updated", {
        message: game,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to attack" });
    }
  }

  handleDisconnect(socket) {
    console.log(`❌ User disconnected: ${socket.id}`);
  }
}
