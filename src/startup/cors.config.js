import cors from "cors";
import { CLIENT_URL } from "../config.js";

export function configureCors(app) {
  app.use(
    cors({
      credentials: true,
      origin: [CLIENT_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
}
