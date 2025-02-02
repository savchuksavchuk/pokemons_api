import { randomBytes } from "crypto";
import { verifyMessage } from "ethers";
import { UserModel } from "./user.model.js";

export class UserService {
  static getMessageToSign() {
    const nonce = randomBytes(32).toString("hex").slice(0, 32);
    const message = `Sign this message to authenticate: ${nonce}`;
    return message;
  }

  static async loginUser(message, signature) {
    const address = this.getRecoveredUserAddressFromSignature(
      message,
      signature
    );

    const existingUser = await this.getUserByAddress(address);

    if (existingUser) {
      return {
        _id: existingUser._id,
        address: existingUser.address,
      };
    }

    const newUser = await this.createUser(address);

    return {
      _id: newUser._id,
      address: newUser.address,
    };
  }

  static getRecoveredUserAddressFromSignature(message, signature) {
    return verifyMessage(message, signature);
  }

  static getUserByAddress(address) {
    return UserModel.findOne({ address });
  }

  static getUserById(userId) {
    return UserModel.findById(userId);
  }

  static createUser(address) {
    return UserModel.create({ address });
  }
}
