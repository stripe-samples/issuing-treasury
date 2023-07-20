
import {parse} from 'cookie';
import {decode} from '../../utils/jwt_encode_decode';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(404).end();
  }

  const {app_auth} = parse(req.headers.cookie || '');

  if (!app_auth) {
    return res.json({isAuthenticated: false});
  }

  return res.json({
    isAuthenticated: true,
    user: decode(app_auth),
  });
}
