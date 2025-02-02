import { body, validationResult } from "express-validator";

export const validateLogin = [
  body("message").isString(),
  body("signature").isString(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
