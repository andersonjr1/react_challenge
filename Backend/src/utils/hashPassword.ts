import bcrypt from "bcrypt"

function hashPassword(password:string): string{
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  } catch (error) {
    throw error;
  }
}

export { hashPassword };
