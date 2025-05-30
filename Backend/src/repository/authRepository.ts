import { pool }  from "../database/db";
import { hashPassword } from "../utils/hashPassword";
import { ErrorStatus } from "../utils/error";
import { RegisterRequestBody, LoginRequestBody } from "../types/auth";
import { User } from "../types/user";


const authRepository = {
    register: async (data: RegisterRequestBody): Promise<User> => {
      try {
        const selectResponse = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [data.email]
        );

        if (selectResponse.rowCount != 0) {
          const error = new ErrorStatus(
          "Conta existe"
        );
          error.status = 401;
          throw error;
        }

        const insertResponse = await pool.query(
          "INSERT INTO users (email, password, name) VALUES ($1, $2, $3)",
          [data.email, data.password, data.name]
        );

        const selectResponseForId = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [data.email]
        );

        return { id: selectResponseForId.rows[0].id, email: data.email, name: data.name } as User;
      } catch (error) {
        throw error;
      }
    },
    login: async (email: string): Promise<User> => {
      try {
        const selectResponse = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
  
        const user = selectResponse.rows[0];
  
        return user;
      } catch (error) {
        throw error;
      }
    }
}

export {authRepository}