import express from "express";
import { CLIENT_URL, PORT } from "./config.js";
import { DatabaseService } from "./modules/database/database.service.js";
import { UserController } from "./modules/user/user.controller.js";
import { PokemonController } from "./modules/pokemon/pokemon.controller.js";
import { GameWithBotNamespaceController } from "./modules/game/game.controller.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";

const bootstrap = async () => {
  await DatabaseService.connect();

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: { origin: [CLIENT_URL] },
  });

  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: [CLIENT_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  app.use(errorHandler);

  new UserController(app, "/user");
  new PokemonController(app, "/pokemon");
  new GameWithBotNamespaceController(io, "/game");

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
