// @ts-expect-error TS(7016): Could not find a declaration file for module 'json... Remove this comment to see the full error message
import jwt from 'jsonwebtoken';

export function encode(payload: any) {
  return jwt.sign(payload, process.env.SESSION_SECRET_KEY);
}

export function decode(token: any) {
  return jwt.verify(token, process.env.SESSION_SECRET_KEY);
}
