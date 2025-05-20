import bcrypt from "bcrypt"

function comparePassword(password: string, hashedPassword: string): boolean {
  try {
    const match = bcrypt.compareSync(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
}

export { comparePassword };
