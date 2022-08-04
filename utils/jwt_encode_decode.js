import jwt from 'jsonwebtoken';

export function encode(payload) {
  return jwt.sign(payload, process.env.SESSION_SECRET_KEY);
}

export function decode(token) {
  return jwt.verify(token, process.env.SESSION_SECRET_KEY);
}