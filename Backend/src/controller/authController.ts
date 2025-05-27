import { ErrorStatus } from "../utils/error";
import { Request, Response } from "express";
import { authService as service } from "../service/authService";
import jwt from "jsonwebtoken";
import config from "../config/env";

interface RequestWithUser extends Request {
  user?: jwt.JwtPayload;
}

const authController = {
    register: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            const data = {name, email, password};
            const response = await service.register(data);
            const signature = jwt.sign(response, config.SECRET_KEY, { expiresIn: "7d" });
      
            res.cookie("SESSION_ID", signature, {
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            });

            res.status(201).json(response); // This expression is not call
          } catch (error) {
            if(error instanceof ErrorStatus){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ message: error.message });
            }
            if(error instanceof Error){
                res.status(500).json({ message: error.message });
            }
          }
    },
    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
      
            const response = await service.login(email, password);
            const signature = jwt.sign(response, config.SECRET_KEY, { expiresIn: "7d" });
      
            res.cookie("SESSION_ID", signature, {
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            });
      
            res.status(200).json({
              id: response.id,
              name: response.name,
              email: response.email,
            });
          } catch (error) {
            if(error instanceof ErrorStatus){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ message: error.message });
            }
            if(error instanceof Error){
                res.status(500).json({ message: error.message });
            }
          }
    },
    logout: async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie("SESSION_ID");
            res.status(200).json({ message: "Fez o logout com sucesso" });
          } catch (error) {
            if(error instanceof ErrorStatus){
                const statusCode = error.status || 500;
                res.status(statusCode).json({ message: error.message });
            }
            if(error instanceof Error){
                res.status(500).json({ message: error.message });
            }
          }
    },
    checkAuthStatus: async (req: Request, res: Response): Promise<void> => {
        try {
            const myRequest = req as RequestWithUser;

            if (!req.user) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }
            if(myRequest.user){
                const { id, name, email} = myRequest.user;
                res.status(200).json({message: "Usuario logado", data: { id, name, email }});
            }
        } catch (error) {
            if (error instanceof ErrorStatus) {
                const statusCode = error.status || 500;
                res.status(statusCode).json({ message: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Ocorreu um erro desconhecido ao verificar o status da autenticação." });
            }
        }
    }
}

export {authController}