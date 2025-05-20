import jwt from "jsonwebtoken";
import { User } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
      body: User;
    }
  }
}
