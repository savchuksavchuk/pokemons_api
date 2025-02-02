import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
});

export const UserModel = model("User", UserSchema);
