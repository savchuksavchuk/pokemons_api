import { BaseController } from "../../common/base/base.contoller.js";
import { PokemonService } from "./pokemon.service.js";
import { getPokemonsValidation } from "./validation/get-pokemons.validation.js";

export class PokemonController extends BaseController {
  constructor(app, routePath) {
    super(app, routePath);
  }

  initializeRoutes() {
    this.app.get(`${this.routePath}`, getPokemonsValidation, this.getPokemons);
  }

  async getPokemons(req, res, next) {
    try {
      const { page, count, search } = req.query;

      const pagination = await PokemonService.getPokemons(page, count, search);

      res.status(200).json(pagination);
    } catch (e) {
      next(e);
    }
  }
}
