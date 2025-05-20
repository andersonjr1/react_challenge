import { ErrorStatus } from "../utils/error";
import { hashPassword } from "../utils/hashPassword";
import { authRepository as repository } from "../repository/authRepository";
import { comparePassword } from "../utils/comparePassword";
import { User } from "../types/user";
import { RegisterRequestBody, LoginRequestBody } from "../types/auth";
import { validateEmail, validatePassword, validateName } from "../utils/validators";

const authService = { 
    register: async (data: RegisterRequestBody): Promise<Partial<User>> => {
    try {
      let name = data.name;
      let email = data.email;
      let password = data.password;

      if (!name) {
        const error = new ErrorStatus("Digite um nome");
        error.status = 400;
        throw error;
      }

      if (!email) {
        const error = new ErrorStatus("Digite um email");
        error.status = 400;
        throw error;
      }

      if (!password) {
        const error = new ErrorStatus("Digite uma senha");
        error.status = 400;
        throw error;
      }

      name = name.trim();
      email = email.trim();
      password = password.trim();

      if (!validateName(name)) {
        const error = new ErrorStatus(
          "Nome inválido"
        );
        error.status = 401;
        throw error;
      }

      if (!validateEmail(email)) {
        const error = new ErrorStatus("Email invalido");
        error.status = 401;
        throw error;
      }

      if (!validatePassword(password)) {
        const error = new ErrorStatus(
          "Senha inválida"
        );
        error.status = 401;
        throw error;
      }
      
      const hashedPassword = hashPassword(password);
      
      const response = await repository.register({
        email,
        password: hashedPassword,
        name,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
    },
    login: async (email: string, password: string): Promise<Partial<User>> => {
        try {
          if (!email || !password) {
            const error = new ErrorStatus("Email e senha são obrigatórios");
            error.status = 400;
            throw error;
          }
    
          email = email.trim();
          password = password.trim();

    
          const user = await repository.login(email);
    
          if (!user) {
            const error = new ErrorStatus("Usuário não encontrado");
            error.status = 404;
            throw error;
          }
  
          if(user.password){
            const isPasswordValid = comparePassword(password, user.password);
      
            if (!isPasswordValid) {
              const error = new ErrorStatus("Senha inválida");
              error.status = 401;
              throw error;
            }
          }
    
          const {
            password: _,
            ...userWithoutSensitiveData
          } = user;
          return userWithoutSensitiveData;
      } catch (error) {
        throw error;
      }
    },
}

export {authService}