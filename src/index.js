import express from "express";
import { CLIENT_URL, PORT } from "./config.js";
import { DatabaseService } from "./modules/database/database.service.js";
import { configureCors } from "./startup/cors.config.js";
import { UserController } from "./modules/user/user.controller.js";
import { PokemonController } from "./modules/pokemon/pokemon.controller.js";
import { GameWithBotNamespaceController } from "./modules/game/game.controller.js";
import { Server } from "socket.io";
import { createServer } from "http";

const bootstrap = async () => {
  await DatabaseService.connect();

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: { origin: [CLIENT_URL] },
  });

  app.use(express.json());
  configureCors(app);

  new UserController(app, "/user");
  new PokemonController(app, "/pokemon");
  new GameWithBotNamespaceController(io, "/game");

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
