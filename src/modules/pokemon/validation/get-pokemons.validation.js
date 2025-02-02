import { query, validationResult } from "express-validator";

export const getPokemonsValidation = [
  query("page").isNumeric(),
  query("count").isNumeric(),
  query("search").isString(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
