import jwt from 'jsonwebtoken';

const secretKey = process.env.SESSION_SECRET_KEY || 'default_secret_key';

export function encode(payload: string) {
  return jwt.sign(payload, secretKey);
}

export function decode(token: string) {
  return jwt.verify(token, secretKey);
}
