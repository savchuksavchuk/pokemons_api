import { BaseController } from "../../common/base/base.contoller.js";
import { UserService } from "./user.service.js";
import { validateLogin } from "./validation/login.validation.js";

export class UserController extends BaseController {
  constructor(app, routePath) {
    super(app, routePath);
  }

  initializeRoutes() {
    this.app.get(`${this.routePath}/getMessageToSign`, this.getMessageToSign);
    this.app.post(`${this.routePath}/login`, validateLogin, this.loginUser);
  }

  getMessageToSign(_, res) {
    const nonce = UserService.getMessageToSign();
    res.status(200).json(nonce);
  }

  async loginUser(req, res) {
    const { message, signature } = req.body;

    const user = await UserService.loginUser(message, signature);

    res.status(200).json(user);
  }
}
