export class BaseController {
  constructor(app, routePath) {
    this.app = app;
    this.routePath = routePath;
    this.initializeRoutes();
  }

  initializeRoutes() {
    throw new Error("You have to implement the method initializeRoutes!");
  }
}
