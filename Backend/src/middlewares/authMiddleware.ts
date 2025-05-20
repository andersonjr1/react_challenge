import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";

const authToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.SESSION_ID;
    if (!token) {
      res
        .status(401)
        .json({ message: "Acesso negado! Usuário não autenticado" });
      return
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "Acesso negado! Token inválido ou expirado" });
    return
  }
};

export {
  authToken
};
