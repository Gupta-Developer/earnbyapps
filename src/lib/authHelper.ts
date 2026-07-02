import { verifyToken } from './jwt';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export function getAuthenticatedUser(request: Request): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id || !decoded.email) {
      return null;
    }

    return {
      id: String(decoded.id),
      email: decoded.email,
      role: decoded.role || 'user',
    };
  } catch (error) {
    return null;
  }
}
