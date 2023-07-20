import jwt from 'jsonwebtoken';

if (!process.env.SESSION_SECRET_KEY) {
  throw new Error('SESSION_SECRET_KEY is not defined');
}

const secretKey = process.env.SESSION_SECRET_KEY;

export function encode(payload: string) {
  return jwt.sign(payload, secretKey);
}

export function decode(token: string) {
  return jwt.verify(token, secretKey);
}
