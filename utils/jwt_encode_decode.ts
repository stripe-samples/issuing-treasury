import jwt from 'jsonwebtoken';

export function encode(payload: any) {
  return jwt.sign(payload, process.env.SESSION_SECRET_KEY);
}

export function decode(token: any) {
  return jwt.verify(token, process.env.SESSION_SECRET_KEY);
}
