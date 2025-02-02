import mongoose from "mongoose";
import { MONGODB_URI } from "../../config.js";

export class Database {
  client = null;

  connect = async () => {
    try {
      console.log("Initializing connection to Database!");

      const connection = await mongoose.connect(MONGODB_URI || "");
      this.client = connection.connection.getClient();

      console.log("Successfully connected to Database!");

      return this.client;
    } catch (error) {
      console.error("Error during connection to Database:", error);
      process.exit(1);
    }
  };
}

export const DatabaseService = new Database();
