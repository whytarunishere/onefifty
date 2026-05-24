import jwt from 'jsonwebtoken';

const TOKEN_EXPIRY = '7d';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function parseBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') return null;

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;

  return token;
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}
