import jwt from "jsonwebtoken";

export const JWT_TOKEN_SALT = "jwtTokenSalt";

export const createToken = (value: string) => {
  return jwt.sign({ value: value }, JWT_TOKEN_SALT, { expiresIn: "1000" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_TOKEN_SALT);
};
